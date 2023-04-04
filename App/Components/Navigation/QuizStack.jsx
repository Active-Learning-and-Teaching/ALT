import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import QuizHomePage from '../Quiz/QuizHomePage';
import {useRoute} from '@react-navigation/native';
const Stack = createStackNavigator();

function QuizStack() {
	const routes = useRoute()
	const {type,user,course} = routes.params
	
	return (
		<Stack.Navigator>
			<Stack.Screen name='Quiz'
				   component={QuizHomePage}
				   options={{
						headerShown : true,
						headerTitle : course.courseName,
						headerBackTitle: '',
				   }}
				   initialParams={{
						type : type,
						user: user,
						course: course
				   }}
			/>
		</Stack.Navigator>
	)
}

export default QuizStack
