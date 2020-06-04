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
import CoursePage from './Components/CoursePage';
import KbcHomePage from './Components/KbcHomePage';
import AttendanceHomePage from './Components/AttendanceHomePage';
import FeedbackHomePage from './Components/FeedbackHomePage';
import createBottomTabNavigator from '@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator';
import {Icon} from 'react-native-elements';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTab() {

    return(
        <Tab.Navigator initialRouteName = "CoursePage">
            <Tab.Screen name = "Course DashBoard" component={CoursePage}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({focused}) =>(
                                    <Icon name='home' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                        }}/>
            <Tab.Screen name = "Kbc DashBoard" component={KbcHomePage}
                        options={{
                            tabBarLabel: 'KBC',
                            tabBarIcon: ({focused}) =>(
                                <Icon name='gamepad' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                            ),
                        }} />
            <Tab.Screen name = "Attendance DashBoard" component={AttendanceHomePage}
                        options={{
                            tabBarLabel: 'Attendance',
                            tabBarIcon: ({focused}) =>(
                                <Icon name='users' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                            ),
                        }}/>
            <Tab.Screen name = "Feedback DashBoard" component={FeedbackHomePage}
                        options={{
                            tabBarLabel: 'Feedback',
                            tabBarIcon: ({focused}) =>(
                                <Icon name='comments' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                            ),
                        }}/>
        </Tab.Navigator>
    )
}

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
                <Stack.Screen name = "Course" component={BottomTab}/>
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
