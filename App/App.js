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
import StudentDashBoard from './Components/StudentDashBoard';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config'
import FacultyDashBoard from './Components/FacultyDashBoard';
import CoursePage from './Components/CoursePage';
import KbcHomePage from './Components/KbcHomePage';
import AttendanceHomePage from './Components/AttendanceHomePage';
import FeedbackHomePage from './Components/FeedbackHomePage';

const Stack = createStackNavigator();

function MyStack(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="CheckUserLoggedIn">
                <Stack.Screen name = "Loading" component={CheckUserLoggedIn}/>
                <Stack.Screen name = "Login" component={LogIn}/>
                <Stack.Screen name = "Register User" component={RegisterUser}/>
                <Stack.Screen name = "Student DashBoard" component={StudentDashBoard}/>
                <Stack.Screen name = "Faculty DashBoard" component={FacultyDashBoard}/>

                <Stack.Screen name = "Course DashBoard" component={CoursePage}/>
                <Stack.Screen name = "Kbc DashBoard" component={KbcHomePage}/>
                <Stack.Screen name = "Attendance DashBoard" component={AttendanceHomePage}/>
                <Stack.Screen name = "Feedback DashBoard" component={FeedbackHomePage}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default class App extends Component{

    componentDidMount(): void {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: config.webClientId,
            offlineAccess: true
        })
    }

    render() {
        return (
            <MyStack/>
        );
    }

}
