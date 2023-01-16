import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {StyleSheet, View, Alert, ScrollView, SafeAreaView} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import CourseCard from './CourseCard';
import Student from '../../Databases/Student';
import Courses from '../../Databases/Courses';
import {firebase} from '@react-native-firebase/functions';
import {CommonActions} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {Button} from 'react-native-elements';

export default class StudentDashBoard extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      courseList: [],
    };
  }

  getCurrentUser = async () => {
    const curr = await auth().currentUser;
    const student = new Student();
    await student.setName(curr.displayName);
    await student.setEmail(curr.email);
    await student.setUrl().then(() => {
      console.log();
    });

    await this.setState({
      currentUser: student,
    });
  };

  unSubscribe_Notifications = () => {
    for (let i = 0; i < this.state.courseList.length; i++) {
      messaging()
        .unsubscribeFromTopic(this.state.courseList[i].passCode)
        .then(() =>
          console.log(
            `Unsubscribed to topic! ${this.state.courseList[i].passCode}`,
          ),
        );
    }
  };

  deleteAccount = async (url, uid) => {
    //Unsubscribing to notification and then calling the delete end point of the Cloud Function.
    this.unSubscribe_Notifications();
    const {data} = firebase
      .functions()
      .httpsCallable('deleteStudent')({
        key: url,
        userUID: uid,
      })
      .catch(function(error) {
        console.log(
          'There has been a problem with your fetch operation: ' + error,
        );
      });
    console.log(this.state.currentUser.url);
    console.log('Deleted Account');
  };

  showAlert() {
    Alert.alert(
      'Are you sure you want to delete account?',
      'This will delete all the data associated with the account',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Pressed');
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            const studenURL = this.state.currentUser.url;
            const uid = auth().currentUser.uid;
            console.log(auth().currentUser);
            this.deleteAccount(studenURL, uid);
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'Login'}],
              }),
            );
          },
        },
      ],
    );
  }

  signOut = async () => {
    // Unsubcribing to notifications before signout
    this.unSubscribe_Notifications();
    auth()
      .signOut()
      .then(async r => {
        await this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Login'}],
          }),
        );

        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } catch (err) {
          console.log(err);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

//  getAllCourses2 = () => {
//    database()
//      .ref('InternalDb/Student/' + this.state.currentUser.url)
//      .on('value', snapshot => {
//        console.log(snapshot.val())
//        if (snapshot.val()) {
//          const keys = Object(snapshot.val());
//
//          this.setState({
//            courseList: [],
//          });
//          if ('courses' in keys) {
//            const arr = snapshot.val()['courses'].filter(n => n);
//            const course = new Courses();
//            const courses = [];
//
//            for (var i = 0; i < arr.length; i++) {
//              course.getCourseByUrl(arr[i]).then(r => {
//                courses.push(r);
//                messaging()
//                  .subscribeToTopic(r.passCode)
//                  .then(() =>
//                    console.log(`Subscribed to topic! ${r.passCode}`),
//                  );
//
//                this.setState({
//                  courseList: courses,
//                });
//              });
//            }
//          }
//        }
//      });
//  };

 getAllCourses = () => {
    firestore().collection('Student')
        .doc(this.state.currentUser.url)
        .onSnapshot(doc => {
            if(doc.exists){
                console.log(doc.data());
                const keys = Object(doc.data());

                this.setState({
                courseList: [],
                });
                 if ('courses' in keys) {
                    const arr = doc.data()['courses'].filter(n => n);
                    const course = new Courses();
                    const courses = [];

                    for (var i = 0; i < arr.length; i++) {
                        course.getCourseByUrl(arr[i]).then(r => {
                            courses.push(r);
                            messaging()
                              .subscribeToTopic(r.passCode)
                              .then(() =>
                                console.log(`Subscribed to topic! ${r.passCode}`),
                              );

                            this.setState({
                                courseList: courses,
                            });
                        });
                    }
                }
            }
        }
        );
 }


  componentDidMount() {
    this.getCurrentUser().then(() => {
      if (this.state.currentUser.url == '') {
        this.componentDidMount();
      }
      this.getAllCourses();
      this.props.route.params
        .setUser(this.state.currentUser)
        .then(() => console.log());
    });
    console.log('Student Dashboard');
  }
  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <View style={styles.grid}>
            {this.state.courseList.map((item, i) => (
              <CourseCard
                course={item}
                type={'student'}
                user={this.state.currentUser}
                navigation={this.props.navigation}
                key={i}
              />
            ))}
          </View>

          <Button
            buttonStyle={styles.signout}
            titleStyle={{color: 'white', fontWeight: 'normal'}}
            title="Sign Out"
            onPress={this.signOut}
          />
          <Button
            buttonStyle={styles.account}
            titleStyle={{color: 'white', fontWeight: 'normal'}}
            title="Delete Account"
            onPress={() => {
              this.showAlert();
            }}
          />
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
  grid: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20,
  },
  buttonMessage: {
    paddingTop: 10,
    marginTop: 15,
  },
  mybutton: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  signout: {
    backgroundColor: 'tomato',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 100,
    marginRight: 100,
  },
  account: {
    backgroundColor: '#333',
    borderColor: 'black',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 100,
    marginRight: 100,
  },
});
