import React from 'react';
import { CheckBox, Button } from 'react-native';
import MyHeader from './MyHeader';
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
import Toast from 'react-native-simple-toast';
import { StyleSheet,  TextInput} from "react-native";
import ThemeColors from "../constants/ThemeColors";
import { getToken } from '../helpers/manageTokens';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons'; 

class NewGroup extends React.Component{
    state={
        chatlist:[],
        groupList:[],
        groupName:'',
        user:null
    }
    async componentDidMount(){
        let user = JSON.parse(await getToken())
        this.setState({user})

        let data=[]
        await firebase.database().ref("/users").once('value').then(function(snapshot) {
        if (snapshot.exists()) {
            data = Object.entries(snapshot.val()).filter((f)=>{return (f[1].uid.toString() !== user.uid.toString())})
        }
        else {
            console.log(":error")
            return []
        }
        }).catch(function(error) {
        console.log(":error",error)
        return []
        });
        this.setState({chatlist: data})
    }
    create_UUID=()=>{
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
      }
    makeGroupPress=async ()=>{
        if(this.state.groupList.length<2){
            Toast.show('Please Select Two or More Group Members')
        }else if(this.state.groupName===''){
            Toast.show('Please Enter Group Name')
        }else{
            let group_uuid =await this.create_UUID()
            // let userList = this.state.groupList.map(m=>{
            //     console.log("m",m)
            //     return m.uid
            // })
            // console.log("userList",userList)
            let groupUsers  = [ ...this.state.groupList, this.state.user.uid]
            let group = {
                users:  groupUsers,
                uuid:   group_uuid ,
                groupName: this.state.groupName
            }
            await firebase.database().ref("/groups").push(group).then(function(snapshot) {
                for(let i=0;i<groupUsers.length;i++){
                    firebase.database().ref('users/'+groupUsers[i]+"/groups/"+group_uuid).set(group).then(u=>{
                        
                    }).catch(c=>{
                        
                    })
                }
            })
            .catch(function(error) {
                console.log(":error",error)
                return []
            });
            this.setState({
                groupList:[],
                groupName:'',
                chatlist:this.state.chatlist.map(m=>{return {...m, checkbox:false}})
            })
        }
    }
    render(){
        return <Container>
            <MyHeader showGoBack={true} title="New Group" showSearch={false} navigation={this.props.navigation}/>
            <TextInput
                style={styles.input}
                value={this.state.groupName}
                placeholder="Type Group Name Here.."
                onChangeText={(e)=>{
                    this.setState({groupName:e})
                }}
            />
            <List
                dataArray={this.state.chatlist}
                keyExtractor={(item,index) => index + item}
                renderRow={(chat,sec,i) => (
                    <ListItem avatar>
                        <Left>
                            <CheckBox
                                value={chat.checkbox}
                                onValueChange={(e)=>{
                                    
                                    console.log("e", e, i)
                                    let temp_chats = this.state.chatlist
                                    temp_chats[i].checkbox = e
                                    this.setState({chatlist:temp_chats})

                                    let group_temp =this.state.groupList
                                    console.log("temp_chats[i] uid",temp_chats[i][1].uid)
                                    if(e){
                                        group_temp.push(temp_chats[i][1].uid)
                                    }else{
                                        group_temp.filter((f)=>f !== temp_chats[i][1].uid )
                                    }
                                    console.log("group_temp",group_temp)
                                    this.setState({groupList:group_temp})
                                }}
                                style={styles.checkbox}
                            />
                            {chat.contactAvatar ?
                            <Thumbnail source={{ uri: chat.contactAvatar }} />:
                            <FontAwesome name="user-circle-o" size={50} color="black" />
                            }
                        </Left>
                        <Body>
                            <Text>{chat[1].username}</Text>
                            <Text note style={styles.lineHeight}>
                            {chat[1].lastmessage}
                            </Text>
                        </Body>
                        <Right>
                            <Text note>{chat[1].lastmessage_seen}</Text>
                        </Right>
                    </ListItem>
                )}
            />
            <Button   
                color="teal"
                style={styles.button} 
                onPress={this.makeGroupPress}
                // disabled={true}
                title="Make Group"></Button>
            
        </Container>
    }
}

const styles = StyleSheet.create({
    lineHeight: {
      height: 24
    },
    fab: {
      backgroundColor: ThemeColors.secondary
    },
    checkbox:{
        // marginLeft:-20,
        marginTop:8
    },
    input:{
        position:"relative",
        padding: 5,
        paddingLeft:20,
        borderWidth: 1,
        marginLeft:0,
        borderColor: '#dedede',
        // borderRadius:20,
        width: '100%',
        fontSize:17,
        height:50,
        color: '#000000'
    },
    button:{
        width:'100%',
        backgroundColor:"teal",
    }
  });
export default NewGroup;
