import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/functions';
import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator, SafeAreaView,
  ScrollView,
  StyleSheet, Text, View
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { Button } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Feedback from '../../Databases/Feedback';
import Dimensions from '../../Utils/Dimensions';
import FeedbackForm from './FeedbackForm';
import FeedbackResultsList from './FeedbackResultsList';
export default class FeedbackFacultyPage extends Component {
  // TODO change duration at deployment
  duration = 5;

  constructor(props) {
    super(props);
    this.state = {
      course: this.props.course,
      user: this.props.user,
      resultPage: false,
      emailStatus: false,
      duration: this.duration,
      date: '',
      results: '',
      loading: true,
      feedbackNumber: '',
      kind: null,
      HTTPFailure: false,
      processedMinutePaperResponses : false,
    };
    // this.setTopics = this.setTopics.bind(this);
    this.setKind = this.setKind.bind(this);
    this.feedbackresultData = this.feedbackresultData.bind(this);
    this.FeedbackMailer = this.FeedbackMailer.bind(this);
    this.sendHTTPTrigger = this.sendHTTPTrigger.bind(this);
  }

  feedbackresultData(resultData, feedbackNumber) {
    // console.log("Result data");
    // console.log(resultData);
    this.setState({
      results: resultData,
      feedbackNumber: feedbackNumber,
    });
  }

  setKind(kind) {
    this.setState({
      kind: kind,
    });
  }

