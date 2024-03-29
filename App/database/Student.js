import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Courses from './Courses';

class Student {
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
    await this.getStudent(this.email).then(val => {
      this.url = val;
    });
  }

  async facultySetUrl(email) {
    await this.getStudent(email).then(val => {
      this.url = val;
    });
  }

  getUrl() {
    console.log('Printing url');
    console.log(this.url);
    return this.url;
  }

  reference2 = firestore().collection('Student');

  getUser = async email => {
    let ans = false;
    await this.reference2
      .where('email', '==', email)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ans = true;
        }
      });
    return ans;
  };

  getStudent = async email => {
    let ans = '';

    await this.reference2
      .where('email', '==', email)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            ans = doc.id;
          });
        }
      });
    return ans;
  };

  createUser = async (name, email) => {
    await this.reference2
      .add({
        name: name,
        email: email,
        photo: '0',
      })
      .then(() => {
        console.log('Data added');
      });
  };

  setCourseStudent = async courses => {
    await database()
      .ref('InternalDb/Student/' + this.url)
      .update({
        courses: courses,
      })
      .then(() => {
        console.log('Courses set');
      });
  }

  addCourseStudent = async courseUrl => {
    let courses = await this.getCourseStudent().then(value => {
      if (!value?.includes(courseUrl)) {
        value?.push(courseUrl);
        this.setCourseStudent(value);
      }
    });
  };

  addCourseStudent = async courseUrl => {
    await this.reference2.doc(this.url).update({
      courses: firestore.FieldValue.arrayUnion(courseUrl),
    });

    try {
      var obj = {};
      obj['students.' + this.url] = true;
      await firestore()
        .collection('Courses')
        .doc(courseUrl)
        .update(obj)
        .then(() => {
          console.log('student updated');
        });
    } catch (error) {
      console.log(error);
    }
  };

  deleteCourse = async courseUrl => {
    await this.reference2.doc(this.url).update({
      courses: firestore.FieldValue.arrayRemove(courseUrl),
    });
  };

  getAllStudents = async passCode => {
    const course = new Courses();
    let ans = '';
    await course.getCourse(passCode).then(async url => {
      await this.reference
        .orderByChild('courses')
        .once('value')
        .then(snapshot => {
          const list = [];
          snapshot.forEach(data => {
            const keys = Object(data.val());

            if ('courses' in keys) {
              const arr = data.val()['courses'];
              if (arr.includes(url)) {
                const dict = {};
                dict['name'] = keys['name'];
                dict['email'] = keys['email'];
                dict['photo'] = keys['photo'];
                list.push(dict);
              }
            }
          });
          list.sort((a, b) =>
            a.name !== undefined && b.name !== undefined
              ? a.name.toUpperCase() > b.name.toUpperCase()
                ? 1
                : b.name.toUpperCase() > a.name.toUpperCase()
                ? -1
                : 0
              : a.email > b.email
              ? 1
              : b.email > a.email
              ? -1
              : 0,
          );
          ans = list;
        });
    });
    return ans;
  };
}

export default Student;
