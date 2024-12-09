import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import Courses from '../database/courses';
import Student from '../database/student';
import CourseCard from './courseAdd';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  StudentDashBoard: { setUser: (user: Student) => void };
};

type StudentDashBoardNavigationProp = StackNavigationProp<RootStackParamList, 'StudentDashBoard'>;
type StudentDashBoardRouteProp = RouteProp<RootStackParamList, 'StudentDashBoard'>;

interface StudentDashBoardProps {
  navigation: StudentDashBoardNavigationProp;
}

function StudentDashBoard({ navigation }: StudentDashBoardProps) {
  const route = useRoute<StudentDashBoardRouteProp>();
  console.log(route.params);
  const { setUser } = route.params;
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [courseList, setCourseList] = useState<Courses[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
    return unsubscribe;
  }, [navigation]);

  const getAllCourses = useCallback((currentUser: Student) => {
    firestore()
      .collection('Student')
      .doc(currentUser.url)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          setCourseList([]);
          if (snapshot.data()?.courses && snapshot.data()?.courses.length) {
            const arr = snapshot.data()?.courses;
            const course = new Courses();
            for (const courseUrl of arr) {
              course.getCourseByUrl(courseUrl).then(r => {
                setCourseList(prev => [...prev, r] as Courses[]);
              });
            }
          }
        }
      });
  }, []);

  useEffect(() => {
    const onLoad = async () => {
      const curr = await auth().currentUser;
      if (curr) {
        console.log(curr);
        const student = new Student();
        await student.setName(curr.displayName || '');
        await student.setEmail(curr.email || '');
        await student.setUrl();
        setUser(student);
        setCurrentUser(student);
        getAllCourses(student);
      }
    };

    onLoad();
  }, [getAllCourses, setUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Courses</Text>
          {courseList.map((item, i) => (
            <CourseCard
              course={item}
              type={'student'}
              user={currentUser}
              navigation={navigation.navigate}
              key={i}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Define the styles using StyleSheet.create for better type safety
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default StudentDashBoard;
