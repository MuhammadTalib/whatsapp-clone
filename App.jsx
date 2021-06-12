import React from "react";
import { StatusBar } from 'react-native'
// import { Provider } from 'react-native-paper'
// import { NavigationContainer } from '@react-navigation/native'
// import { createStackNavigator } from '@react-navigation/stack'
import {  View } from "native-base";
import firebase from 'firebase';
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
// import {
//   StartScreen,
//   LoginScreen,
//   RegisterScreen,
//   Dashboard
// } from './src/screens'
// import ChatScreen from "./src/screens/ChatScreen"
// import { theme } from './src/core/theme'
import Routing from "./src/screens/Routing";
// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Remote debugger','Setting a timer']);
StatusBar.setBarStyle('light-content')
// const Stack = createStackNavigator()  

export default class App extends React.Component {
  state={
    isReady: false
  }
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    // setTimeout(()=>{
      this.setState({ isReady: true })
    // },1000)
  }
  UNSAFE_componentWillMount() {
    var config = {
      apiKey: 'AIzaSyDPBMXNtkKz5XtI3S2VZy5moEX2uoyQoq8',
      authDomain: 'chatroom-93691.firebaseapp.com',
      databaseURL: 'https://chatroom-93691.firebaseio.com',
      projectId: 'chatroom-93691',
      storageBucket: 'chatroom-93691.appspot.com',
      appId: '1:1045387237305:android:85bf983301b97c8d'
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }else {
        firebase.app();
    }
  }

  render() {
    if (!this.state.isReady) {
      return (
        <View></View>
      );
    }
    return (
      <Routing/>
    );
  }
}
