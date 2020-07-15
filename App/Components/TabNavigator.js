import React, {Component} from 'react';
import createBottomTabNavigator from '@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator';
import {Icon} from 'react-native-elements';
import CoursePage from './CoursePage';
import KbcHomePage from './KbcHomePage';
import FeedbackHomePage from './FeedbackHomePage';
import StudentList from './StudentList';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native';
import CourseAdd from './CourseAdd';

const Tab = createBottomTabNavigator();
const Stack1 = createStackNavigator();
const Stack2 = createStackNavigator();
const Stack3 = createStackNavigator();
const Stack4 = createStackNavigator();

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

        const AnnouncementStack = () => {
            return (
                <Stack1.Navigator>
                    <Stack1.Screen name='Announcements'
                        component={CoursePage}
                        options={{
                            headerTitle : null,
                            headerShown : true,
                            headerBackTitle: '',
                            headerRight : ()=>(
                                this.state.type==='faculty' ?
                                <CourseAdd
                                    course ={this.state.course}
                                />
                                :
                                    null
                            )
                        }}
                        initialParams={{
                            type : this.state.type,
                            user: this.state.user,
                            course: this.state.course
                        }}
                    />
                </Stack1.Navigator>
            );
        };

        const QuizStack = () => {
            return (
                <Stack2.Navigator>
                    <Stack2.Screen name='Quiz'
                           component={KbcHomePage}
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
                </Stack2.Navigator>
            );
        };

        const FeedbackStack = () => {
            return (
                <Stack3.Navigator>
                    <Stack3.Screen name='Feedback'
                           component={FeedbackHomePage}
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
                </Stack3.Navigator>
            );
        };

        const StudentStack = () => {
            return (
                <Stack4.Navigator>
                    <Stack4.Screen name='StudentList'
                           component={StudentList}
                           options={{
                               headerShown : true,
                               headerTitle : this.state.course.courseName,
                               headerBackTitle: '',
                               headerRight : ()=>(
                                   this.state.type==='faculty' ?
                                       <Icon
                                           name='ellipsis-v'
                                           type='font-awesome'
                                           style={{borderRadius:1, padding:10}}
                                           // onPress={alert("Mail Student list?")}
                                       />
                                       :
                                       null
                               )
                           }}
                           initialParams={{
                               type : this.state.type,
                               user: this.state.user,
                               course: this.state.course
                           }}
                    />
                </Stack4.Navigator>
            );
        };


        return (
            <Tab.Navigator initialRouteName = "Course DashBoard">
                <Tab.Screen name = "Course DashBoard"
                            component={AnnouncementStack}
                            options={{
                                tabBarLabel: 'Announcements',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='home' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }}/>
                <Tab.Screen name = "Quiz DashBoard"
                            component={QuizStack}
                            options={{
                                tabBarLabel: 'Quiz',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='gamepad' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }} />
                <Tab.Screen name = "Feedback DashBoard"
                            component={FeedbackStack}
                            options={{
                                tabBarLabel: 'Minute Paper',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='comments' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }}/>
                <Tab.Screen name = "Student List"
                            component={StudentStack}
                            options={{
                                tabBarLabel: 'Students',
                                tabBarIcon: ({focused}) =>(
                                    <Icon name='users' type='font-awesome' size={28} color={focused?"#1E90FF":"grey"}/>
                                ),
                            }}/>

            </Tab.Navigator>
        );
    }

}
