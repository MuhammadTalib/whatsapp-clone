import React from "react";
import { StyleSheet } from "react-native";
import { Header, Body, Right, Button, Icon, Title } from "native-base";
import ThemeColors from "../constants/ThemeColors";
import BackButton from './BackButton'
import OptionsMenu from "react-native-option-menu";
import { MaterialIcons } from '@expo/vector-icons';
import { storeToken } from '../helpers/manageTokens';
import firebase from 'firebase';

const styles = StyleSheet.create({
  header: {
    backgroundColor: ThemeColors.primary
  },
  goback:{
    
  },
  voiceicon:{
    fontSize: 25,
    marginBottom:20
  },
});

class MyHeader extends React.Component {
  
  logout=()=>{
    firebase.auth().signOut().then(() => {
      storeToken(null)
      this.props.navigationToRouting(true)
    }).catch((error) => {
      // An error happened.
    });
  }
  addNewGroup=()=>{
    // this.props.navigateToNewGroup()
    this.props.navigation.navigate("NewGroup")
  }
  render() {
    return (
      <Header hasTabs noShadow transparent noLeft style={styles.header}>
        {this.props.showGoBack && <BackButton goBack={this.props.navigation.goBack} />}
        <Body>
          <Title style={{
            marginLeft:30,
            marginBottom:0
          }}>{this.props.title}</Title>
        </Body>
        <Right>    
          {this.props.showSearch && <Button transparent>
            <Icon  name="search" />
          </Button>}
          {/* {this.props.showoptions && <Button transparent>
            <Icon type="SimpleLineIcons" name="options-vertical" />
          </Button>} */}

          {this.props.showoptions && <OptionsMenu
            customButton={<Icon style={{color:"white", fontSize:25, marginBottom:10}} type="SimpleLineIcons" name="options-vertical" />}
            buttonStyle={{ width: 30, height: 30, color:'white', resizeMode: "contain" }}
            destructiveIndex={1}
            options={["New Group","Logout", "Cancel"]}
            actions={[this.addNewGroup,this.logout]}
          />}

        </Right>
      </Header>
    );
  }
}

export default MyHeader;