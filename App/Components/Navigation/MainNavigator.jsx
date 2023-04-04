import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import CheckUserLoggedIn from '../Authentication/CheckUserLoggedIn';
import LogIn from '../Authentication/LogIn';
import RegisterUser from '../Authentication/RegisterUser';
import StudentOrFaculty from '../Authentication/StudentOrFaculty';
import StudentDashBoard from '../Dashboard/StudentDashBoard';
import CourseAdd from '../Dashboard/CourseAdd';
import FacultyDashBoard from '../Dashboard/FacultyDashBoard';
import TabNavigator from './TabNavigator';

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
	const [user,setUser] = useState()
	const Stack = createStackNavigator();

	return (
		<NavigationContainer theme = {MyTheme}>
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
								  setUser : setUser
							  }}
							  options={{
								  headerTitle : "Dashboard",
								  headerLeft : null,
								  gestureEnabled: false,
								  headerRight : ()=>(
									  <CourseAdd
										  type = {"student"}
										  student ={user}
									  />
								  )
							  }}/>
				<Stack.Screen name = "Faculty DashBoard" component={FacultyDashBoard}
							  initialParams={{
								  setUser : setUser
							  }}
							  options={{
								  headerTitle : "Dashboard",
								  headerLeft : null,
								  gestureEnabled: false,
								  headerRight : ()=>(
									  <CourseAdd
										  type = {"faculty"}
										  instructor = {user}
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

export default MainNavigator
