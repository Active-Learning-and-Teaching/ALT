import React, {Component} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';

import LogIn from './Components/LogIn';
import RegisterUser from './Components/RegisterUser';
import CheckUserLoggedIn from './Components/CheckUserLoggedIn';
import DashBoard from './Components/DashBoard';

const Stack = createStackNavigator();

function MyStack(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="CheckUserLoggedIn">
                <Stack.Screen name = "Loading" component={CheckUserLoggedIn}/>
                <Stack.Screen name = "Login" component={LogIn}/>
                <Stack.Screen name = "Register User" component={RegisterUser}/>
                <Stack.Screen name = "DashBoard" component={DashBoard}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default class App extends Component{

    render() {
        return (
            <MyStack/>
        );
    }

}
