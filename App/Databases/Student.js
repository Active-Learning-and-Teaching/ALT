import database from '@react-native-firebase/database';
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

  reference = database().ref('InternalDb/Student/');

  //Login
  getUser = async email => {
    let ans = false;
    await this.reference
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          ans = true;
        }
      });
    return ans;
  };

  getStudent = async email => {
    let ans = '';
    await this.reference
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());
          ans = keys[0];
        }
      });
    return ans;
  };

  createUser = async (name, email) => {
    await this.reference
      .push()
      .set({
        name: name,
        email: email,
        photo: '0',
      })
      .then(() => {
        console.log('Data added');
      });
  };

  getCourseStudent = async () => {
    let ans = [];
    await database()
      .ref('InternalDb/Student/' + this.url)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const keys = Object(snapshot.val());
          if ('courses' in keys) ans = keys['courses'].map(x => x);
        }
      });
    return ans;
  };

  setCourseStudent = async courses => {
    await database()
      .ref('InternalDb/Student/' + this.url)
      .set({
        name: this.getName(),
        email: this.getEmail(),
        photo: 0,
        courses: courses,
      })
      .then(() => {
        console.log('Courses set');
      });
  };

  addCourseStudent = async courseUrl => {
    await this.getCourseStudent().then(value => {
      if (!value.includes(courseUrl)) {
        value.push(courseUrl);
        this.setCourseStudent(value);
      }
    });
  };

  deleteCourse = async courseUrl => {
    await this.getCourseStudent().then(value => {
      if (value.includes(courseUrl)) {
        const index = value.indexOf(courseUrl);
        value.splice(index, 1);

        this.setCourseStudent(value);
      }
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
