import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import QuizHomePage from '../quiz/quizHomePage';
import Courses from '../database/courses';

const Stack = createStackNavigator();

interface RouteParams {
    type: string;
    course: Courses;
    user: {
        url: string;
        name: string;
        email: string;
    };
}


const QuizStack: React.FC = () => {
    const routes = useRoute();
    const {type, user, course} = routes.params as RouteParams;

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Quiz"
                component={QuizHomePage as any}
                options={{
                    headerShown: true,
                    headerTitle: course.courseName,
                    headerBackTitle: '',
                }}
                initialParams={{
                    type: type,
                    user: user,
                    course: course,
                }}
            />
        </Stack.Navigator>
    );
};

export default QuizStack;