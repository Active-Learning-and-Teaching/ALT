import React, {Component, createRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import CheckUserLoggedIn from '../Authentication/CheckUserLoggedIn';
import LogIn from '../Authentication/LogIn';
import RegisterUser from '../Authentication/RegisterUser';
import StudentOrFaculty from '../Authentication/StudentOrFaculty';
import StudentDashBoard from '../Dashboard/StudentDashBoard';
import CourseAdd from '../Dashboard/CourseAdd';
import FacultyDashBoard from '../Dashboard/FacultyDashBoard';
import TabNavigator from './TabNavigator';
//import {create} from 'eslint/lib/rules/*';
//import analytics from '@react-native-firebase/analytics';

const MyTheme = {
  dark: false,
  colors: {
    primary: 'black',
    background: '#e6e6e6',
    card: 'white',
    text: 'black',
    border: 'gray',
    notification: 'black',
  },
};

export default class MainNavigator extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
    this.setUser = this.setUser.bind(this);
    this.routeNameRef = React.createRef();
    this.navigationRef = React.createRef();
  }

  // componentDidMount() {
  //   analytics().logScreenView({screen_class: 'home', screen_name: 'home'});
  //   //analytics().setUserProperties({['username']: 'Adrian'});
  //   analytics().logLogin({method: 'google.com'});
  // }

  async setUser(user) {
    await this.setState({
      user: user,
    });
  }

  render() {
    const Stack = createStackNavigator();
    routeNameRef = this.routeNameRef;
    navigationRef = this.navigationRef;
    return (
      <NavigationContainer
        theme={MyTheme}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}>
        <Stack.Navigator
          initialRouteName="CheckUserLoggedIn"
          screenOptions={{
            headerStyle: {
              backgroundColor: 'white',
            },
          }}>
          <Stack.Screen
            name="Loading"
            component={CheckUserLoggedIn}
            options={{
              headerTitle: 'Loading',
              headerLeft: null,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LogIn}
            options={{
              headerTitle: 'Login',
              headerLeft: null,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Register User"
            component={RegisterUser}
            options={{
              headerTitle: 'Register',
            }}
          />
          <Stack.Screen
            name="User Type"
            component={StudentOrFaculty}
            options={{
              headerTitle: 'Register',
            }}
          />
          <Stack.Screen
            name="Student DashBoard"
            component={StudentDashBoard}
            initialParams={{
              setUser: this.setUser,
            }}
            options={{
              headerTitle: 'Dashboard',
              headerLeft: null,
              gestureEnabled: false,
              headerRight: () => (
                <CourseAdd type={'student'} student={this.state.user} />
              ),
            }}
          />
          <Stack.Screen
            name="Faculty DashBoard"
            component={FacultyDashBoard}
            initialParams={{
              setUser: this.setUser,
            }}
            options={{
              headerTitle: 'Dashboard',
              headerLeft: null,
              gestureEnabled: false,
              headerRight: () => (
                <CourseAdd type={'faculty'} instructor={this.state.user} />
              ),
            }}
          />
          <Stack.Screen
            name="Course"
            component={TabNavigator}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
