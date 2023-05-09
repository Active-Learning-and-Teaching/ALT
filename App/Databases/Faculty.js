import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/functions';
class Faculty {
  name: string;
  email: string;
  url: string;

  constructor() {}

  setName(name) {
    this.name = name;
  }
  setEmail(email) {
    this.email = email;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }
  async setUrl() {
    await this.getFaculty(this.email).then(val => {
      this.url = val;
    });
  }
  getUrl() {
    return this.url;
  }

  reference = firestore().collection('Faculty');

  getUser = async email => {
    let ans = false;
    await this.reference
      .where('email', '==', email)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ans = true;
        }
      });
    return ans;
  };

  getFaculty = async email => {
    let ans = '';
    await this.reference
      .where('email', '==', email)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ans = snapshot.docs[0].id;
        }
      });
    return ans;
  };

  createUser = async (name, email) => {
    await this.reference
      .add({
        name: name,
        email: email,
        photo: '0',
      })
      .then(() => {
        console.log('Data added');
      });
  };

  addCourseFaculty = async courseUrl => {
    await this.reference.doc(this.url).update({
      courses: firestore.FieldValue.arrayUnion(courseUrl),
    });
  };

  //@Vishwesh
  deleteCourse = async (passCode, courseUrl) => {
    await this.getCourseFaculty().then(value => {
      if (value.includes(courseUrl)) {
        const index = value.indexOf(courseUrl);
        value.splice(index, 1);
        this.setCourseFaculty(value);
      }
    });
    console.log('>>');
    console.log('triggering delete for passCode:' + passCode);
    const {data} = firebase
      .functions()
      .httpsCallable('deleteCourse')({
        passCode: passCode,
      })
      .catch(function(error) {
        console.log(
          'There has been a problem with your delete Course operation: ' +
            error,
        );
      });
  };
}

export default Faculty;
