import React, {useState,useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import FeedbackStudentPage from './FeedbackStudentPage';
import FeedbackFacultyPage from './FeedbackFacultyPage';
import database from '@react-native-firebase/database';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

const FeedbackHomePage = (props) => {
  

  const [state, setState] = useState({
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
      
  })

  const setFeedbackState = () => {
    isCurrentFeedback();
  }

 
  cancelFeedback = () => {
    let feedbackCount = state.feedbackCount;
    setState (prevState => ({
        ...prevState,
        currentFeedback: false,
        feedbackCount: feedbackCount -1,
    }))
  }

  isCurrentFeedback = () => {
    firestore()
      .collection('Feedback')
      .where('passCode', '==', state.course.passCode)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const values = snapshot.docs[0].data();
          const curr = moment.utc(database().getServerTime());
          const startTime = moment.utc(values.startTime, 'DD/MM/YYYY HH:mm:ss');
          const endTime = moment.utc(values.endTime, 'DD/MM/YYYY HH:mm:ss');
          const beforeDuration = Math.abs(
            moment.utc(curr).diff(startTime, 'seconds'),
          );
          const duration = Math.abs(moment.utc(curr).diff(endTime, 'seconds'));

          if (curr >= startTime && curr <= endTime) {
            setState({...state,
              beforeFeedback: false,
              currentFeedback: true,
              currentDuration: duration,
              beforeDuration: 0,
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            });
          } else if (curr < startTime) {
            setState({...state,
              beforeFeedback: true,
              currentFeedback: false,
              currentDuration: 0,
              beforeDuration: beforeDuration,
              startTime: startTime,
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            });
          } else {
            setState({...state,
              beforeFeedback: false,
              currentFeedback: false,
              currentDuration: 0,
              beforeDuration: 0,
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            });
          }
        }
      });
  };


  useEffect (() => {
    isCurrentFeedback();
  },[])
  

  
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
  
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});


export default  FeedbackHomePage;