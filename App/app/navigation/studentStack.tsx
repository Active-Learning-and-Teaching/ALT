import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { Alert, View, Platform } from 'react-native';
import Toast from 'react-native-simple-toast';
import { firebase } from '@react-native-firebase/functions';
import { useRoute } from '@react-navigation/native';
import StudentList from '../studentlist/studentlist';

const Stack = createStackNavigator();

type Course = {
  passCode: string;
  courseName: string;
  [key: string]: any; // Additional course-related fields can be added here
};

type User = {
  email: string;
  [key: string]: any; // Additional user-related fields can be added here
};

type RouteParams = {
  type: 'faculty' | 'student'; // Specify the possible values for 'type'
  user: User;
  course: Course;
};

const StudentStack: React.FC = () => {
  const route = useRoute();
  const { type, user, course } = route.params as RouteParams;

  const showAlert = () => {
    Alert.alert(
      'Email list of students?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Pressed');
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            console.log('triggering mail for passCode:' + course.passCode);
            Toast.show('Sending Email...', Toast.LONG);
            try {
              await firebase
                .functions()
                .httpsCallable('mailingSystem')({ passCode: course.passCode, type: 'StudentList' });
            } catch (error) {
              console.log('There has been a problem with your mail operation: ' + error);
            }
          },
        },
      ]
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudentList"
        component={StudentList}
        options={{
          headerShown: true,
          headerTitle: course.courseName,
          headerBackTitle: '',
          headerRight: () =>
            type === 'faculty' ? (
              Platform.OS === 'android' ? (
                <View style={{ padding: 10 }}>
                  <Icon name="envelope-o" type="font-awesome" onPress={showAlert} />
                </View>
              ) : (
                <Icon
                  name="envelope-o"
                  type="font-awesome"
                  style={{ borderRadius: 1, paddingRight: 10 }}
                  onPress={showAlert}
                />
              )
            ) : null,
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

export default StudentStack;
