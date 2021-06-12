import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import ThemeColors from "../constants/ThemeColors";
import { getToken } from '../helpers/manageTokens'

export default class StartScreen extends React.Component {
  async componentDidMount(){
    let user = await getToken()
    // console.log("user",user)
    if(user){
      // console.log("user2",user)
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      })
    }
  }
  
  render(){
    return <Background>
    <Button mode="contained" onPress={() => this.props.navigation.navigate('LoginScreen')}>
      Login
    </Button>
    <Button
      mode="outlined"
      onPress={() => this.props.navigation.navigate('RegisterScreen')}
    >
      Sign Up
    </Button>
  </Background>
  }
  
}

