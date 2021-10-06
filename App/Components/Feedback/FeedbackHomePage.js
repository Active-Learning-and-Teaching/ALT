import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import FeedbackStudentPage from './FeedbackStudentPage';
import FeedbackFacultyPage from './FeedbackFacultyPage';
import database from '@react-native-firebase/database';
import moment from 'moment';

export default class FeedbackHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.route.params.type,
      course: this.props.route.params.course,
      user: this.props.route.params.user,
      beforeFeedback: false,
      currentFeedback: false,
      currentDuration: 0,
      beforeDuration: 0,
      feedbackCount: 0,
      startTime: '',
      kind: null,
    };
    this.setFeedbackState = this.setFeedbackState.bind(this);
  }

  setFeedbackState() {
    this.isCurrentFeedback();
  }

  cancelFeedback = () => {
    let feedbackCount = this.state.feedbackCount;
    this.setState({
      currentFeedback:false,
      feedbackCount: feedbackCount-1,
    })
  }


  isCurrentFeedback = () => {
    database()
      .ref('InternalDb/Feedback/')
      .orderByChild('passCode')
      .equalTo(this.state.course.passCode)
      .on('value', snapshot => {
        if (snapshot.val()) {
          const values = Object.values(snapshot.val())[0];
          const curr = moment(database().getServerTime());
          const startTime = moment(values.startTime, 'DD/MM/YYYY HH:mm:ss');
          const endTime = moment(values.endTime, 'DD/MM/YYYY HH:mm:ss');
          const beforeDuration = Math.abs(
            moment(curr).diff(startTime, 'seconds'),
          );
          const duration = Math.abs(moment(curr).diff(endTime, 'seconds'));

          if (curr >= startTime && curr <= endTime) {
            this.setState({
              beforeFeedback: false,
              currentFeedback: true,
              currentDuration: duration,
              beforeDuration: 0,
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            });
          } else if (curr < startTime) {
            this.setState({
              beforeFeedback: true,
              currentFeedback: false,
              currentDuration: 0,
              beforeDuration: beforeDuration,
              startTime: startTime,
              feedbackCount: values.feedbackCount,
              kind: values.kind,
            });
          } else {
            this.setState({
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

  componentDidMount() {
    this.isCurrentFeedback();
  }

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        {this.state.type === 'faculty' ? (
          <FeedbackFacultyPage
            user={this.state.user}
            course={this.state.course}
            beforeFeedback={this.state.beforeFeedback}
            currentFeedback={this.state.currentFeedback}
            currentDuration={this.state.currentDuration}
            beforeDuration={this.state.beforeDuration}
            setFeedbackState={this.setFeedbackState}
            startTime={this.state.startTime}
            feedbackCount={this.state.feedbackCount}
            kind={this.state.kind}
            cancelFeedback={this.cancelFeedback}
          />
        ) : (
          <FeedbackStudentPage
            user={this.state.user}
            course={this.state.course}
            beforeFeedback={this.state.beforeFeedback}
            currentFeedback={this.state.currentFeedback}
            currentDuration={this.state.currentDuration}
            beforeDuration={this.state.beforeDuration}
            setFeedbackState={this.setFeedbackState}
            kind={this.state.kind}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
