import React, {Component} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from './Components/LogIn';
import RegisterUser from './Components/RegisterUser';
import CheckUserLoggedIn from './Components/CheckUserLoggedIn';
import StudentDashBoard from './Components/StudentDashBoard';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config'
import FacultyDashBoard from './Components/FacultyDashBoard';
import TabNavigator from './Components/TabNavigator';

const Stack = createStackNavigator();

function MyStack(){
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="CheckUserLoggedIn"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                }}>
                <Stack.Screen name = "Loading" component={CheckUserLoggedIn}
                        options={{
                            headerTitle : "Loading",
                            headerLeft : null,
                        }}/>
                <Stack.Screen name = "Login" component={LogIn}
                          options={{
                              headerTitle : "Login",
                              headerLeft : null,
                          }}/>
                <Stack.Screen name = "Register User" component={RegisterUser}
                          options={{
                              headerTitle : "Register",
                          }}/>
                <Stack.Screen name = "Student DashBoard" component={StudentDashBoard}
                          options={{
                              headerTitle : "Dashboard",
                              headerLeft : null,
                              // headerRight : {CourseAdd}
                          }}/>
                <Stack.Screen name = "Faculty DashBoard" component={FacultyDashBoard}
                              options={{
                                  headerTitle : "Dashboard",
                                  headerLeft : null,
                                  // headerRight : {CourseAdd}
                              }}/>
                <Stack.Screen name = "Course" component={TabNavigator}
                              options={{
                                  headerTitle : null,
                                  // headerRight : {CourseAdd}
                              }}/>
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
