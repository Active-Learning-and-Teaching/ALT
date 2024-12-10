import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Courses from '../database/courses';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Switch,
} from 'react-native';

// Assuming the type for course is as follows:
type Course = {
  defaultEmailOption: boolean;
  quizEmail: string;
  feedbackEmail: string;
  passCode: string;
  courseName: string;
  courseCode: string;
  room: string;
  instructors: string[];
  imageURL: string;
  instructor: string;
};

// Define the expected params for the route
type RouteParams = {
  params: {
    course: Course;
    setCourse: (course: Course) => Promise<void>;
  };
};

function FacultySettings() {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { course, setCourse } = route.params;
  const [error, setError] = useState<string | null>(null);
  const [defaultEmailOption, setDefaultEmailOption] = useState<boolean>(course.defaultEmailOption);
  const [quizEmail, setQuizEmail] = useState<string>(course.quizEmail);
  const [feedbackEmail, setFeedbackEmail] = useState<string>(course.feedbackEmail);

  const setData = async (data: string): Promise<void> => {
    if (quizEmail === '' || feedbackEmail === '') {
      setError('Enter details.');
    } else {
      setError(null);
      const coursesObj = new Courses();
      await coursesObj.getCourse(course.passCode).then(url => {
        coursesObj.setCourseData(
          course.courseName,
          course.courseCode,
          course.room,
          course.passCode,
          course.instructors,
          course.imageURL,
          course.instructor,
          quizEmail,
          feedbackEmail,
          defaultEmailOption,
          url,
        );

        course.quizEmail = quizEmail;
        course.feedbackEmail = feedbackEmail;
        course.defaultEmailOption = defaultEmailOption;
        setCourse(course).then(r => {
          data === 'email'
            ? Toast.show('Updated Email Settings', Toast.LONG)
            : Toast.show(`Updated ${course.courseName} Settings`, Toast.LONG);
        });
      });
    }
  };

  const toggleSwitch = async (): Promise<void> => {
    setDefaultEmailOption(prev => !prev);
    await setData('email');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.toggleButtonView}>
            <Text style={styles.toggleText}>Email Responses</Text>
            <Switch
              trackColor={{ false: '#767577', true: 'tomato' }}
              thumbColor={defaultEmailOption ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={defaultEmailOption}
            />
          </View>

          {defaultEmailOption && (
            <>
              <Text style={styles.text}>Email for Quiz Results</Text>
              <TextInput
                caretHidden
                style={styles.textInput}
                autoCapitalize="none"
                textAlign={'left'}
                onChangeText={text => setQuizEmail(text)}
                value={quizEmail}
              />
              <Text style={styles.text}>Email for Feedback Results</Text>
              <TextInput
                caretHidden
                style={styles.textInput}
                autoCapitalize="none"
                textAlign={'left'}
                onChangeText={text => setFeedbackEmail(text)}
                value={feedbackEmail}
              />
            </>
          )}

          {error ? (
            <Text style={styles.errorMessage}>{error}</Text>
          ) : (
            <Text />
          )}

          <Button
            style={styles.buttonMessage}
            buttonStyle={styles.mybutton}
            titleStyle={{ color: 'white', fontWeight: 'normal' }}
            title="Update Settings"
            onPress={() => setData('completeData')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default FacultySettings;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 35,
  },
  toggleButtonView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingTop: 30,
  },
  toggleText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  textInput: {
    color: 'black',
    width: '100%',
    paddingTop: 15,
    paddingBottom: 5,
    alignSelf: 'flex-start',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 20,
  },
  text: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 55,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
    textAlign: 'left',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonMessage: {
    marginTop: 30,
    paddingTop: 20,
    marginBottom: 30,
    paddingBottom: 20,
  },
  mybutton: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 30,
  },
});
