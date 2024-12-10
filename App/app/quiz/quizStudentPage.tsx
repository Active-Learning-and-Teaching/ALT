import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Text, Button } from 'react-native-elements';
import moment from 'moment';
import Options from './options';
import QuizResponses from '../database/quizresponse';
import CountDown from 'react-native-countdown-component';
import QuizResultGraph from './quizResultGraph';
import Quiz from '../database/quiz';
import Toast from 'react-native-simple-toast';
import database from '@react-native-firebase/database';
import MultiCorrectOptions from './multicorrect';

// Define prop types
interface QuizStudentPageProps {
  course: { passCode: string };
  user: { url: string; email: string; name: string };
  currentQuiz: boolean;
  quizType: 'mcq' | 'alphaNumerical' | 'numeric' | 'multicorrect';
  currentDuration: number;
  setQuizState: () => void;
}

// Define state types
interface QuizStudentPageState {
  course: { passCode: string };
  option: string;
  icon: string;
  error: string | null;
  correctAnswer: string;
  quizResults: boolean;
  date: string;
  results: string;
  loading: boolean;
  appState: AppStateStatus;
  submitted: boolean;
  submittedOption: string;
  opens: number;
  firstOpen: string | number;
  duration: string | number;
}

const QuizStudentPage: React.FC<QuizStudentPageProps> = (props) => {
  const [state, setState] = useState<QuizStudentPageState>({
    course: props.course,
    option: '',
    icon: '',
    error: null,
    correctAnswer: '',
    quizResults: false,
    date: '',
    results: '',
    loading: true,
    appState: AppState.currentState,
    submitted: false,
    submittedOption: '',
    opens: 0,
    firstOpen: 0,
    duration: '',
  });

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (
          state.appState.match(/inactive|background/) &&
          nextAppState === 'active' &&
          props.currentQuiz
        ) {
          console.log('Quiz has come to the foreground for the first time!');
          setState((prevState) => ({
            ...prevState,
            opens: prevState.opens + 1,
          }));
        }
        setState((prevState) => ({
          ...prevState,
          appState: nextAppState,
        }));
      }
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [state.appState, props.currentQuiz]);

  const quizresultData = useCallback((values: any, quizNumber: string) => {
    setState((prevState) => ({
      ...prevState,
      results: values,
    }));
  }, []);

  const setOption = useCallback((value: string) => {
    setState((prevState) => ({
      ...prevState,
      option: value,
      icon: value,
    }));
  }, []);

  const getCorrectAnswer = async () => {
    const kbc = new Quiz();
    const value = await kbc.getTiming(props.course.passCode);
    if (!value) {
        return;
    }
    setState((prevState) => ({
      ...prevState,
      correctAnswer: value['correctAnswer'],
      date: value['startTime'],
    }));
  };

  const getDuration = async () => {
    const kbc = new Quiz();
    const value = await kbc.getTiming(props.course.passCode);
    if (!value) {
        return;
    }
    setState((prevState) => ({
      ...prevState,
      duration: value['duration'],
    }));
  };

  const getStartTime = async () => {
    const kbc = new Quiz();
    const value = await kbc.getTiming(props.course.passCode);
    if (!value) {
        return;
    }
    setState((prevState) => ({
      ...prevState,
      date: value['startTime'],
    }));
  };

  const submitResponse = async () => {
    const { option } = state;
    setState((prevState) => ({
      ...prevState,
      submitted: false,
      loading: true,
    }));

    if (!option) {
      setState((prevState) => ({
        ...prevState,
        error: 'Please answer',
      }));
      return;
    }

    if (props.quizType === 'numeric' && isNaN(parseFloat(option))) {
      setState((prevState) => ({
        ...prevState,
        error: 'Please input a numerical response',
      }));
      return;
    }

    Toast.show('Answer has been recorded!', Toast.LONG);
    const kbcResponse = new QuizResponses();
    const timestamp = moment
      .utc(database().getServerTime())
      .format('DD/MM/YYYY HH:mm:ss');

    await getStartTime();
    await getDuration();

    const temp1 = moment.utc(timestamp, 'DD/MM/YYYY HH:mm:ss');
    const temp = moment.utc(state.date, 'DD/MM/YYYY HH:mm:ss');
    const temp2 = moment.utc(state.firstOpen, 'DD/MM/YYYY HH:mm:ss');

    const quizResponseTime = ((temp1.diff(temp, 'seconds') / 60) * 60).toFixed(2);
    const firstOpenTime = ((temp2.diff(temp, 'seconds') / 60) * 60).toFixed(2);
    const normalisedResponseTime = (Number(quizResponseTime) / Number(state.duration)).toFixed(2);

    const url = await kbcResponse.getResponse(props.user.url, props.course.passCode);
    if (!url) {
      await kbcResponse.createResponse(
        props.course.passCode,
        props.user.url,
        props.user.email,
        option,
        timestamp,
        props.user.name,
        quizResponseTime,
        normalisedResponseTime,
        state.opens,
        firstOpenTime
      );
    } else {
      await kbcResponse.setResponse(
        props.course.passCode,
        props.user.url,
        props.user.email,
        option,
        timestamp,
        props.user.name,
        quizResponseTime,
        normalisedResponseTime,
        url,
        state.opens,
        firstOpenTime
      );
    }

    setState((prevState) => ({
      ...prevState,
      submitted: true,
      loading: false,
      submittedOption: option,
    }));
  };

  if (state.loading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  if (!state.loading) {

    console.log('Printing line-> 197, QuizStudentPage.js');
    console.log(state.opens, props.currentQuiz,state.appState);
    if (props.currentQuiz && state.opens === 0) {
        const timestamp_first = moment
            .utc(database().getServerTime())
            .format('DD/MM/YYYY HH:mm:ss');
        console.log('Printing line-> 203, QuizStudentPage.js');

        setState(prevState => ({
                ...prevState,
                firstOpen: timestamp_first,
                opens: state.opens + 1


        }))
     
        console.log(state.firstOpen);
    }   
    return (
        <SafeAreaView style={styles.safeContainer}>
                {props.currentQuiz === false ? (
                    state.quizResults === false ? (
                        <ScrollView>
                            <Text style={styles.or}> Wohoo! No current quiz!</Text>
                        </ScrollView>
                    ) : (
                        <ScrollView>
                            <View>
                                <QuizResultGraph
                                    passCode={state.course.passCode}
                                    correctAnswer={state.correctAnswer}
                                    date={state.date}
                                    quizType={props.quizType}
                                    quizresultData={quizresultData}
                                />
                            </View>
                        </ScrollView>
                    )
                ) : (
                    <ScrollView>
                        <Text style={styles.heading}> In-Class Quiz</Text>

                        <CountDown
                            until={props.currentDuration}
                            size={30}
                            onFinish={() => {
                                    setState(prevState => ({
                                            ...prevState,
                                            quizResults: true,
                                            option: '',
                                            icon: '',
                                            error: null,
                                            opens: 0,

                                            }))
                                
                                props.setQuizState();
                                getCorrectAnswer().then(r => {
                                    console.log('');
                                });
                            }}
                            digitStyle={{backgroundColor: 'white'}}
                            digitTxtStyle={{color: 'tomato'}}
                            timeToShow={['M', 'S']}
                            timeLabels={{m: 'Min', s: 'Sec'}}
                        />
                        {props.quizType === 'mcq' ? (
                            <View style={{paddingRight: 20, paddingLeft: 20}}>
                                <Options
                                    optionValue={setOption}
                                    icon={state.icon}
                                />
                                <View style={{padding: 40}}>
                                    {state.error ? (
                                        <Text style={styles.errorMessage}>
                                            {state.error}
                                        </Text>) :
                                        (<Text />)
                                    }

                                    <View>
                                        {state.submitted && (
                                            (!state.loading?
                                                <Text 
                                                    style={styles.answer}>
                                                    You submitted {state.submittedOption}
                                                </Text>:
                                                <View style={styles.preloader}>
                                                <ActivityIndicator size="large" color="#9E9E9E" />
                                            </View>
                                            )) 
                                        }
                                        <Button
                                            style={styles.buttonMessage}
                                            titleStyle={{color: 'white', fontWeight: 'normal'}}
                                            buttonStyle={styles.mybutton}
                                            title="Submit"
                                            onPress={submitResponse}
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : props.quizType === 'alphaNumerical' ? (
                            <View style={{paddingTop: 20}}>
                                <Text style={[styles.heading, {fontSize: 18, marginTop: 15}]}>
                                    Please Provide Concise Answer
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    maxLength={30}
                                    textAlign={'center'}
                                    onChangeText={text => {
                                        setState (prevState => ({
                                                ...prevState,
                                                option: text,

                                        }))
                                    }}
                                    value={state.option}
                                />
                                {state.error ? (
                                    <Text style={styles.errorMessage}>{state.error}</Text>
                                ) : (
                                    <Text />
                                )}
                                <View style={[{paddingTop: 20}]}>
                                    {
                                        state.submitted&&((
                                            !state.loading?
                                            <Text 
                                                style={styles.answer}>
                                                You submitted {state.submittedOption}
                                            </Text>:
                                            <View style={styles.preloader}>
                                                <ActivityIndicator size="large" color="#9E9E9E" />
                                            </View>
                                        ))
                                    }
                                    <Button
                                        style={styles.buttonMessage}
                                        titleStyle={{color: 'white', fontWeight: 'normal'}}
                                        buttonStyle={styles.mybutton}
                                        title="Submit"
                                        onPress={submitResponse}
                                    />
                                </View>
                            </View>
                        ) : props.quizType === 'numeric' ? (
                            <View style={{paddingTop: 20}}>
                                <Text style={[styles.heading, {fontSize: 18, marginTop: 15}]}>
                                    Please Provide Concise Answer
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    maxLength={30}
                                    textAlign={'center'}
                                    onChangeText={text => {
                                        setState (prevState => ({
                                                ...prevState,
                                                option: text,
                                
                                        }))
                                    }}
                                    value={state.option}
                                />
                                {state.error ? (
                                    <Text style={styles.errorMessage}>{state.error}</Text>
                                ) : (
                                    <Text />
                                )}
                                <View style={[{paddingTop: 20}]}>
                                    {
                                        state.submitted&&((
                                            !state.loading?
                                            <Text 
                                                style={styles.answer}>
                                                You submitted {state.submittedOption}
                                            </Text>:
                                            <View style={styles.preloader}>
                                                <ActivityIndicator size="large" color="#9E9E9E" />
                                            </View>
                                        ))
                                    }
                                    <Button
                                        style={styles.buttonMessage}
                                        titleStyle={{color: 'white', fontWeight: 'normal'}}
                                        buttonStyle={styles.mybutton}
                                        title="Submit"
                                        onPress={submitResponse}
                                    />
                                </View>
                            </View>
                        ) : props.quizType === 'multicorrect' ? (
                            <View style={{paddingRight: 20, paddingLeft: 20}}>

                                <MultiCorrectOptions optionValue={setOption} />

                                <View style={{padding: 40}}>
                                    {state.error ? (
                                        <Text style={styles.errorMessage}>
                                            {state.error}
                                        </Text>
                                    ) : (
                                        <Text />
                                    )}

                                    <View>
                                        {
                                            state.submitted&&((
                                                !state.loading?
                                                <Text 
                                                    style={styles.answer}>
                                                    You submitted {state.submittedOption}
                                                </Text>:
                                                <View style={styles.preloader}>
                                                    <ActivityIndicator size="large" color="#9E9E9E" />
                                                </View>
                                            ))
                                        }
                                        <Button
                                            style={styles.buttonMessage}
                                            titleStyle={{color: 'white', fontWeight: 'normal'}}
                                            buttonStyle={styles.mybutton}
                                            title="Submit"
                                            onPress={submitResponse}
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <Text />
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        );
    } else {
    
        setTimeout(function() {
            setState (prevState => ({
                    ...prevState,
                    loading: false

            }))
            
        }, 1000);
        return (
            <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E" />
            </View>
        );
    }
};

const styles = StyleSheet.create({
	safeContainer: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	textInput: {
		color: 'black',
		width: '100%',
		paddingTop: 55,
		paddingBottom: 15,
		alignSelf: 'center',
		borderColor: '#ccc',
		borderBottomWidth: 1,
		fontSize: 20,
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
	answer:{
		color:'green',
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		fontSize: 25,
		fontWeight: 'bold',
		marginTop: 2,
		textAlign: 'center',
	},
	heading: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingTop: 35,
		paddingBottom: 20,
		padding: 15,
		fontSize: 25,
		fontWeight: 'bold',
		color: '#333',
		marginTop: 5,
		textAlign: 'center',
	},
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 35,
	},

	errorMessage: {
		color: 'red',
		marginBottom: 15,
		paddingTop: 20,
		paddingBottom: 10,
	},
	buttonMessage: {
		paddingTop: 20,
		marginTop: 40,
	},
	or: {
		marginTop: 200,
		color: 'grey',
		alignSelf: 'center',
		fontSize: 22,
		paddingBottom: 20,
		fontWeight: 'bold',
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

export default QuizStudentPage;
