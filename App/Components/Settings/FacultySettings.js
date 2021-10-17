import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Switch,
} from 'react-native';
import {Button} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Courses from '../../Databases/Courses';

export default class FacultySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.route.params.type,
      course: this.props.route.params.course,
      user: this.props.route.params.user,
      quizEmail: this.props.route.params.course.quizEmail,
      feedbackEmail: this.props.route.params.course.feedbackEmail,
      defaultEmailOption: this.props.route.params.course.defaultEmailOption,
      setCourse: this.props.route.params.setCourse,
      error: null,
    };
  }

  setData = async data => {
    const {quizEmail, feedbackEmail, defaultEmailOption} = this.state;
    if (quizEmail === '' || feedbackEmail === '') {
      this.setState({
        error: 'Enter details.',
      });
    } else {
      this.setState({
        error: null,
      });

      const courses = new Courses();
      await courses.getCourse(this.state.course.passCode).then(url => {
        //Update courseDb
        courses.setCourseData(
          this.state.course.courseName,
          this.state.course.courseCode,
          this.state.course.room,
          this.state.course.passCode,
          this.state.course.instructors,
          this.state.course.imageURL,
          this.state.course.instructor,
          quizEmail,
          feedbackEmail,
          defaultEmailOption,
          url,
        );

        const course = this.state.course;
        course.quizEmail = quizEmail;
        course.feedbackEmail = feedbackEmail;
        course.defaultEmailOption = defaultEmailOption;
        this.state.setCourse(course).then(r => {
          data === 'email'
            ? Toast.show(`Updated Email Settings`)
            : Toast.show(`Updated ${this.state.course.courseName} Settings`);
        });
      });
    }
  };

  toggleSwitch = async () => {
    await this.setState({
      defaultEmailOption: !this.state.defaultEmailOption,
    });
    await this.setData('email').then(r => {
      console.log('set data');
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.toggleButtonView}>
              <Text style={styles.toggleText}>Email Responses</Text>
              <Switch
                trackColor={{false: '#767577', true: 'tomato'}}
                thumbColor={
                  this.state.defaultEmailOption ? '#f4f3f4' : '#f4f3f4'
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.toggleSwitch}
                value={this.state.defaultEmailOption}
              />
            </View>
            <Text style={styles.text}>Current Email for Quiz Results</Text>
            <TextInput
              caretHidden
              style={styles.textInput}
              autoCapitalize="none"
              textAlign={'center'}
              onChangeText={text => {
                this.setState({
                  quizEmail: text,
                });
              }}
              value={this.state.quizEmail}
            />
            <Text style={styles.text}>Current Email for Minute Results</Text>
            <TextInput
              caretHidden
              style={styles.textInput}
              autoCapitalize="none"
              textAlign={'center'}
              onChangeText={text => {
                this.setState({
                  feedbackEmail: text,
                });
              }}
              value={this.state.feedbackEmail}
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
              title="Update Settings"
              onPress={() => {
                this.setData('completeData').then(r => {
                  console.log('set data');
                });
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 35,
  },
  toggleButtonView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 30,
  },
  toggleText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  textInput: {
    color: 'black',
    width: '100%',
    paddingTop: 15,
    paddingBottom: 5,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 20,
  },
  text: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 55,
    padding: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonMessage: {
    marginTop: 30,
    paddingTop: 20,
    marginBottom: 30,
    paddingBottom: 20,
  },
  mybutton: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 30,
  },
});
