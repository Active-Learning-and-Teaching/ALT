import database from '@react-native-firebase/database';
import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { Button, Text } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Feedback from '../../Databases/Feedback';
import FeedbackResponses from '../../Databases/FeedbackResponses';
import StudentFeedbackCard from './StudentFeedbackCard';

export default class FeedbackStudentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: this.props.course,
      user: this.props.user,
      responded: false,
      responses: -1,
      error: null,
      loading: true,
      kind: null,
      firstOpen: 0,
      date: '',
      opens: 0,
    };
    this.getTopics = this.getTopics.bind(this);
    this.studentResponses = this.studentResponses.bind(this);
  }

  studentResponses(value) {
    // if(this.state.kind==2){
    //   for(let i =0 ; i<value.length; i++){
    //     value[i] = value[i].map(s => s.trim()); 
    //     value[i] = value[i].map(s => s.replaceAll(',', ' ')); 
    //   }
    // }
    console.log('Student response ', value);

    this.setState({
      responses: value,
      error: null,
    });
  }

  async getTopics() {
    const feedback = new Feedback();
    await feedback
      .getFeedbackDetails(this.state.course.passCode)
      .then(async value => {
        if (value !== null) {
          let respondedValue = false;

          const feedbackResponse = new FeedbackResponses();
          await feedbackResponse
            .getFeedbackResponseForOneStudent(
              this.state.user.url,
              this.state.course.passCode,
              value.startTime,
              value.endTime,
            )
            .then(r => {
              respondedValue = r;
            });

          this.setState({
            responded: respondedValue,
            kind: value.kind,
          });
        }
      });
  }

  getStartTime = async () => {
    const feedback = new Feedback();
    await feedback
      .getFeedbackDetails(this.state.course.passCode)
      .then(value => {
        console.log('Output line 82 FeedbackStudent.js' + value['startTime']);
        this.setState({
          date: value['startTime'],
        });
      });
  };

  submitFeedback = async () => {
    var {responses} = this.state;
    var err = false;

    let msg = "";
    console.log("Submit Feedback ",responses);
    if (this.state.responses === -1 || !responses) {

      err = true;
      msg = 'Please enter a response';
    }
    if (this.state.kind == 2) {

      responses = [...this.state.responses];
      if(Array.isArray(this.state.responses)){
        if (!responses[0] || !responses[1] ) {
          err = true;
          if (!responses[0]) {
            msg = "Atleast 1 response needed for Question 1";
          }
          else{
            msg = "Atleast 1 response needed for Question 2";
          }
        }
      }
      else{
        err = true;
        msg = "Expected an array of responses. Got " + String(responses);
      }
    }
    if (err) {
      this.setState({
        error: msg,
      });
    } else {
      this.setState({
        error: null,
      });
    }

    if (!err) {
      Toast.show('Responses have been recorded!');
      const feedbackResponse = new FeedbackResponses();
      const timestamp = moment
        .utc(database().getServerTime())
        .format('DD/MM/YYYY HH:mm:ss');
      console.log(timestamp);

      await this.getStartTime();

      let temp = moment.utc(this.state.date, 'DD/MM/YYYY HH:mm:ss');
      let temp1 = moment.utc(this.state.firstOpen, 'DD/MM/YYYY HH:mm:ss');
      let temp3 = moment.utc(timestamp, 'DD/MM/YYYY HH:mm:ss');

      console.log('Printing line-> 130, FeedbackStudentPage.js');
      console.log(temp1, temp);

      let date1 = new Date(temp);
      let date2 = new Date(temp1);
      let date3 = new Date(temp3)


      const difference = date3.getTime() - date1.getTime();
      const differenceOpen = date2.getTime() - date1.getTime();

      let feedback_response_time = (difference / 60000) * 60;
      feedback_response_time = feedback_response_time.toFixed(2);
      console.log('Response Time added');
      console.log(feedback_response_time);

      let first_open_time = (differenceOpen / 60000) * 60;
      first_open_time = first_open_time.toFixed(2);
      console.log('Printing line-> 136, FeedbackStudentPage.js');
      console.log(first_open_time);


      console.log(this.state.responses);
      const studentResponses = this.state.responses;

      await feedbackResponse
        .getFeedbackResponse(this.state.user.url, this.state.course.passCode)
        .then(url => {
          if (url === null) {
            feedbackResponse
              .createFeedbackResponse(
                this.state.course.passCode,
                this.state.user.url,
                this.state.user.email,
                studentResponses,
                timestamp,
                first_open_time,
                feedback_response_time,
              )
              .then(r => {
                console.log('create');
              });
          } else {
            feedbackResponse
              .setFeedbackResponse(
                this.state.course.passCode,
                this.state.user.url,
                this.state.user.email,
                studentResponses,
                timestamp,
                url,
                first_open_time,
                feedback_response_time,
              )
              .then(r => {
                console.log('update');
              });
          }
        })
        .then(
          this.setState({
            responded: true,
            responses: -1,
            kind: null,
            error: null,
          })
        );
    }
  };

  componentDidMount() {
    this.getTopics().then(r => {
      // console.log(this.state.topics);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentFeedback != this.props.currentFeedback) {
      this.getTopics().then(r => {
        console.log('Feedback Started');
      });
    }
  }

  render() {
    if (!this.state.loading) {

      if (this.props.currentFeedback && this.state.opens === 0) {
        console.log('Printing line-> 202, FeedbackStudentPage.js');
        const timestamp_first = moment
          .utc(database().getServerTime())
          .format('DD/MM/YYYY HH:mm:ss');

        this.setState({firstOpen: timestamp_first});
        this.setState({opens: this.state.opens + 1});
        console.log(this.state.firstOpen);
      }

      return (
        <SafeAreaView style={styles.safeContainer}>
          {this.props.currentFeedback === false ? (
            this.props.beforeFeedback === false ? (
              <ScrollView>
                <Text style={styles.or}> No current feedback form!</Text>
              </ScrollView>
            ) : (
              <ScrollView>
                <Text style={styles.or}> No current feedback form!</Text>
                <View style={styles.invisible}>
                  <CountDown
                    until={this.props.beforeDuration + 5}
                    onFinish={() => {
                      this.getTopics().then(r => {});
                      this.props.setFeedbackState();
                    }}
                  />
                </View>
              </ScrollView>
            )
          ) : this.state.responded === true ? (
            <ScrollView>
              <Text style={styles.or}> No current feedback form!</Text>
            </ScrollView>
          ) : (
            <ScrollView>
              <View style={styles.container}>
                <Text style={styles.heading}> Feedback </Text>
                <CountDown
                  until={this.props.currentDuration + 2}
                  size={24}
                  onFinish={() => {
                    this.setState({
                      responded: false,
                      responses: -1,
                      error: null,
                      opens:0,
                    });
                    this.props.setFeedbackState();
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
                    kind={this.state.kind}
                    studentResponses={this.studentResponses}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  {this.state.error ? (
                    <Text style={styles.errorMessage}>{this.state.error}</Text>
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
                  onPress={this.submitFeedback}
                />
              </View>
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
