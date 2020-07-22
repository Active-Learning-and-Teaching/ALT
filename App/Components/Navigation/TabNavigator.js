import React, {Component} from 'react';
import createBottomTabNavigator from '@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator';
import {Icon} from 'react-native-elements';
import AnnouncementStack from './AnnouncementStack';
import QuizStack from './QuizStack';
import FeedbackStack from './FeedbackStack';
import StudentStack from './StudentStack';

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
                        component={AnnouncementStack}
                        options={{
                            tabBarLabel: 'Announcements',
                            tabBarIcon: ({focused}) =>(
                                <Icon name='home' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                            ),
                        }}
                        initialParams={{
                            type : this.state.type,
                            user: this.state.user,
                            course: this.state.course
                        }}
                />
                <Tab.Screen name = "Quiz DashBoard"
                        component={QuizStack}
                        options={{
                            tabBarLabel: 'Quiz',
                            tabBarIcon: ({focused}) =>(
                                <Icon name='gamepad' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                            ),
                        }}
                        initialParams={{
                            type : this.state.type,
                            user: this.state.user,
                            course: this.state.course
                        }}
                />
                <Tab.Screen name = "Feedback DashBoard"
                        component={FeedbackStack}
                        options={{
                            tabBarLabel: 'Minute Paper',
                            tabBarIcon: ({focused}) =>(
                                <Icon name='comments' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                            ),
                        }}
                        initialParams={{
                            type : this.state.type,
                            user: this.state.user,
                            course: this.state.course
                        }}
                />
                <Tab.Screen name = "Student List"
                        component={StudentStack}
                        options={{
                            tabBarLabel: 'Students',
                            tabBarIcon: ({focused}) =>(
                                <Icon name='users' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                            ),
                        }}
                        initialParams={{
                            type : this.state.type,
                            user: this.state.user,
                            course: this.state.course
                        }}
                />

            </Tab.Navigator>
        );
    }

}
