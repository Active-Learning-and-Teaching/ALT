import React, { FC, useState } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import CheckUserLoggedIn from './screens/checkloggin';
import LogIn from './screens/LoginScreen';
import RegisterUser from './screens/RegisterUser';
import StudentOrFaculty from './screens/SignupScreen';
import StudentDashBoard from './dashboard/studentDashboard';
import FacultyDashBoard from './dashboard/facultyDashboard';
import ProfileOptions from './dashboard/profileOptions';
import CourseAdd from './dashboard/courseAdd';

// Define types for user data if needed (e.g., User type)
interface User {
  // Define properties of the User type based on your use case
  id: string;
  name: string;
  email: string;
}

// Type for initial params
interface MainNavigatorParams {
  setUser?: (user: User | null) => void;
}

// Create the navigation stack type
type StackParamList = {
  Loading: undefined;
  Login: undefined;
  'Register User': undefined;
  'User Type': undefined;
  'Student DashBoard': { setUser: (user: User | null) => void };
  'Faculty DashBoard': { setUser: (user: User | null) => void };
  Course: undefined;
};

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

function MainNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const Stack = createStackNavigator<StackParamList>();

  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'white',
          },
        }}>
        <Stack.Screen
          name="Loading"
          component={CheckUserLoggedIn}
          options={{
            headerLeft: () => null,
            headerTitle: 'Loading',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LogIn}
          options={{
            headerLeft: () => null,
            headerTitle: 'Login',
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
            setUser,
          }}
          options={{
            headerLeft: () => (
              <ProfileOptions
                type='student'
              />
            ),
            headerRight: () => (
              <CourseAdd 
                type='student'
                student={user}
              />
            ),
            headerTitle: 'Dashboard',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Faculty DashBoard"
          component={FacultyDashBoard}
          initialParams={{
            setUser,
          }}
          options={{
            headerLeft: () => null,
            headerTitle: 'Dashboard',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
