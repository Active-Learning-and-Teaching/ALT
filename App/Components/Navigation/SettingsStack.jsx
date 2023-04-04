import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import FacultySettings from '../Settings/FacultySettings';
import { useRoute } from '@react-navigation/native';
const Stack = createStackNavigator();

function SettingsStack() {
	const routes = useRoute()
	const {type,user,course,setCourse} = routes.params
	return (
		<Stack.Navigator>
			<Stack.Screen name='Settings'
						  component={FacultySettings}
						  options={{
							  headerShown : true,
							  headerTitle : course.courseName,
							  headerBackTitle: '',
						  }}
						  initialParams={{
							  type : type,
							  user: user,
							  course: course,
							  setCourse : setCourse
						  }}
			/>
		</Stack.Navigator>
	)
}

export default SettingsStack
