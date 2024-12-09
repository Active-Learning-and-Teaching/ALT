import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Courses from '../database/courses';
import Student from '../database/student';

interface User {
  id: string;
  name: string;
  email: string;
}

interface StudentAddCourseFormProps {
  toggle: () => void;
  student: User | null;
}

const StudentAddCourseForm: React.FC<StudentAddCourseFormProps> = ({ toggle, student }) => {
  const [passCode, setPassCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const studentDatabase = new Student();
  

  const joinCourse = async () => {
    const newPassCode = passCode.replace(/\s+/g, ' ').trim();
    console.log(newPassCode);

    if (newPassCode === '') {
      setError('Please Enter Course Pass Code.');
    } else {
      const courses = new Courses();
      await courses.getCourse(newPassCode).then(async (value: any) => {
        console.log(courses.getCourse(newPassCode));
        console.log(value);

        if (value) {
          await studentDatabase
            .addCourseStudent(value)
            .then(() => console.log('Added Course to Student'));
          toggle();
        } else {
          setError('Incorrect Code');
      }});
      setPassCode('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textCreate}>New Course</Text>

      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="Pass Code"
        placeholderTextColor="grey"
        onChangeText={(passCodeText) => setPassCode(passCodeText)}
        value={passCode}
      />

      {error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : (
        <Text />
      )}

      <Button
        style={styles.buttonMessage}
        titleStyle={{
          color: 'white',
          fontWeight: 'normal',
        }}
        buttonStyle={styles.mybutton}
        title="Join"
        onPress={joinCourse}
      />
    </View>
  );
};

export default StudentAddCourseForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 35,
    backgroundColor: '#fff',
  },
  textInput: {
    color: 'black',
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  textCreate: {
    width: '100%',
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    color: '#333',
    fontSize: 18,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonMessage: {
    marginTop: 15,
  },
  mybutton: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 30,
  },
});
