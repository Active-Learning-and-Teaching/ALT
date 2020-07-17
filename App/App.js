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
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/MaterialIcons';
import StudentOrFaculty from './Components/StudentOrFaculty';
import CourseAdd from './Components/CourseAdd';
IconF.loadFont();
IconM.loadFont();
IconI.loadFont();

console.disableYellowBox = true;

export default class App extends Component{

    constructor() {
        super();
        this.state = {
            user : null
        }
        this.setUser = this.setUser.bind(this)
    }

    async setUser(user) {
        await this.setState({
            user : user
        })
    }

    componentDidMount(): void {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: config.webClientId,
            offlineAccess: true
        })
    }

    render() {

        const Stack = createStackNavigator();

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
                                      gestureEnabled: false
                                  }}/>
                    <Stack.Screen name = "Login" component={LogIn}
                                  options={{
                                      headerTitle : "Login",
                                      headerLeft : null,
                                      gestureEnabled: false
                                  }}/>
                    <Stack.Screen name = "Register User" component={RegisterUser}
                                  options={{
                                      headerTitle : "Register",
                                  }}/>
                    <Stack.Screen name = "User Type" component={StudentOrFaculty}
                                  options={{
                                      headerTitle : "Register",
                                  }}/>
                    <Stack.Screen name = "Student DashBoard" component={StudentDashBoard}
                                  initialParams={{
                                      setUser : this.setUser
                                  }}
                                  options={{
                                      headerTitle : "Dashboard",
                                      headerLeft : null,
                                      gestureEnabled: false,
                                      headerRight : ()=>(
                                          <CourseAdd
                                              type = {"student"}
                                              student ={this.state.user}
                                          />
                                      )
                                  }}/>
                    <Stack.Screen name = "Faculty DashBoard" component={FacultyDashBoard}
                                  initialParams={{
                                      setUser : this.setUser
                                  }}
                                  options={{
                                      headerTitle : "Dashboard",
                                      headerLeft : null,
                                      gestureEnabled: false,
                                      headerRight : ()=>(
                                          <CourseAdd
                                              type = {"faculty"}
                                              instructor = {this.state.user}
                                          />)
                                  }}/>
                    <Stack.Screen name = "Course" component={TabNavigator}
                                  options={{
                                      headerShown : false
                                  }}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

}
