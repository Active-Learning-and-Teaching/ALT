import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRoute, RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import Courses from '../database/courses';
import Faculty from '../database/faculty';
import CourseCard from './courseCard';

interface FacultyDashBoardProps {
  navigation: {
    addListener: (event: string, callback: () => void) => () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

interface FacultyDashboardParams {
setUser: (user: any) => void;
}

// Define the RouteParams type for useRoute
type FacultyDashboardRouteProp = RouteProp<
    { FacultyDashBoard: FacultyDashboardParams },
    'FacultyDashBoard'
>;
  
interface Course {
  quizEmail?: string;
  feedbackEmail?: string;
  defaultEmailOption?: boolean;
  [key: string]: any;
}

const FacultyDashBoard: React.FC<FacultyDashBoardProps> = ({ navigation }) => {
  const route = useRoute<FacultyDashboardRouteProp>();
  const { setUser } = route.params;
  const [currentUser, setCurrentUser] = useState<Faculty | null>(null);
  const [courseList, setCourseList] = useState<Courses[] | any>([]);
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

  const getAllCourses = useCallback((currentUser: Faculty) => {
    firestore()
      .collection('Faculty')
      .doc(currentUser.url)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setCourseList([]);
          const coursesArray = snapshot.data()?.courses;
          if (coursesArray && coursesArray.length) {
            const course = new Courses();
            coursesArray.forEach((url: string) => {
              course.getCourseByUrl(url).then((courseData) => {
                if (courseData) {
                  console.log(courseData);
                  if (!courseData.quizEmail) courseData.quizEmail = currentUser.email;
                  if (!courseData.feedbackEmail)
                    courseData.feedbackEmail = currentUser.email;
                  if (!courseData.defaultEmailOption)
                    courseData.defaultEmailOption = true;
                  setCourseList((prev: any) => [...prev, courseData]);
                }
              });
            });
          }
        }
      });
  }, []);

  useEffect(() => {
    const onLoad = async () => {
      const curr = auth().currentUser;
      if (curr) {
        const faculty = new Faculty();
        await faculty.setName(curr.displayName || '');
        await faculty.setEmail(curr.email || '');
        await faculty.setUrl();
        setCurrentUser(faculty);
        getAllCourses(faculty);
        setUser(faculty);
      }
      console.log(courseList);
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
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.courseListContainer}>
          {courseList.map((item: any, index: any) => 
            currentUser && (
            <CourseCard
              course={item}
              type='faculty'
              user={currentUser}
              key={index}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FacultyDashBoard;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  courseListContainer: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
});
