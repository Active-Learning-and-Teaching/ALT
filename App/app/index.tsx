import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen'; // Your Login page
import SignUpScreen from './screens/SignupScreen'; // Your Sign Up page
import StudentDashBoard from './dashboard/studentDashboard'; // Your Student Dashboard page
import RegisterUser from './screens/RegisterUser';
import CheckUserLoggedIn from './screens/checkloggin';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true} children={null}>
      <Stack.Navigator screenOptions={{ headerShown: false }} children={null}>
        <Stack.Screen name="CheckUserLoggedIn" component={CheckUserLoggedIn} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="User Type" component={SignUpScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
        <Stack.Screen name="StudentDashboard" component={StudentDashBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
