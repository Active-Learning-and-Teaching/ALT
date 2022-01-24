import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Feedback from '../../Databases/Feedback';
import {Button, Text} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import StudentFeedbackCard from './StudentFeedbackCard';
import Toast from 'react-native-simple-toast';
import FeedbackResponses from '../../Databases/FeedbackResponses';
import moment from 'moment';
import database from '@react-native-firebase/database';

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
    };
    this.getTopics = this.getTopics.bind(this);
    this.studentResponses = this.studentResponses.bind(this);
  }

  studentResponses(value) {
    console.log('Student response ', value);
    let responses = this.state.responses;
    responses = value;

    this.setState({
      responses: responses,
      error: null,
    });
  }

  async getTopics() {
    const feedback = new Feedback();
    await feedback
      .getFeedbackDetails(this.state.course.passCode)
      .then(async value => {
        if (value !== null) {
          let responses = -1;
          let responded = false;

          const feedbackResponse = new FeedbackResponses();
          await feedbackResponse
            .getFeedbackResponseForOneStudent(
              this.state.user.url,
              this.state.course.passCode,
              value.startTime,
              value.endTime,
            )
            .then(r => {
              responded = r;
            });

          await this.setState({
            responses: responses,
            responded: responded,
            kind: value.kind,
          });
        }
      });
  }

  submitFeedback = async () => {
    const {responses} = this.state;
    var err = false;
    console.log('Submit Feedback ', responses);
    if (responses === -1) {
      err = true;
    }

    if (err) {
      await this.setState({
        error: 'Please enter a response',
      });
    } else {
      await this.setState({
        error: null,
      });
    }

    if (!err) {
      Toast.show('Responses have been recorded!');
      const feedbackResponse = new FeedbackResponses();
      const timestamp = moment.utc(database().getServerTime()).format(
        'DD/MM/YYYY HH:mm:ss',
      );
      console.log(timestamp);

      await feedbackResponse
        .getFeedbackResponse(this.state.user.url, this.state.course.passCode)
        .then(url => {
          if (url === null) {
            feedbackResponse
              .createFeedbackResponse(
                this.state.course.passCode,
                this.state.user.url,
                this.state.user.email,
                this.state.responses,
                timestamp,
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
                this.state.responses,
                timestamp,
                url,
              )
              .then(r => {
                console.log('update');
              });
          }
        });
      await this.setState({
        responded: true,
        responses: -1,
        kind: null,
        error: null,
      });
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
                    });
                    this.props.setFeedbackState();
                  }}
                  digitStyle={{backgroundColor: 'white'}}
                  digitTxtStyle={{color: 'tomato'}}
                  timeToShow={['M', 'S']}
                  timeLabels={{m: 'Min', s: 'Sec'}}
                />
                <Text style={styles.text}>Please provide your feedback</Text>

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
    padding: 10,
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
