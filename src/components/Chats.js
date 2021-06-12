import React, { Component } from "react";
import { StyleSheet } from "react-native";
import firebase from 'firebase';

import {
  Container,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text
} from "native-base";
// import {
//   NavigationParams,
//   NavigationScreenProp,
//   NavigationState
// } from 'react-navigation';
// import { withNavigation } from 'react-navigation';
// import Moment from "moment";
import ThemeColors from "../constants/ThemeColors";
import { FontAwesome } from '@expo/vector-icons'; 

import ChatScreen from "../screens/ChatScreen"
import BackButton from './BackButton'
import MyHeader from "./MyHeader"
import { getToken } from "../helpers/manageTokens";
import Routing from "../screens/Routing";
// import Routing from "../screens/Routing";

export default class Chats extends Component {

  state={
    chatlist: [],
    navigateToChat: false,
    currentUser: "",
    user:null,
    navToR:false
  }
  async componentDidMount(){

    let user = JSON.parse(await getToken())
    this.setState({user})

    let data=[]
    let u=null
    await firebase.database().ref("/users").on('value', snapshot=> {
      console.log("snapshot", Object.entries(snapshot.val()))
      if (snapshot.exists()) {
        u = Object.entries(snapshot.val()).filter((f)=>{
          console.log("f-->",f[1])
          return (f[1].uid.toString() === user.uid.toString())
        })
        data = Object.entries(snapshot.val()).filter((f)=>{return (f[1].uid.toString() !== user.uid.toString())})
      }
      else {
        console.log(":error")
        return []
      }
    })
    console.log("U",u[0])
    let garray = await u[0][1].groups ? Object.entries(u[0][1].groups).map(m=>{
      return ['',{
        username: m[1].groupName,
        group: true,
        groupID: m[1].uuid
      }] 
    }):[]
    console.log("data",data)
    data= [...data,...garray]
    console.log("garray",data)
    this.setState({chatlist: data })
  }
  componentDidUpdate(){
    console.log("compnent didi update")
  }
  onChatPressed=(chat)=>{
    if(chat[1].group){
      var currUser = chat[1];
      currUser["chatkey"] = chat[1].groupID
      this.props.navigation.navigate('ChatScreen', { currentUser: currUser } )
    }else{
      var user = this.state.user;
      this.setState({
        currentUser: chat[1]
      })
  
      let chatkey 
      let f =chat[1].chats && Object.entries(chat[1].chats).find(f=>f[1].user.toString()===this.state.user.uid.toString())
      if(f && f[1]?.chatkey){
        chatkey = f[1].chatkey
      }else{
        chatkey = chat[1].uid+user.uid
        firebase.database().ref('users/'+user.uid+"/chats/"+chatkey).set({
          chatkey,
          user : chat[1].uid,
          lastmessage:""
        }).then(u=>{
          firebase.database().ref('users/'+chat[1].uid+"/chats/"+chatkey).set({
            chatkey,
            user : user.uid,
            lastmessage:""
          }).then(u=>{
      
          }).catch(c=>{
            
          })
        }).catch(c=>{
          
        })
    
        
      }
      var currUser = chat[1];
      currUser["chatkey"] = chatkey
      this.props.navigation.navigate('ChatScreen', { currentUser: currUser } )
      this.setState({currentUser: currUser})
    }
  }
  render() {
    if(this.state.navToR) return <Routing/>
    return (
      <Container >
        <MyHeader navigation={this.props.navigation} navigationToRouting={()=>{
          this.setState({navToR:true})
        }} showoptions={true} showSearch={true} showGoBack={false} title = "ChatApp"
        
        //  navigation = {this.props.navigation}
         />
        {this.state.chatlist.length ? <List
          dataArray={this.state.chatlist}
          keyExtractor={(item, index) => index + item}
          renderRow={chat => (
            <ListItem onPress={()=>this.onChatPressed(chat)}  avatar>
              <Left>
                {chat.contactAvatar ?
                  <Thumbnail source={{ uri: chat.contactAvatar }} />:
                  <FontAwesome name="user-circle-o" size={50} color="black" />
                }
              </Left>
              <Body>
                <Text>{chat[1].username}</Text>
                <Text note style={styles.lineHeight}>
                  {chat[1].lastmessage || ''}
                </Text>
              </Body>
              <Right>
                <Text note>{chat[1].lastmessage_seen}</Text>
              </Right>
            </ListItem>
          )}
        />: <Text>No Other User Found</Text>}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  lineHeight: {
    height: 24
  },
  fab: {
    backgroundColor: ThemeColors.secondary
  }
});
