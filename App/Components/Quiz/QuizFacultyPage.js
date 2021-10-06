import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Animated,
} from 'react-native';
import {Slider, Text, Button, Icon} from 'react-native-elements';
import Quiz from '../../Databases/Quiz';
import moment from 'moment';
import Options from './Options';
import CountDown from 'react-native-countdown-component';
import QuizResultGraph from './QuizResultGraph';
import Toast from 'react-native-simple-toast';
import SwitchSelector from 'react-native-switch-selector';
import Dimensions from '../../Utils/Dimensions';
import database from '@react-native-firebase/database';
import MultiCorrectOptions from './MultiCorrectOptions';
import {firebase} from '@react-native-firebase/functions';

export default class QuizFacultyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: this.props.course,
      user: this.props.user,
      time: 2,
      option: '*',
      icon: '',
      correctAnswer: '*',
      resultPage: false,
      emailStatus: false,
      error: null,
      date: '',
      results: '',
      typeofQuiz: 'mcq',
      loading: true,
      quizNumber: '',
    };
    this.setOption = this.setOption.bind(this);
    this.quizresultData = this.quizresultData.bind(this);
    this.QuizMailer = this.QuizMailer.bind(this);
  }

  quizresultData(resultData, quizNumber) {
    this.setState({
      results: resultData,
      quizNumber: quizNumber,
    });
  }
  checkEmailSent = async () => {
    const Kbc = new Quiz();
    await Kbc.getTiming(this.state.course.passCode).then(async value => {
      if (value != null) {
        await this.setState({
          emailStatus: !value.emailResponse,
          resultPage: true,
          correctAnswer: value.correctAnswer,
          date: value.startTime,
        });
      }
      if (this.state.correctAnswer === '') {
        this.setState({resultPage: false});
      }
    });
    console.log(this.state.correctAnswer);
  };

  componentDidMount() {
    this.checkEmailSent().then(r => {
      if (this.state.correctAnswer === '') {
        this.setState({resultPage: false});
      }
    });
  }

  async setOption(value) {
    if (value === '') {
      value = '*';
    }
    await this.setState({
      option: value,
      icon: value,
    });
    console.log(this.state.option);
  }

  dbUpdateEmailStatus = async () => {
    const Kbc = new Quiz();
    Kbc.getTiming(this.state.course.passCode).then(value => {
      Kbc.getQuestion(this.state.course.passCode).then(values => {
        const url = Object.keys(values)[0];
        Kbc.setQuestion(
          this.state.course.passCode,
          value.startTime,
          value.endTime,
          value.duration,
          value.correctAnswer,
          value.instructor,
          value.quizType,
          url,
          true,
          value.questionCount,
        );
      });
    });
  };

  startKBC = async (action = 'start') => {
    if (action === 'stop') {
      this.setState({
        time: 2,
        option: '*',
        icon: '',
        correctAnswer: '-',
        resultPage: false,
        emailStatus: false,
        error: null,
        date: '',
        results: '',
        typeofQuiz: 'mcq',
      });

      this.props.setQuizState();
      const kbc = new Quiz();
      await kbc.getQuestion(this.state.course.passCode).then(values => {
        const url = Object.keys(values)[0];
        const questionCount = Object.values(values)[0].questionCount;
        kbc
          .setQuestion(
            this.state.course.passCode,
            '',
            '',
            '',
            '',
            this.state.user.email,
            '',
            url,
            false,
            questionCount - 1,
          )
          .then(r => {
            console.log('update');
          });
      });
    } else {
      const {option, time} = this.state;

      if (option === '') {
        this.setState({
          error: 'Please select correct answer.',
        });
      } else {
        const kbc = new Quiz();
        const curr = database().getServerTime();
        const startTime = moment(curr).format('DD/MM/YYYY HH:mm:ss');
        const endTime = moment(curr)
          .add(time, 'minutes')
          .format('DD/MM/YYYY HH:mm:ss');

        await kbc.getQuestion(this.state.course.passCode).then(values => {
          if (values === null) {
            kbc
              .createQuestion(
                this.state.course.passCode,
                startTime,
                endTime,
                time,
                option,
                this.state.user.email,
                this.state.typeofQuiz,
              )
              .then(r => {
                console.log('create');
              });
          } else {
            const url = Object.keys(values)[0];
            const questionCount = Object.values(values)[0].questionCount;
            kbc
              .setQuestion(
                this.state.course.passCode,
                startTime,
                endTime,
                time,
                option,
                this.state.user.email,
                this.state.typeofQuiz,
                url,
                false,
                questionCount + 1,
              )
              .then(r => {
                console.log('update');
              });
          }
          this.setState({
            time: 2,
            option: '*',
            icon: '',
            error: null,
          });
        });
      }
    }
  };

  dbUpdateCorrectAnswer = async () => {
    const option = this.state.option;
    if (option === '' || option === '*') {
      this.setState({
        error: 'Please type Correct Answer',
      });
    } else {
      this.setState({
        error: null,
      });
      const Kbc = new Quiz();
      Kbc.getTiming(this.state.course.passCode).then(value => {
        Kbc.getQuestion(this.state.course.passCode).then(values => {
          const url = Object.keys(values)[0];
          Kbc.setQuestion(
            this.state.course.passCode,
            value.startTime,
            value.endTime,
            value.duration,
            this.state.option,
            value.instructor,
            value.quizType,
            url,
            value.emailResponse,
            value.questionCount,
          );
          Toast.show('Correct Answer has been recorded!');
        });
      });
    }
  };

  async QuizMailer() {
    console.log('triggering mail for passCode:' + this.state.course.passCode);
    Toast.show('Sending Email...');
    const {data} = firebase
      .functions()
      .httpsCallable('mailingSystem')({
        passCode: this.state.course.passCode,
        type: 'Quiz',
      })
      .catch(function(error) {
        console.log(
          'There has been a problem with your mail operation: ' + error,
        );
      });
    await this.dbUpdateEmailStatus().then(() => {
      this.setState({emailStatus: false});
    });
    console.log('Email Status Updated');
  }

  render() {
    if (!this.state.loading) {
      return (
        <SafeAreaView style={styles.safeContainer}>
          {this.props.currentQuiz === false ? (
            this.state.resultPage === false ? (
              <ScrollView>
                <View style={{padding: 20}}>
                  <Text style={styles.heading}>
                    Quiz {this.props.questionCount + 1}{' '}
                  </Text>
                  <View style={styles.selector}>
                    <SwitchSelector
                      initial={0}
                      onPress={value => {
                        this.setState({
                          typeofQuiz: value,
                          option: '*',
                          icon: '',
                          correctAnswer: '*',
                        });
                      }}
                      textStyle={{fontSize: 12}}
                      textColor={'black'}
                      selectedColor={'black'}
                      borderColor={'#383030'}
                      // hasPadding
                      options={[
                        {
                          label: 'Single-Correct',
                          value: 'mcq',
                          activeColor: 'tomato',
                        },
                        {
                          label: 'Multi-Correct',
                          value: 'multicorrect',
                          activeColor: 'tomato',
                        },
                        {
                          label: 'Alpha-Numeric',
                          value: 'numerical',
                          activeColor: 'tomato',
                        },
                      ]}
                    />
                  </View>
                  {this.state.typeofQuiz === 'mcq' ? (
                    <View>
                      <Options
                        optionValue={this.setOption}
                        icon={this.state.icon}
                      />
                    </View>
                  ) : this.state.typeofQuiz === 'numerical' ? (
                    <Text />
                  ) : this.state.typeofQuiz === 'multicorrect' ? (
                    <View>
                      <MultiCorrectOptions optionValue={this.setOption} />
                    </View>
                  ) : (
                    <Text />
                  )}

                  <View style={styles.container}>
                    <View style={styles.slider}>
                      <Text style={styles.sliderText}>
                        {' '}
                        Timer: {this.state.time} min
                      </Text>

                      <Slider
                        value={this.state.time}
                        minimumValue={1}
                        step={1}
                        maximumValue={15}
                        // thumbTouchSize={{width: 100, height: 100}}
                        // thumbTintColor='#2697BF'
                        minimumTrackTintColor="tomato"
                        // maximumTrackTintColor="#000000"
                        trackStyle={{
                          height: 10,
                          backgroundColor: 'transparent',
                        }}
                        thumbStyle={{
                          height: 35,
                          width: 35,
                          backgroundColor: 'transparent',
                        }}
                        thumbProps={{
                          Component: Animated.Image,
                          source: {
                            uri: 'https://i.ibb.co/Qn6nGyx/Clock.png',
                          },
                        }}
                        onValueChange={value => this.setState({time: value})}
                      />

                      <View style>
                        <View style={{paddingTop: 10, marginTop: 10}}>
                          <Button
                            buttonStyle={styles.mybutton}
                            titleStyle={{color: 'white', fontWeight: 'normal'}}
                            title="Begin"
                            onPress={this.startKBC}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <ScrollView>
                <View style={[{paddingRight: 10, paddingLeft: 10}]}>
                  <QuizResultGraph
                    passCode={this.state.course.passCode}
                    course={this.props.course}
                    correctAnswer={this.state.correctAnswer}
                    date={this.state.date}
                    quizType={this.props.quizType}
                    emailStatus={this.state.emailStatus}
                    quizresultData={this.quizresultData}
                    QuizMailer={this.QuizMailer}
                  />
                  <View
                    style={[
                      styles.buttonContainer,
                      {
                        width:
                          this.props.quizType === 'numerical'
                            ? Dimensions.window.width - 50
                            : '100%',
                      },
                    ]}>
                    <Button
                      buttonStyle={styles.mybutton}
                      titleStyle={{color: 'white', fontWeight: 'normal'}}
                      style={styles.buttonMessage}
                      title={'Start Another Quiz'}
                      onPress={() => {
                        this.setState({
                          time: 2,
                          option: '*',
                          icon: '',
                          correctAnswer: '*',
                          resultPage: false,
                          emailStatus: false,
                          error: null,
                          date: '',
                          results: '',
                          typeofQuiz: 'mcq',
                          quizNumber: '',
                        });
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
            )
          ) : (
            <ScrollView>
              <Text style={styles.subheading}>
                {' '}
                Quiz {this.props.questionCount} in Progress
              </Text>
              <CountDown
                until={this.props.currentDuration}
                size={30}
                onFinish={() => {
                  this.setState({
                    resultPage: true,
                  });
                  this.checkEmailSent().then(r => {
                    console.log('');
                  });
                  this.props.setQuizState();
                }}
                digitStyle={{backgroundColor: '#FFF'}}
                digitTxtStyle={{color: 'tomato'}}
                timeToShow={['M', 'S']}
                timeLabels={{m: 'Min', s: 'Sec'}}
              />
              <View>
                <Button
                  buttonStyle={styles.mybutton}
                  titleStyle={{color: 'white', fontWeight: 'normal'}}
                  title="Cancel"
                  onPress={() => {
                    this.startKBC('stop').then(r => '');
                  }}
                />
              </View>
              {this.props.quizType === 'numerical' ? (
                <View>
                  <Text style={[styles.heading, {fontSize: 20}]}>
                    Provide Answer for Auto-grading
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    maxLength={30}
                    textAlign={'center'}
                    onChangeText={text => {
                      this.setState({
                        option: text,
                      });
                    }}
                    value={this.state.option === '*' ? '' : this.state.option}
                  />
                  {this.state.error ? (
                    <Text style={styles.errorMessage}>{this.state.error}</Text>
                  ) : (
                    <Text />
                  )}

                  <Button
                    style={styles.buttonMessage}
                    buttonStyle={styles.mybutton}
                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                    title="Submit"
                    onPress={() => {
                      this.dbUpdateCorrectAnswer().then(r =>
                        console.log('Answer Updated'),
                      );
                    }}
                  />
                </View>
              ) : (
                <Text />
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      );
    } else {
      let that = this;
      setTimeout(function() {
        that.setState({loading: false});
      }, 1000);
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  mybutton: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sliderText: {
    flex: 1,
    display: 'flex',
    padding: 10,
    fontSize: 18,
    color: 'black',
    marginTop: 5,
  },
  selector: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 25,
    padding: 5,
    marginTop: 5,
    textAlign: 'center',
  },
  textInput: {
    color: 'black',
    width: '100%',
    paddingTop: 25,
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
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
  },
  buttonMessage: {
    marginTop: 20,
    paddingTop: 20,
    marginBottom: 30,
    paddingBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  or: {
    marginTop: 130,
    color: 'grey',
    alignSelf: 'center',
    fontSize: 22,
    paddingBottom: 20,
    fontWeight: 'bold',
  },
  slider: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: Dimensions.window.width - 60,
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
});
