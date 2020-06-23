import React, {Component} from 'react';
import createBottomTabNavigator from '@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator';
import {Icon} from 'react-native-elements';
import CoursePage from './CoursePage';
import KbcHomePage from './KbcHomePage';
import AttendanceHomePage from './AttendanceHomePage';
import FeedbackHomePage from './FeedbackHomePage';

const Tab = createBottomTabNavigator();

export default class TabNavigator extends Component{

    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            user : this.props.route.params.user,
            course : this.props.route.params.course
        }
    }

    render() {

        return (
            <Tab.Navigator initialRouteName = "Course DashBoard">
                <Tab.Screen name = "Course DashBoard"
                            component={CoursePage}
                            initialParams={{
                                type : this.state.type,
                                user: this.state.user,
                                course: this.state.course
                            }}
                            options={{
                                tabBarLabel: 'Home',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='home' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }}/>
                <Tab.Screen name = "Kbc DashBoard"
                            component={KbcHomePage}
                            initialParams={{
                                type : this.state.type,
                                user: this.state.user,
                                course: this.state.course
                            }}
                            options={{
                                tabBarLabel: 'KBC',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='gamepad' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }} />
                <Tab.Screen name = "Attendance DashBoard"
                            component={AttendanceHomePage}
                            initialParams={{
                                type : this.state.type,
                                user: this.state.user,
                                course: this.state.course
                            }}
                            options={{
                                tabBarLabel: 'Attendance',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='users' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }}/>
                <Tab.Screen name = "Feedback DashBoard"
                            component={FeedbackHomePage}
                            initialParams={{
                                type : this.state.type,
                                user: this.state.user,
                                course: this.state.course
                            }}
                            options={{
                                tabBarLabel: 'Feedback',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='comments' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }}/>
            </Tab.Navigator>
        );
    }

}
