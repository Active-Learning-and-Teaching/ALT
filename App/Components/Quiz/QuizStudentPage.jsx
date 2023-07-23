import React, {Component} from 'react';
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	View,
	TextInput,
	ActivityIndicator,
	AppState,
} from 'react-native';
import {Text, Button} from 'react-native-elements';
import moment from 'moment';
import Options from './Options';
import QuizResponses from '../../Databases/QuizResponses';
import CountDown from 'react-native-countdown-component';
import QuizResultGraph from './QuizResultGraph';
import Quiz from '../../Databases/Quiz';
import Toast from 'react-native-simple-toast';
import database from '@react-native-firebase/database';
import MultiCorrectOptions from './MultiCorrectOptions';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';


const QuizStudentPage = (props) =>  {
	
	const [state,setState] = useState({
		course: props.course,
			user: props.user,
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
	})

	useEffect(() => {
		appStateSubscription = AppState.addEventListener(
				'change',
				nextAppState => {
					if (
						state.appState.match(/inactive|background/) &&
						nextAppState === 'active' &&
						props.currentQuiz
					) {
						console.log('Quiz has come to the foreground for First time!');
						setState(prevState => ({
							...prevState,
							opens: state.opens + 1,
						}));
						console.log(state.opens);
					} 
					setState(prevState => ({
						...prevState,
						opens: state.opens + 1,
					}));;
				},
			);

			return () => {
				appStateSubscription = AppState.removeEventListener('change', () => {
						console.log('componentHasUnmounted');
					});
			}
	},[])
	



	const quizresultData = useCallback((resultData, quizNumber ) => {
		setState(prevState => ({
				...prevState,
				results:resultData
		}))
	},[])
	

	setOption = useCallback((value) => {
		setState(prevState => ({
				...prevState,
				option: value,
				icon: value,
		}))
	},[])
	

	const getCorrectAnswer = async () => {
		const Kbc = new Quiz();
		console.log("checking", state, "dfdfd", state.course);
		Kbc.getTiming(state.course.passCode).then(value => {
				setState (prevState => ({
						...prevState,
						correctAnswer: value['correctAnswer'],
				date: value['startTime'],

				}))

		});
	};

	const getDuration = async () =>{
		const Kbc = new Quiz()
		await Kbc.getTiming(state.course.passCode).then(value => {
			console.log("Printing duration finally")
			console.log(value);
			console.log(value['duration']);
				setState(prevState => ({
						...prevState,
						duration: value['duration'],
				}))
		
		})
}

	const getStartTime = async () => {
		const Kbc = new Quiz();
		await Kbc.getTiming(state.course.passCode).then(value => {
			console.log('Output line 92 QuizStudentPage.js' + value['startTime']);
			setState(prevState => ({
				...prevState,
				date: value['startTime'],

			}))
		
		});
	};

	const submitResponse = async () => {
		const {option} = state;
		setState(prevState => ({
			...prevState,
			submitted: false,
			loading:true,
		}))

		if (option === '') {
				setState(prevState => ({
						...prevState,
						error: 'Please answer'
				}))
				return;
			
		} else if (props.quizType === 'numeric' && isNaN(parseFloat(option))) {
				setState(prevState => ({
						...prevState,
						error: 'Please Input a Numerical Response',
				}))
				return;

		} else {

				setState (prevState => ({
						...prevState,
						error: null,
				}))
				
		}

		Toast.show('Answer has been recorded!');
		const kbcresponse = new QuizResponses();
		const timestamp = moment
			.utc(database().getServerTime())
			.format('DD/MM/YYYY HH:mm:ss');

		console.log('Printing Output from QuizStudentpage.js in line 117');
		await getStartTime();

		console.log(
			'Printing Output from QuizStudentpage.js in line 119 ->' +
				state.date,
		);

		await getDuration();

		console.log(state.date);


		let temp1 = moment.utc(timestamp, 'DD/MM/YYYY HH:mm:ss');
		let temp = moment.utc(state.date, 'DD/MM/YYYY HH:mm:ss');
		let temp2 = moment.utc(state.firstOpen,'DD/MM/YYYY HH:mm:ss');
		let date3 = new Date(temp2)
		let date1 = new Date(temp);
		let  date2 = new Date(temp1);
		
		// console.log('The dates are as follows ->');
		// console.log(date1,date2);

		const difference = date2.getTime() - date1.getTime();
		const differenceOpen = date3.getTime() - date1.getTime();
		// console.log("The difference is"+ difference);
		let quiz_response_time = (difference / 60000) * 60;
		let first_open_time = (differenceOpen / 60000) * 60;
		quiz_response_time = quiz_response_time.toFixed(2);
		first_open_time = first_open_time.toFixed(2);
		console.log('Response Time added');
		console.log(quiz_response_time);
		console.log(first_open_time);

		console.log("Printing duration of Quiz")
		console.log(state.duration);

		var duration_seconds=parseInt(state.duration);
		console.log(duration_seconds);

		var normalised_response_time=quiz_response_time/duration_seconds;
		normalised_response_time = normalised_response_time.toFixed(2);
		console.log('Response Time added');
		console.log(quiz_response_time);
		console.log(first_open_time);

		console.log("Printing Normalised Response Time");
		console.log(normalised_response_time);

		await kbcresponse
			.getResponse(state.user.url, state.course.passCode)
			.then(url => {
				if (url === null) {
					kbcresponse
						.createResponse(
							state.course.passCode,
							state.user.url,
							state.user.email,
							option,
							timestamp,
							state.user.name,
							quiz_response_time,
							normalised_response_time,
							state.opens,
							first_open_time,
						)
						.then(r => {
							console.log('create');
							setState(prevState => ({
								...prevState,
								submitted: true,
								loading:false,
								submittedOption:state.option
							}))
						});
				} else {
					kbcresponse
						.setResponse(
							state.course.passCode,
							state.user.url,
							state.user.email,
							option,
							timestamp,
							state.user.name,
							quiz_response_time,
							normalised_response_time,
							url,
							state.opens,
							first_open_time,
						)
						.then(r => {
							console.log('update');
							setState(prevState => ({
								...prevState,
								submitted: true,
								loading:false,
								submittedOption:state.option
							}))
						});
				}
			});
	};

	
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
										type="number"
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
	}


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