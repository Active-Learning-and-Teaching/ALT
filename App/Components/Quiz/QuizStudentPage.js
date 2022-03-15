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

export default class QuizStudentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: this.props.course,
      user: this.props.user,
      option: '',
      icon: '',
      error: null,
      correctAnswer: '',
      quizResults: false,
      date: '',
      results: '',
      loading: true,
      appState: AppState.currentState,
      opens: 0,
      firstOpen: 0,
      duration: '',
    };
    this.setOption = this.setOption.bind(this);
    this.quizresultData = this.quizresultData.bind(this);
  }

  componentDidMount() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active' &&
          this.props.currentQuiz
        ) {
          console.log('Quiz has come to the foreground for First time!');
          this.setState({opens: this.state.opens + 1});
          console.log(this.state.opens);
        } 
        this.setState({appState: nextAppState});
      },
    );
  }

  componentWillUnmount() {
    this.appStateSubscription = AppState.removeEventListener('change', () => {
      console.log('componentHasUnmounted');
    });
  }

  quizresultData(resultData, quizNumber) {
    this.setState({
      results: resultData,
    });
  }

  setOption(value) {
    this.setState({
      option: value,
      icon: value,
    });
  }

  getCorrectAnswer = async () => {
    const Kbc = new Quiz();
    Kbc.getTiming(this.state.course.passCode).then(value => {
      this.setState({
        correctAnswer: value['correctAnswer'],
        date: value['startTime'],
      });
    });
  };

  getDuration = async () =>{
    const Kbc = new Quiz()
    await Kbc.getTiming(this.state.course.passCode).then(value => {
      console.log("Printing duration finally")
      console.log(value);
      console.log(value['duration']);

        this.setState({
            duration: value['duration'],
        })
    })
}

  getStartTime = async () => {
    const Kbc = new Quiz();
    await Kbc.getTiming(this.state.course.passCode).then(value => {
      console.log('Output line 92 QuizStudentPage.js' + value['startTime']);
      this.setState({
        date: value['startTime'],
      });
    });
  };

  submitResponse = async () => {
    const {option} = this.state;

    if (option === '') {
      this.setState({
        error: 'Please answer',
      });
    } else if (this.props.quizType === 'numeric' && isNaN(parseFloat(option))) {
      this.setState({
        error: 'Please Input a Numerical Response',
      });
    } else {
      this.setState({
        error: null,
      });
    }

    Toast.show('Answer has been recorded!');
    const kbcresponse = new QuizResponses();
    const timestamp = moment
      .utc(database().getServerTime())
      .format('DD/MM/YYYY HH:mm:ss');

    console.log('Printing Output from QuizStudentpage.js in line 117');
    await this.getStartTime();

    console.log(
      'Printing Output from QuizStudentpage.js in line 119 ->' +
        this.state.date,
    );

    await this.getDuration();

    console.log(this.state.date);


    let temp1 = moment.utc(timestamp, 'DD/MM/YYYY HH:mm:ss');
    let temp = moment.utc(this.state.date, 'DD/MM/YYYY HH:mm:ss');
    let temp2 = moment.utc(this.state.firstOpen,'DD/MM/YYYY HH:mm:ss');
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
    console.log(this.state.duration);

    var duration_seconds=parseInt(this.state.duration);
    console.log(duration_seconds);

    var normalised_response_time=quiz_response_time/duration_seconds;
    normalised_response_time = normalised_response_time.toFixed(2);
    console.log('Response Time added');
    console.log(quiz_response_time);
    console.log(first_open_time);

    console.log("Printing Normalised Response Time");
    console.log(normalised_response_time);

    await kbcresponse
      .getResponse(this.state.user.url, this.state.course.passCode)
      .then(url => {
        if (url === null) {
          kbcresponse
            .createResponse(
              this.state.course.passCode,
              this.state.user.url,
              this.state.user.email,
              option,
              timestamp,
              this.state.user.name,
              quiz_response_time,
              normalised_response_time,
              this.state.opens,
              first_open_time,
            )
            .then(r => {
              console.log('create');
            });
        } else {
          kbcresponse
            .setResponse(
              this.state.course.passCode,
              this.state.user.url,
              this.state.user.email,
              option,
              timestamp,
              this.state.user.name,
              quiz_response_time,
              normalised_response_time,
              url,
              this.state.opens,
              first_open_time,
            )
            .then(r => {
              console.log('update');
            });
        }
      });
  };

  render() {
    if (!this.state.loading) {

      console.log('Printing line-> 197, QuizStudentPage.js');
      console.log(this.state.opens, this.props.currentQuiz,this.state.appState);
      if (this.props.currentQuiz && this.state.opens === 0) {
        const timestamp_first = moment
          .utc(database().getServerTime())
          .format('DD/MM/YYYY HH:mm:ss');
        console.log('Printing line-> 203, QuizStudentPage.js');
        this.setState({firstOpen: timestamp_first});
        this.setState({opens: this.state.opens + 1});
        console.log(this.state.firstOpen);
      }   
      return (
        <SafeAreaView style={styles.safeContainer}>
          {this.props.currentQuiz === false ? (
            this.state.quizResults === false ? (
              <ScrollView>
                <Text style={styles.or}> Wohoo! No current quiz!</Text>
              </ScrollView>
            ) : (
              <ScrollView>
                <View>
                  <QuizResultGraph
                    passCode={this.state.course.passCode}
                    correctAnswer={this.state.correctAnswer}
                    date={this.state.date}
                    quizType={this.props.quizType}
                    quizresultData={this.quizresultData}
                  />
                </View>
              </ScrollView>
            )
          ) : (
            <ScrollView>
              <Text style={styles.heading}> In-Class Quiz</Text>

              <CountDown
                until={this.props.currentDuration}
                size={30}
                onFinish={() => {
                  this.setState({
                    quizResults: true,
                    option: '',
                    icon: '',
                    error: null,
                    opens: 0,
                  });
                  this.props.setQuizState();
                  this.getCorrectAnswer().then(r => {
                    console.log('');
                  });
                }}
                digitStyle={{backgroundColor: 'white'}}
                digitTxtStyle={{color: 'tomato'}}
                timeToShow={['M', 'S']}
                timeLabels={{m: 'Min', s: 'Sec'}}
              />
              {this.props.quizType === 'mcq' ? (
                <View style={{paddingRight: 20, paddingLeft: 20}}>
                  <Options
                    optionValue={this.setOption}
                    icon={this.state.icon}
                  />
                  <View style={{padding: 40}}>
                    {this.state.error ? (
                      <Text style={styles.errorMessage}>
                        {this.state.error}
                      </Text>
                    ) : (
                      <Text />
                    )}
                    <View>
                      <Button
                        style={styles.buttonMessage}
                        titleStyle={{color: 'white', fontWeight: 'normal'}}
                        buttonStyle={styles.mybutton}
                        title="Submit"
                        onPress={this.submitResponse}
                      />
                    </View>
                  </View>
                </View>
              ) : this.props.quizType === 'alphaNumerical' ? (
                <View style={{paddingTop: 20}}>
                  <Text style={[styles.heading, {fontSize: 18, marginTop: 15}]}>
                    Please Provide Concise Answer
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
                    value={this.state.option}
                  />
                  {this.state.error ? (
                    <Text style={styles.errorMessage}>{this.state.error}</Text>
                  ) : (
                    <Text />
                  )}
                  <View style={[{paddingTop: 20}]}>
                    <Button
                      style={styles.buttonMessage}
                      titleStyle={{color: 'white', fontWeight: 'normal'}}
                      buttonStyle={styles.mybutton}
                      title="Submit"
                      onPress={this.submitResponse}
                    />
                  </View>
                </View>
              ) : this.props.quizType === 'numeric' ? (
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
                      this.setState({
                        option: text,
                      });
                    }}
                    value={this.state.option}
                  />
                  {this.state.error ? (
                    <Text style={styles.errorMessage}>{this.state.error}</Text>
                  ) : (
                    <Text />
                  )}
                  <View style={[{paddingTop: 20}]}>
                    <Button
                      style={styles.buttonMessage}
                      titleStyle={{color: 'white', fontWeight: 'normal'}}
                      buttonStyle={styles.mybutton}
                      title="Submit"
                      onPress={this.submitResponse}
                    />
                  </View>
                </View>
              ) : this.props.quizType === 'multicorrect' ? (
                <View style={{paddingRight: 20, paddingLeft: 20}}>
                  <MultiCorrectOptions optionValue={this.setOption} />
                  <View style={{padding: 40}}>
                    {this.state.error ? (
                      <Text style={styles.errorMessage}>
                        {this.state.error}
                      </Text>
                    ) : (
                      <Text />
                    )}
                    <View>
                      <Button
                        style={styles.buttonMessage}
                        titleStyle={{color: 'white', fontWeight: 'normal'}}
                        buttonStyle={styles.mybutton}
                        title="Submit"
                        onPress={this.submitResponse}
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