  checkEmailSent = async () => {
    const feedback = new Feedback();
    feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
      if (value != null) {
        this.setState({
          emailStatus: !value.emailResponse,
          resultPage: true,
          kind: value.kind,
          date: value.startTime,
        });
      }
    });
  };

  dbUpdateEmailStatus = async () => {
    const feedback = new Feedback();
    feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
      feedback.getFeedback(this.state.course.passCode).then(values => {
        const url = Object.keys(values)[0];
        feedback.setFeedback(
          this.state.course.passCode,
          value.startTime,
          value.endTime,
          value.kind,
          value.instructor,
          url,
          true,
          value.feedbackCount,
          value.summary,
        );
      });
    });
  };

  startFeedback = async action => {
    const feedback = new Feedback();
    let curr = database().getServerTime();
    let startTime = moment.utc(curr).format('DD/MM/YYYY HH:mm:ss');
    let endTime = moment.utc(curr)
      .add(this.state.duration, 'minutes')
      .format('DD/MM/YYYY HH:mm:ss');

    if (action === 'stop') {
      startTime = '';
      endTime = '';
      this.setState({
        resultPage: false,
        emailStatus: false,
        duration: this.duration,
        date: '',
        results: '',
        currentFeedback : false,
      });

      this.props.cancelFeedback()

      await feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
        feedback.getFeedback(this.state.course.passCode).then(values => {
          const url = Object.keys(values)[0];
          feedback.setFeedback(
            this.state.course.passCode,
            '',
            '',
            '',
            '',
            url,
            false,
            value.feedbackCount - 1,
          );
        });
      });
    } else if (action === 'delay') {
      console.log('delay');
      startTime = moment.utc(this.props.startTime, 'DD/MM/YYYY HH:mm:ss')
        .add(10, 'minutes')
        .format('DD/MM/YYYY HH:mm:ss');
      endTime = moment.utc(this.props.startTime, 'DD/MM/YYYY HH:mm:ss')
        .add(10 + this.state.duration, 'minutes')
        .format('DD/MM/YYYY HH:mm:ss');
      await feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
        feedback.getFeedback(this.state.course.passCode).then(values => {
          const url = Object.keys(values)[0];
          feedback.setFeedback(
            this.state.course.passCode,
            value.startTime,
            endTime,
            value.kind,
            value.instructor,
            url,
            false,
            value.feedbackCount,
          );
        });
      });
    } else {
      await feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
        feedback.getFeedback(this.state.course.passCode).then(values => {
          const url = Object.keys(values)[0];
          feedback.setFeedback(
            this.state.course.passCode,
            startTime,
            endTime,
            value.kind,
            value.instructor,
            url,
            false,
            value.feedbackCount,
          );
        });
      });
    }
  };

  async FeedbackMailer() {
    console.log('triggering mail for passCode:' + this.state.course.passCode);
    Toast.show('Sending Email...');
    const {data} = await firebase
      .functions()
      .httpsCallable('mailingSystem')({
        passCode: this.state.course.passCode,
        type: 'Feedback',
      })
      .catch(function(error) {
        console.log(
          'There has been a problem with your mail operation: ' + error,
        );
      });
    await this.dbUpdateEmailStatus().then(() => {
      this.setState({
        emailStatus: false,
      });
    });
  }

  async sendHTTPTrigger() {
	  // return new Promise((resolve, reject) => {
      const feedback = new Feedback();
      await feedback.getFeedbackDetails(this.state.course.passCode).then(async values => {
        const url = `https://minute-paper-summarizer-775rx6qcca-uc.a.run.app/minutePaperSummarizer?passCode=${this.state.course.passCode}&startTime=${values.startTime}&endTime=${values.endTime}`;
        console.log(url);
        await fetch(url).then(response => {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            this.setState({
              loading : true,
              HTTPFailure : true,
            })
            return;
          }
          else {
            if (this.state.HTTPFailure) {
              this.setState ({
                HTTPFailure : false,
              });
            }
          }  
          response.json().then(data => {
            console.log(data);
            console.log(response.status);
            console.log('trigger sent');
          }).then(() => {
            console.log('Heyyyyyy');
            this.setState({
              processedMinutePaperResponses : true,
            });
            this.setState({
              loading : true,
            })
            this.setState({
              resultPage: true,
            });
            this.checkEmailSent().then(r => {
              console.log('');
            });
            this.props.setFeedbackState();
          });
        })
      })
    // });
      
  }

  setResultPage = () =>
  {
    this.setState({
      resultPage: false
    });
  }

  load = async () => {
    await this.checkEmailSent().then(r => {
      console.log("Load : Email Sent");
    });
  };

  componentDidMount() {
    this.load();
  }

  render() {
    if (!this.state.loading) {
      return (
        <SafeAreaView style={styles.safeContainer}>
          {this.props.currentFeedback === false ? (
            this.props.beforeFeedback === false ? (
              this.state.resultPage === false ? (
                <FeedbackForm
                  feedbackCount={this.props.feedbackCount}
                  course={this.state.course}
                  user={this.state.user}
                  setKind={this.setKind}
                />
              ) : (
                this.state.HTTPFailure === false ? (
                <ScrollView>
                  <View style={styles.result}>
                    <FeedbackResultsList
                      course={this.state.course}
                      date={this.state.date}
                      emailStatus={this.state.emailStatus}
                      feedbackresultData={this.feedbackresultData}
                      FeedbackMailer={this.FeedbackMailer}
                      cancelFB = {this.setResultPage}
                      summarizeResponses = {this.sendHTTPTrigger}
                    />
                  </View>
                  <View style={[styles.buttonRowContainer]}>
                    <Button
                      style={styles.feedbackButtonMessage}
                      buttonStyle={styles.mybutton}
                      titleStyle={{color: 'white', fontWeight: 'normal'}}
                      title={'Start New Feedback'}
                      onPress={() => {
                        this.setState({
                          resultPage: false,
                          emailStatus: false,
                          duration: this.duration,
                          date: '',
                          results: '',
                        });
                      }}
                    />
                    {/* <Button
                      style={styles.feedbackButtonMessage}
                      buttonStyle={styles.mybutton}
                      titleStyle={{color: 'white', fontWeight: 'normal'}}
                      title={'Send Trigger'}
                      onPress={() => {
                        this.sendHTTPTrigger()
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
                        this.sendHTTPTrigger()
                      }}/>
                    <Button
                      style={styles.feedbackButtonMessage}
                      buttonStyle={styles.mybutton}
                      titleStyle={{color: 'white', fontWeight: 'normal'}}
                      title={'Start New Feedback'}
                      onPress={() => {
                        this.setState({
                          resultPage: false,
                          emailStatus: false,
                          duration: this.duration,
                          date: '',
                          results: '',
                        });
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
                    Feedback {this.props.feedbackCount}
                  </Text>
                  
                  <View style={styles.container}>
                    <Text style={styles.text1}>Scheduled to go live in</Text>
                    <CountDown
                      until={this.props.beforeDuration + 5}
                      size={24}
                      onFinish={() => {
                        this.checkEmailSent().then(r => {
                          console.log('');
                        });
                        this.props.setFeedbackState();
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
                        this.startFeedback('start').then(r => '');
                      }}
                    />
                  </View>
                  <View style={[styles.buttonContainer]}>
                    <Button
                      buttonStyle={styles.mybutton}
                      titleStyle={{color: 'white', fontWeight: 'normal'}}
                      title="Extend by 10 mins"
                      onPress={() => {
                        this.startFeedback('delay').then(r => '');
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
            )
          ) : (
            <ScrollView>
              <Text style={styles.subheading}>
                Feedback {this.props.feedbackCount} in Progress
              </Text>
              <CountDown
                until={this.props.currentDuration + 5}
                size={30}
                onFinish={() => {
                    this.setState({
                      resultPage: true,
                    });
                    this.checkEmailSent().then(r => {
                      console.log('');
                    });
                    this.props.setFeedbackState();
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
                    this.startFeedback('stop').then(r => '');
                  }}
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
