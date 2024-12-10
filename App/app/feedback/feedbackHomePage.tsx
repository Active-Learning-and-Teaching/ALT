import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FeedbackStudentPage from './studentFeedbackPage';
import FeedbackFacultyPage from './feedbackFaculty';
import database from '@react-native-firebase/database';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import { RouteProp } from '@react-navigation/native';

type FeedbackStackParamList = {
    Feedback: {
      type: 'faculty' | 'student';
      user: any; // Replace `any` with a specific type if available
      course: {
        courseName: string;
        passCode: string;
        defaultEmailOption?: boolean;
      };
    };
  };

interface FeedbackState {
  type: 'faculty' | 'student';
  course: {
    passCode: string;
    defaultEmailOption?: boolean;
  };
  user: any; // Replace `any` with a specific type if available
  beforeFeedback: boolean;
  currentFeedback: boolean;
  currentDuration: number;
  beforeDuration: number;
  feedbackCount: number;
  startTime: string;
  kind: string | null;
}

interface FeedbackHomePageProps {
    route: RouteProp<FeedbackStackParamList, 'Feedback'>;
}

const FeedbackHomePage: React.FC<FeedbackHomePageProps> = (props) => {
  const [state, setState] = useState<FeedbackState>({
    type: props.route.params.type,
    course: props.route.params.course,
    user: props.route.params.user,
    beforeFeedback: false,
    currentFeedback: false,
    currentDuration: 0,
    beforeDuration: 0,
    feedbackCount: 0,
    startTime: '',
    kind: null,
  });

  const setFeedbackState = () => {
    isCurrentFeedback();
  };

  const cancelFeedback = () => {
    setState((prevState) => ({
      ...prevState,
      currentFeedback: false,
      feedbackCount: prevState.feedbackCount - 1,
    }));
  };

  const isCurrentFeedback = () => {
    firestore()
      .collection('Feedback')
      .where('passCode', '==', state.course.passCode)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const values = snapshot.docs[0].data();
          const curr = moment.utc(database().getServerTime());
          const startTime = moment.utc(values.startTime, 'DD/MM/YYYY HH:mm:ss');
          const endTime = moment.utc(values.endTime, 'DD/MM/YYYY HH:mm:ss');
          const beforeDuration = Math.abs(
            moment.utc(curr).diff(startTime, 'seconds')
          );
          const duration = Math.abs(moment.utc(curr).diff(endTime, 'seconds'));

          if (curr >= startTime && curr <= endTime) {
            setState((prevState) => ({
              ...prevState,
              beforeFeedback: false,
              currentFeedback: true,
              currentDuration: duration,
              beforeDuration: 0,
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            }));
          } else if (curr < startTime) {
            setState((prevState) => ({
              ...prevState,
              beforeFeedback: true,
              currentFeedback: false,
              currentDuration: 0,
              beforeDuration: beforeDuration,
              startTime: startTime.format('DD/MM/YYYY HH:mm:ss'),
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              beforeFeedback: false,
              currentFeedback: false,
              currentDuration: 0,
              beforeDuration: 0,
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            }));
          }
        }
      });
  };

  useEffect(() => {
    isCurrentFeedback();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      {state.type === 'faculty' ? (
        <FeedbackFacultyPage
          user={state.user}
          course={state.course}
          beforeFeedback={state.beforeFeedback}
          currentFeedback={state.currentFeedback}
          currentDuration={state.currentDuration}
          beforeDuration={state.beforeDuration}
          setFeedbackState={setFeedbackState}
          startTime={state.startTime}
          feedbackCount={state.feedbackCount}
          kind={state.kind}
          cancelFeedback={cancelFeedback}
        />
      ) : (
        <FeedbackStudentPage
          user={state.user}
          course={state.course}
          beforeFeedback={state.beforeFeedback}
          currentFeedback={state.currentFeedback}
          currentDuration={state.currentDuration}
          beforeDuration={state.beforeDuration}
          setFeedbackState={setFeedbackState}
          kind={state.kind}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default FeedbackHomePage;
