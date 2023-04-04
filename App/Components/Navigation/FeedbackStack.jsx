import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import FeedbackHomePage from '../Feedback/FeedbackHomePage';
import { useRoute } from '@react-navigation/native';
const Stack = createStackNavigator();

function FeedbackStack() {
    const routes = useRoute()
    const {type,user,course} = routes.params

    return (
        <Stack.Navigator>
            <Stack.Screen name='Feedback'
                   component={FeedbackHomePage}
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

export default FeedbackStack
