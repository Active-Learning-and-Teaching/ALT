import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Courses from '../database/courses';

interface FormAddCourseProps {
  instructor: any; // Adjust type as per your application
  toggle: () => void;
}

const FormAddCourse: React.FC<FormAddCourseProps> = ({ instructor, toggle }) => {
  const [courseName, setCourseName] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const CreateCourse = async () => {
    const newCourseName = courseName.replace(/\s+/g, ' ').trim();
    const newCourseCode = courseCode.replace(/\s+/g, ' ').trim();

    if (newCourseName === '' || newCourseCode === '') {
      setError('Please Enter details.');
    } else {
      const formattedCourseName = newCourseName.charAt(0).toUpperCase() + newCourseName.slice(1);
      const formattedCourseCode = newCourseCode.toUpperCase();
      const courses = new Courses();

      courses.setcourseName(formattedCourseName);
      courses.setcourseCode(formattedCourseCode);
      courses.setRoom(room);
      courses.setPassCode();
      await courses.setImage();
      courses.addInstructors(instructor);

      await courses.createCourse();

      const pass = courses.getPassCode();
      await courses.getCourse(pass).then(async (value) => {
        await instructor.addCourseFaculty(value).then(() => console.log('Added Course to Faculty'));
      });

      setCourseName('');
      setCourseCode('');
      setRoom('');
      setError(null);
      toggle();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textCreate}>New Course</Text>
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="Course Name"
        placeholderTextColor="grey"
        onChangeText={(text) => setCourseName(text)}
        value={courseName}
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="Course Code"
        placeholderTextColor="grey"
        onChangeText={(text) => setCourseCode(text)}
        value={courseCode}
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="Room"
        placeholderTextColor="grey"
        onChangeText={(text) => setRoom(text)}
        value={room}
      />

      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

      <Button
        buttonStyle={styles.create}
        title="Create"
        titleStyle={{ color: 'white', fontWeight: 'normal' }}
        onPress={CreateCourse}
      />
    </View>
  );
};

export default FormAddCourse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 35,
    backgroundColor: '#fff',
  },
  textInput: {
    color: 'black',
    width: '100%',
    marginBottom: 8,
    paddingBottom: 8,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  textCreate: {
    width: '100%',
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    alignSelf: 'center',
    color: '#333',
    fontSize: 18,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 10,
  },
  create: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
  },
});
