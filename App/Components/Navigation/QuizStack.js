import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import QuizHomePage from '../Quiz/QuizHomePage';
import {useRoute} from '@react-navigation/native';

const Stack = createStackNavigator();

export default class QuizStack extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.route.params.type,
            user: this.props.route.params.user,
            course: this.props.route.params.course
        }
    }

    render() {

        return (
            <Stack.Navigator>
                <Stack.Screen name='Quiz'
                       component={QuizHomePage}
                       options={{
                           headerShown : true,
                           headerTitle : this.state.course.courseName,
                           headerBackTitle: '',
                       }}
                       initialParams={{
                           type : this.state.type,
                           user: this.state.user,
                           course: this.state.course
                       }}
                />
            </Stack.Navigator>
        )
    }
}
