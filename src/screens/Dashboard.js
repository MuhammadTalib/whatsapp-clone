import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Container } from 'native-base'
import Chats  from "../components/Chats"
import ChatScreen from "../screens/ChatScreen"
import { createStackNavigator } from '@react-navigation/stack'
import NewGroup from '../components/NewGroup'
const Stack = createStackNavigator()

const Dashboard = () => (
  <Container >
    <NavigationContainer independent={true}>
        <Stack.Navigator
          initialRouteName="Chats"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Chats" component={Chats} />
          <Stack.Screen name="ChatScreen" component={ChatScreen}/>
          <Stack.Screen name="NewGroup" component={ NewGroup }/>

        </Stack.Navigator>
      </NavigationContainer>
  </Container>
)

export default Dashboard
