import React, { useState, useCallback } from 'react';
import { Text, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Courses from '../database/courses';
import StudentCard from './studentcard';

type Student = {
  name: string;
  email: string;
  photo: string;
  verified: number;
};

type Faculty = {
  name: string;
  email: string;
  photo: string;
  verified: number;
};

type RouteParams = {
  type: string;
  course: {
    passCode: string;
    instructors: string[];
    [key: string]: any;
  };
};

const StudentList: React.FC = () => {
  const route = useRoute();
  const { type, course } = route.params as RouteParams;
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [courseURL, setCourseURL] = useState<string>('');

  const getStudents = (courseURL: string) => {
    firestore()
      .collection('Student')
      .where('courses', 'array-contains', courseURL)
      .onSnapshot((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const list: Student[] = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const dict: Student = {
            name: data['name'],
            email: data['email'],
            photo: data['photo'],
            verified: 1,
          };
          list.push(dict);
        });

        list.sort((a, b) =>
          a.name && b.name
            ? a.name.toUpperCase() > b.name.toUpperCase()
              ? 1
              : b.name.toUpperCase() > a.name.toUpperCase()
              ? -1
              : 0
            : a.email > b.email
            ? 1
            : b.email > a.email
            ? -1
            : 0
        );

        setStudentList(list);
      });
  };

  const getFaculty = (courseURL: string) => {
    firestore()
      .collection('Faculty')
      .where('courses', 'array-contains', courseURL)
      .onSnapshot((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const list: Faculty[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const dict: Faculty = {
            name: data['name'],
            email: data['email'],
            photo: data['photo'],
            verified: 1,
          };
          list.push(dict);
        });

        list.sort((a, b) =>
          a.name && b.name
            ? a.name.toUpperCase() > b.name.toUpperCase()
              ? 1
              : b.name.toUpperCase() > a.name.toUpperCase()
              ? -1
              : 0
            : a.email > b.email
            ? 1
            : b.email > a.email
            ? -1
            : 0
        );

        setFacultyList(list);
      });
  };

  useFocusEffect(
    useCallback(() => {
      const onLoad = async () => {
        const courseObj = new Courses();
        const url = await courseObj.getCourse(course.passCode);
        setCourseURL(url);
        getStudents(url);
        getFaculty(url);
      };
      onLoad();
    }, [course.passCode])
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <View style={styles.grid}>
          <Text style={styles.text}>Faculty</Text>
          {facultyList.map((faculty, i) => (
            <StudentCard
              student={faculty}
              key={i}
              type={type}
              course={course}
              courseURL={courseURL}
            />
          ))}

          <Text style={styles.text}>
            {studentList.length === 0
              ? 'No Students'
              : `${studentList.length} ${studentList.length === 1 ? 'Student' : 'Students'}`}
          </Text>

          {studentList.map((student, i) => (
            <StudentCard
              student={student}
              key={i}
              type={type}
              course={course}
              courseURL={courseURL}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentList;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  text: {
    color: '#333',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    paddingTop: 25,
    paddingBottom: 25,
    fontWeight: 'bold',
  },
  grid: {
    marginTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
});
