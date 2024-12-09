import database from '@react-native-firebase/database';
import moment from 'moment';
import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { Button, Text } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Feedback from '../database/feedback';
import FeedbackResponses from '../database/feedbackresponses';
import StudentFeedbackCard from './studentFeedbackCard';

interface Props {
  course: {
    passCode: string;
  };
  user: {
    url: string;
    email: string;
  };
  currentFeedback: boolean;
  beforeFeedback: boolean;
  currentDuration: number;
  beforeDuration: number;
  setFeedbackState: () => void;
}

interface State {
  course: Props['course'];
  user: Props['user'];
  responded: boolean | null;
  responses: number | string[] | Record<number, string>;
  error: string | null;
  loading: boolean;
  kind: number | null;
  firstOpen: string;
  date: string;
  opens: number;
}

const FeedbackStudentPage: FC<Props> = (props) => {
  const prevProps = useRef<Props>(props);

  const [state, setState] = useState<State>({
    course: props.course,
    user: props.user,
    responded: false,
    responses: -1,
    error: null,
    loading: true,
    kind: null,
    firstOpen: '',
    date: '',
    opens: 0,
  });

  const studentResponses = (value: number | string[] | Record<number, string>) => {
    console.log('Student response ', value);
    setState(prevState => ({
      ...prevState,
      responses: value,
      error: null,
    }));
  };

  const getTopics = async () => {
    const feedback = new Feedback();
    const feedbackResponse = new FeedbackResponses();

    try {
      const value = await feedback.getFeedbackDetails(state.course.passCode);
      if (value !== null) {
        const respondedValue = await feedbackResponse.getFeedbackResponseForOneStudent(
          state.user.url,
          state.course.passCode,
          value.startTime,
          value.endTime,
        );
        setState(prevState => ({
          ...prevState,
          responded: respondedValue,
          kind: value.kind,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStartTime = async () => {
    const feedback = new Feedback();
    try {
      const value = await feedback.getFeedbackDetails(state.course.passCode);
      if (value === null) {
        console.log('No Feedback Data');
        return;
      }
      console.log('Start Time:', value['startTime']);
      setState(prevState => ({
        ...prevState,
        date: value['startTime'],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const submitFeedback = async () => {
    let { responses } = state;
    let err = false;
    let msg = '';

    if (state.responses === -1 || !responses) {
      err = true;
      msg = 'Please enter a response';
    }
    if (state.kind === 2) {
      if (Array.isArray(responses)) {
        if (!responses[0] || !responses[1]) {
          err = true;
          msg = !responses[0]
            ? 'At least 1 response needed for Question 1'
            : 'At least 1 response needed for Question 2';
        }
      } else {
        err = true;
        msg = 'Expected an array of responses.';
      }
    }
    if (err) {
      setState(prevState => ({
        ...prevState,
        error: msg,
      }));
      return;
    }

    setState(prevState => ({
      ...prevState,
      error: null,
    }));

    Toast.show('Responses have been recorded!', Toast.LONG);
    const feedbackResponse = new FeedbackResponses();
    const timestamp = moment.utc(database().getServerTime()).format('DD/MM/YYYY HH:mm:ss');

    await getStartTime();

    const temp = moment.utc(state.date, 'DD/MM/YYYY HH:mm:ss');
    const temp1 = moment.utc(state.firstOpen, 'DD/MM/YYYY HH:mm:ss');
    const temp3 = moment.utc(timestamp, 'DD/MM/YYYY HH:mm:ss');

    const feedbackResponseTime = ((temp3.diff(temp, 'milliseconds') / 60000) * 60).toFixed(2);
    const firstOpenTime = ((temp1.diff(temp, 'milliseconds') / 60000) * 60).toFixed(2);

    console.log('Response Time:', feedbackResponseTime);
    console.log('First Open Time:', firstOpenTime);

    try {
      const url = await feedbackResponse.getFeedbackResponse(state.user.url, state.course.passCode);
      if (url === null) {
        await feedbackResponse.createFeedbackResponse(
          state.course.passCode,
          state.user.url,
          state.user.email,
          responses,
          timestamp,
          firstOpenTime,
          feedbackResponseTime,
        );
        console.log('Feedback created.');
      } else {
        await feedbackResponse.setFeedbackResponse(
          state.course.passCode,
          state.user.url,
          state.user.email,
          responses,
          timestamp,
          url,
          firstOpenTime,
          feedbackResponseTime,
        );
        console.log('Feedback updated.');
      }
      setState(prevState => ({
        ...prevState,
        responded: true,
        responses: -1,
        kind: null,
        error: null,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTopics();
  }, []);

  useEffect(() => {
    if (props.currentFeedback) {
      getTopics();
    }
  }, [props.currentFeedback]);

  if (!state.loading) {
    if (props.currentFeedback && state.opens === 0) {
      console.log('Printing line-> 202, FeedbackStudentPage.js');
      const timestamp_first = moment
        .utc(database().getServerTime())
        .format('DD/MM/YYYY HH:mm:ss');
      setState(prevState => ({
        ...prevState,
        firstOpen: timestamp_first,
        opens: state.opens + 1,
      }));
      console.log(state.firstOpen);
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        {props.currentFeedback === false ? (
          props.beforeFeedback === false ? (
            <ScrollView>
              <Text style={styles.or}> No current feedback form!</Text>
            </ScrollView>
          ) : (
            <ScrollView>
              <Text style={styles.or}> No current feedback form!</Text>
              <View style={styles.invisible}>
                <CountDown
                  until={props.beforeDuration + 5}
                  onFinish={() => {
                    getTopics().then(r => {});
                    props.setFeedbackState();
                  }}
                />
              </View>
            </ScrollView>
          )
        ) : state.responded === true ? (
          <ScrollView>
            <Text style={styles.or}> No current feedback form!</Text>
          </ScrollView>
        ) : (
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.heading}> Feedback </Text>
              <CountDown
                until={props.currentDuration + 2}
                size={24}
                onFinish={() => {
                  setState(prevState => ({
                    ...prevState,
                    responded: false,
                    responses: -1,
                    error: null,
                    opens: 0,
                  }));

                  props.setFeedbackState();
                }}
                digitStyle={{backgroundColor: 'white'}}
                digitTxtStyle={{color: 'tomato'}}
                timeToShow={['M', 'S']}
                timeLabels={{m: 'Min', s: 'Sec'}}
              />
              <Text style={styles.text}> Please provide your Feedback</Text>
              <View style={[styles.grid]}>
                <StudentFeedbackCard
                  value="Question"
                  key="0"
                  index="0"
                  kind={state.kind}
                  studentResponses={studentResponses}
                />
              </View>
              <View style={styles.buttonContainer}>
                {state.error ? (
                  <Text style={styles.errorMessage}>{state.error}</Text>
                ) : (
                  <Text />
                )}
              </View>
            </View>
            <View style={[styles.buttonContainer]}>
              <Button
                buttonStyle={[styles.mybutton]}
                titleStyle={{color: 'white', fontWeight: 'normal'}}
                style={styles.buttonMessage}
                title="Submit"
                onPress={submitFeedback}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  } else {
    setTimeout(function() {
      setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    }, 1000);
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }
};

export default FeedbackStudentPage;

const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    extraMargin: {
      marginTop: 25,
    },
    heading: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingTop: 25,
      padding: 15,
      fontSize: 25,
      fontWeight: 'bold',
      color: 'black',
      marginTop: 5,
      textAlign: 'center',
    },
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 10,
    },
    or: {
      marginTop: 200,
      color: 'grey',
      alignSelf: 'center',
      fontSize: 22,
      paddingBottom: 20,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingTop: 15,
      paddingLeft: 50,
      paddingRight: 50,
    },
    buttonMessage: {
      marginTop: 15,
      paddingTop: 15,
    },
    invisible: {
      display: 'none',
      opacity: 0,
    },
    text: {
      flex: 1,
      display: 'flex',
      padding: 5,
      fontSize: 20,
      color: '#333',
      marginTop: 10,
    },
    grid: {
      marginTop: 10,
      marginBottom: -80,
      paddingTop: 10,
      paddingBottom: 10,
      alignItems: 'center',
    },
    errorMessage: {
      color: 'red',
      marginTop: 65,
      paddingTop: 5,
    },
    preloader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    mybutton: {
      backgroundColor: 'tomato',
      borderColor: 'black',
      borderRadius: 20,
      marginTop: 30,
      marginBottom: 30,
    },
  });
