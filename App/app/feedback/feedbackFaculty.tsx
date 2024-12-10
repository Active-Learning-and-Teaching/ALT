import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/functions';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { Button } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Feedback from '../database/feedback';
import Dimensions from '../utils/Dimentions';
import FeedbackForm from './feedbackForm';
import FeedbackResultsList from './feedbackResultslist';

interface FeedbackFacultyPageProps {
  course: {
    passCode: string,
    defaultEmailOption?: boolean
  }; // Define the exact shape of `course` as per your data model
  user: any; // Replace `any` with the actual type of `user`
  feedbackCount: number;
  beforeFeedback: boolean;
  currentFeedback: boolean;
  beforeDuration: number;
  currentDuration: number;
  startTime?: string;
  setFeedbackState: () => void;
  cancelFeedback: () => void;
  kind: string | null;
}

interface FeedbackFacultyPageState {
  course: FeedbackFacultyPageProps['course'];
  user: FeedbackFacultyPageProps['user'];
  resultPage: boolean;
  emailStatus: boolean;
  duration: number;
  date: string;
  results: string;
  loading: boolean;
  feedbackNumber: string;
  kind: string | null;
  HTTPFailure: boolean;
  processedMinutePaperResponses: boolean;
}

const FeedbackFacultyPage: React.FC<FeedbackFacultyPageProps> = (props) => {
  const duration = 6;

  const [state, setState] = useState<FeedbackFacultyPageState>({
    course: props.course,
    user: props.user,
    resultPage: false,
    emailStatus: false,
    duration: duration,
    date: '',
    results: '',
    loading: true,
    feedbackNumber: '',
    kind: null,
    HTTPFailure: false,
    processedMinutePaperResponses: false,
  });

  const feedbackresultData = (resultData: string, feedbackNumber: string) => {
    setState((prevState) => ({
      ...prevState,
      results: resultData,
      feedbackNumber: feedbackNumber,
    }));
  };

  const setKind = (kind: string) => {
    setState((prevState) => ({
      ...prevState,
      kind: kind,
    }));
  };

  const checkEmailSent = async () => {
    const feedback = new Feedback();
    try {
      const value = await feedback.getFeedbackDetails(state.course.passCode);
      if (value != null) {
        setState((prevState) => ({
          ...prevState,
          emailStatus: !value.emailResponse,
          resultPage: true,
          kind: value.kind,
          date: value.startTime,
          loading: false, // Stop loading
        }));
      } else {
        console.log("Feedback not found");
        setState((prevState) => ({
          ...prevState,
          emailStatus: false,
          resultPage: false,
          kind: null,
          date: '',
          loading: false, // Stop loading
        }));
      }
    } catch (error) {
      console.error("Error checking email sent:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false, // Stop loading even on error
      }));
    }
  };

  const dbUpdateEmailStatus = async () => {
    const feedback = new Feedback();
    feedback.getFeedbackDetails(state.course.passCode).then((value: any) => {
      feedback.getFeedback(state.course.passCode).then((values: any) => {
        const url = values.id;
        feedback.setFeedback(
          state.course.passCode,
          value.startTime,
          value.endTime,
          value.kind,
          value.instructor,
          url,
          true,
          value.feedbackCount,
          value.summary
        );
      });
    });
  };

  const startFeedback = async (action: 'start' | 'stop' | 'delay') => {
    const feedback = new Feedback();
    let curr = await database().getServerTime();
    let startTime = moment.utc(curr).format('DD/MM/YYYY HH:mm:ss');
    let endTime = moment.utc(curr).add(state.duration, 'minutes').format('DD/MM/YYYY HH:mm:ss');

    if (action === 'stop') {
      setState({
        ...state,
        resultPage: false,
        emailStatus: false,
        duration: duration,
        date: '',
        results: '',
        loading: false,
        feedbackNumber: '',
        kind: null,
        HTTPFailure: false,
        processedMinutePaperResponses: false,
      });
      props.cancelFeedback();
      await feedback.getFeedbackDetails(state.course.passCode).then((value: any) => {
        feedback.getFeedback(state.course.passCode).then((values: any) => {
          const url = values.id;
          feedback.setFeedback(
            state.course.passCode,
            '',
            '',
            '',
            '',
            url,
            false,
            value.feedbackCount - 1
          );
        });
      });
    } else if (action === 'delay') {
      startTime = moment.utc(props.startTime, 'DD/MM/YYYY HH:mm:ss')
        .add(10, 'minutes')
        .format('DD/MM/YYYY HH:mm:ss');
      endTime = moment.utc(props.startTime, 'DD/MM/YYYY HH:mm:ss')
        .add(10 + state.duration, 'minutes')
        .format('DD/MM/YYYY HH:mm:ss');
      await feedback.getFeedbackDetails(state.course.passCode).then((value: any) => {
        feedback.getFeedback(state.course.passCode).then((values: any) => {
          const url = values.id;
          feedback.setFeedback(
            state.course.passCode,
            value.startTime,
            endTime,
            value.kind,
            value.instructor,
            url,
            false,
            value.feedbackCount
          );
        });
      });
    }
  };

  const setResultPage = () =>{
      setState(prevState => ({
          ...prevState,
          resultPage:false
      }))
  }
  
  const sendHTTPTrigger = async () => {
    const feedback = new Feedback();
    await feedback.getFeedbackDetails(state.course.passCode).then(async values => {
        if (values === null) {
            console.error("Error");
            return;
        }
        const url = `https://minute-paper-summarizer-775rx6qcca-uc.a.run.app/minutePaperSummarizer?passCode=${state.course.passCode}&startTime=${values.startTime}&endTime=${values.endTime}`;
        console.log(url);
        await fetch(url).then(response => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    setState (prevState => ({
                        ...prevState,
                        loading : true,
                        HTTPFailure : true,
        
                    }))
             
                return;
            }
            else {
                if (state.HTTPFailure) {
                    setState (prevState => ({
                        ...prevState,
                        
                        HTTPFailure : false,
        
                    }))
                
                }
            }  
            response.json().then(data => {
                console.log(data);
                console.log(response.status);
                console.log('trigger sent');
            }).then(() => {
                console.log('Heyyyyyy');
                setState (prevState => ({
                    ...prevState,
                    processedMinutePaperResponses : true,
                    loading : true,
                    resultPage: true,
    
                }))
             
    
                checkEmailSent().then(r => {
                    console.log('');
                });
                props.setFeedbackState();
            });
        })
    })
    
}


  const FeedbackMailer = async () => {
    console.log('triggering mail for passCode:' + state.course.passCode);
    Toast.show('Sending Email...', Toast.LONG);
    await firebase
      .functions()
      .httpsCallable('mailingSystem')({
        passCode: state.course.passCode,
        type: 'Feedback',
      })
      .catch((error: any) => {
        console.error('There has been a problem with your mail operation: ', error);
      });
    await dbUpdateEmailStatus().then(() => {
      setState((prevState) => ({
        ...prevState,
        emailStatus: false,
      }));
    });
  };

  const load = async () => {
    await checkEmailSent();
  };

  useEffect(() => {
    load();
  }, []);

  if (state.loading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  if (!state.loading) {
    return (
        <SafeAreaView style={styles.safeContainer}>
            {props.currentFeedback === false ? (
                props.beforeFeedback === false ? (
                    state.resultPage === false ? (
                        <FeedbackForm
                            feedbackCount={props.feedbackCount}
                            course={state.course}
                            user={state.user}
                            setKind={setKind}
                        />
                    ) : (
                        state.HTTPFailure === false ? (
                        <ScrollView>
                            <View style={styles.result}>
                                <FeedbackResultsList
                                    course={state.course}
                                    date={state.date}
                                    emailStatus={state.emailStatus}
                                    feedbackresultData={feedbackresultData}
                                    FeedbackMailer={FeedbackMailer}
                                    cancelFB = {setResultPage}
                                    summarizeResponses = {sendHTTPTrigger}
                                />
                            </View>
                            <View style={[styles.buttonRowContainer]}>
                                <Button
                                    style={styles.feedbackButtonMessage}
                                    buttonStyle={styles.mybutton}
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    title={'Start New Feedback'}
                                    onPress={() => {
                                        setState(prevState => ({
                                            ...prevState,
                                            resultPage: false,
                                            emailStatus: false,
                                            duration: duration,
                                            date: '',
                                            results: '',

                                        }))
                                     
                                    }}
                                />
                                {/* <Button
                                    style={styles.feedbackButtonMessage}
                                    buttonStyle={styles.mybutton}
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    title={'Send Trigger'}
                                    onPress={() => {
                                        sendHTTPTrigger()
                                    }}/> */}
                            </View>
                        </ScrollView>) : (
                            <ScrollView>
                            <View style={[styles.buttonRowContainer]}>
                                <Button
                                    style={styles.feedbackButtonMessage}
                                    buttonStyle={styles.mybutton}
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    title={'Retry Fetching Results'}
                                    onPress={() => {
                                        sendHTTPTrigger()
                                    }}/>
                                <Button
                                    style={styles.feedbackButtonMessage}
                                    buttonStyle={styles.mybutton}
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    title={'Start New Feedback'}
                                    onPress={() => {
                                        setState(prevState => ({
                                            ...prevState,
                                            resultPage: false,
                                            emailStatus: false,
                                            duration: duration,
                                            date: '',
                                            results: '',

                                        }))
                                     
                                    }}
                                />
                                
                            </View>
                        </ScrollView>
                        )
                    )
                ) : (
                    <ScrollView>
                        <View style={styles.container}>
                            <Text style={styles.heading}>
                                Feedback {props.feedbackCount}
                            </Text>
                            
                            <View style={styles.container}>
                                <Text style={styles.text1}>Scheduled to go live in</Text>
                                <CountDown
                                    until={props.beforeDuration + 5}
                                    size={24}
                                    onFinish={() => {
                                        checkEmailSent().then(r => {
                                            FeedbackMailer();
                                        });
                                        props.setFeedbackState();
                                    }}
                                    digitStyle={{backgroundColor: 'white'}}
                                    digitTxtStyle={{fontFamily: 'arial', color: 'tomato'}}
                                    timeToShow={['D', 'H', 'M', 'S']}
                                    timeLabels={{d: 'Day', h: 'Hour', m: 'Min', s: 'Sec'}}
                                />
                            </View>
                            <View style={[styles.buttonContainer]}>
                                <Button
                                    buttonStyle={styles.mybutton}
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    title=" Start Now"
                                    onPress={() => {
                                        startFeedback('start').then(r => '');
                                    }}
                                />
                            </View>
                            <View style={[styles.buttonContainer]}>
                                <Button
                                    buttonStyle={styles.mybutton}
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    title="Extend by 10 mins"
                                    onPress={() => {
                                        startFeedback('delay').then(r => '');
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                )
            ) : (
                <ScrollView>
                    <Text style={styles.subheading}>
                        Feedback {props.feedbackCount} in Progress
                    </Text>
                    <CountDown
                        until={props.currentDuration + 5}
                        size={30}
                        onFinish={() => {
                            setState(prevState => ({
                                ...prevState,
                                resultPage: true,

                            }))
                                
                                checkEmailSent().then(r => {
                                    FeedbackMailer();
                                });
                                props.setFeedbackState();
                        }}
                        digitStyle={{backgroundColor: '#FFF'}}
                        digitTxtStyle={{color: 'tomato'}}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: 'Min', s: 'Sec'}}
                    />
                    <View style={[styles.buttonContainer]}>
                        <Button
                            buttonStyle={styles.mybutton}
                            titleStyle={{color: 'white', fontWeight: 'normal'}}
                            style={styles.buttonMessage}
                            title="Cancel"
                            onPress={() => {
                                startFeedback('stop').then(r => '');
                            }}
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
            loading:false,
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
	or: {
		marginTop: 200,
		color: 'grey',
		alignSelf: 'center',
		fontSize: 22,
		paddingBottom: 20,
		fontWeight: 'bold',
	},
	listContainer: {
		width: Dimensions.window.width - 10,
		height: Dimensions.window.height / 11,
		marginTop: 2,
		marginBottom: 2,
		paddingTop: 2,
		paddingBottom: 2,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5.0,
		elevation: 4,
		borderRadius: 8,
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.5,
		shadowRadius: 1.5,
		elevation: 10,
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
	result: {
		padding: 10,
		paddingLeft: 30,
		paddingRight: 20,
	},
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
	topic: {
		flex: 1,
		display: 'flex',
		padding: 10,
		fontSize: 18,
		color: 'grey',
		marginTop: 5,
	},
	title: {
		alignSelf: 'flex-start',
		textAlign: 'left',
		fontSize: 16,
		color: 'black',
		marginTop: 1,
		paddingTop: 1,
		marginBottom: 2,
		paddingBottom: 2,
	},
	text: {
		flex: 1,
		display: 'flex',
		paddingBottom: 10,
		fontSize: 16,
		color: 'grey',
		marginTop: 25,
		alignSelf: 'center',
	},
	text1: {
		flex: 1,
		display: 'flex',
		padding: 8,
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		marginTop: 30,
		marginBottom: 10,
		alignSelf: 'center',
	},
	buttonMessage: {
		marginTop: 15,
		paddingTop: 15,
	},
	displayRow: {
		flex: 1,
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
	buttonContainer: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingTop: 5,
		paddingLeft: 30,
		paddingRight: 30,
	},
	feedbackButtonMessage: {
		marginTop: 30,
		paddingTop: 20,
		marginBottom: 30,
		paddingBottom: 20,
	},
	buttonRowContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 40,
		paddingRight: 40,
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
	subheading: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingTop: 25,
		padding: 15,
		fontSize: 25,
		fontWeight: 'bold',
		color: 'black',
		marginTop: 50,
		marginBottom: 25,
		textAlign: 'center',
	},
});

export default FeedbackFacultyPage;
