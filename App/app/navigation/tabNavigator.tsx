import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { RouteProp, useRoute } from '@react-navigation/native';
import AnnouncementStack from './announcementStack';
import FeedbackStack from './feedbackStack';
import QuizStack from './quizStack';
import StudentStack from './studentStack';
import SettingsStack from './facultyStack';

// Define the route params type
interface TabNavigatorParams {
  isTA?: boolean;
  type: string;
  user: string;
  course: string;
  setCourse?: (course: string) => void;
}

// Define the type for the route
type TabNavigatorRoute = RouteProp<{ params: TabNavigatorParams }, 'params'>;

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const route = useRoute<TabNavigatorRoute>();
  const { type, user, course, setCourse } = route.params;

  return (
    <Tab.Navigator initialRouteName="Course DashBoard">
      <Tab.Screen
        name="Course DashBoard"
        component={AnnouncementStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="home" type="font-awesome" size={25} color={focused ? 'tomato' : 'grey'} />
          ),
        }}
        initialParams={{
          isTA: route.params.isTA,
          type: type,
          user: user,
          course: course,
        }}
      />
      <Tab.Screen
        name="Quiz DashBoard"
        component={QuizStack}
        options={{
          tabBarLabel: 'Quiz',
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="gamepad" type="font-awesome" size={25} color={focused ? 'tomato' : 'grey'} />
          ),
        }}
        initialParams={{
          type: type,
          user: user,
          course: course,
        }}
      />
      <Tab.Screen
        name="Feedback DashBoard"
        component={FeedbackStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Feedback',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="comments" type="font-awesome" size={25} color={focused ? 'tomato' : 'grey'} />
          ),
        }}
        initialParams={{
          type: type,
          user: user,
          course: course,
        }}
      />
      <Tab.Screen
        name="Student List"
        component={StudentStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Students',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="users" type="font-awesome" size={25} color={focused ? 'tomato' : 'grey'} />
          ),
        }}
        initialParams={{
          type: type,
          user: user,
          course: course,
        }}
      />
      {type === 'faculty' && (
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon name="cog" type="font-awesome" size={25} color={focused ? 'tomato' : 'grey'} />
            ),
          }}
          initialParams={{
            type: type,
            user: user,
            course: course,
            setCourse: setCourse,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default TabNavigator;