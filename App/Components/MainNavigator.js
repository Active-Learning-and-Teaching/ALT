import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import CheckUserLoggedIn from './CheckUserLoggedIn';
import LogIn from './LogIn';
import RegisterUser from './RegisterUser';
import StudentOrFaculty from './StudentOrFaculty';
import StudentDashBoard from './StudentDashBoard';
import CourseAdd from './CourseAdd';
import FacultyDashBoard from './FacultyDashBoard';
import TabNavigator from './TabNavigator';

export default class MainNavigator extends Component{

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
