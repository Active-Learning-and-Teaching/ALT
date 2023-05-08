import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import FacultySettings from '../Settings/FacultySettings';

const Stack = createStackNavigator();

export default class SettingsStack extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.route.params.type,
            user: this.props.route.params.user,
            course: this.props.route.params.course,
            setCourse : this.props.route.params.setCourse
        }
    }

    render() {

        return (
            <Stack.Navigator>
                <Stack.Screen name='Settings'
                              component={FacultySettings}
                              options={{
                                  headerShown : true,
                                  headerTitle : this.state.course.courseName,
                                  headerBackTitle: '',
                              }}
                              initialParams={{
                                  type : this.state.type,
                                  user: this.state.user,
                                  course: this.state.course,
                                  setCourse : this.state.setCourse
                              }}
                />
            </Stack.Navigator>
        )
    }
}
