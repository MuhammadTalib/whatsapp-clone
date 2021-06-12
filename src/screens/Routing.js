import React from 'react';
import { Provider } from 'react-native-paper'
import { StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { StartScreen, LoginScreen, RegisterScreen, Dashboard, ChatScreen } from '.';
import { theme } from '../core/theme'

StatusBar.setBarStyle('light-content')
const Stack = createStackNavigator()  
class Routing extends React.Component {
    state = {  }
    render() { 
        return ( <Provider theme={theme}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="StartScreen"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="StartScreen" component={StartScreen } />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                {/* <Stack.Screen name="ChatScreen" component={ChatScreen}/> */}
    
              </Stack.Navigator>
            </NavigationContainer>
          </Provider> );
    }
}
 
export default Routing;