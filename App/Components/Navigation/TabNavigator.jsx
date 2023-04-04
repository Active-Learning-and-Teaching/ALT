import React from 'react';
import createBottomTabNavigator from '@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator';
import {Icon} from 'react-native-elements';
import AnnouncementStack from './AnnouncementStack';
import QuizStack from './QuizStack';
import FeedbackStack from './FeedbackStack';
import StudentStack from './StudentStack';
import SettingsStack from './SettingsStack';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function TabNavigator() {
    const route = useRoute()
    const {type,user,course, setCourse} = route.params

    return (
        <Tab.Navigator initialRouteName = "Course DashBoard">
            <Tab.Screen name = "Course DashBoard"
                    component={AnnouncementStack}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({focused}) =>(
                            <Icon name='home' type='font-awesome' size={25} color={focused?"tomato":"grey"}/>
                        ),
                    }}
                    initialParams={{
                        isTA : route.params.isTA,
                        type : type,
                        user: user,
                        course: course
                    }}
            />
            <Tab.Screen name = "Quiz DashBoard"
                    component={QuizStack}
                    options={{
                        tabBarLabel: 'Quiz',
                        tabBarIcon: ({focused}) =>(
                            <Icon name='gamepad' type='font-awesome' size={25} color={focused?"tomato":"grey"}/>
                        ),
                    }}
                    initialParams={{
                        type : type,
                        user: user,
                        course: course
                    }}
            />
            <Tab.Screen name = "Feedback DashBoard"
                    component={FeedbackStack}
                    options={{
                        tabBarLabel: 'Feedback',
                        tabBarIcon: ({focused}) =>(
                            <Icon name='comments' type='font-awesome' size={25} color={focused?"tomato":"grey"}/>
                        ),
                    }}
                    initialParams={{
                        type : type,
                        user: user,
                        course: course
                    }}
            />
            <Tab.Screen name = "Student List"
                    component={StudentStack}
                    options={{
                        tabBarLabel: 'Students',
                        tabBarIcon: ({focused}) =>(
                            <Icon name='users' type='font-awesome' size={25} color={focused?"tomato":"grey"}/>
                        ),
                    }}
                    initialParams={{
                        type : type,
                        user: user,
                        course: course
                    }}
            />
            {type==="faculty" &&
                <Tab.Screen name = "Settings"
                    component={SettingsStack}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({focused}) =>(
                            <Icon name='cog' type='font-awesome' size={25} color={focused?"tomato":"grey"}/>
                        ),
                    }}
                    initialParams={{
                        type : type,
                        user: user,
                        course: course,
                        setCourse : setCourse
                    }}
                />
            }
        </Tab.Navigator>
    );
}

export default TabNavigator
