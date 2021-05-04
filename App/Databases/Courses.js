import database from '@react-native-firebase/database';

class Courses {
  courseName: string;
  courseCode: string;
  room: string;
  passCode: string;
  instructors = [];
  imageURL: string;
  instructor: string;

  constructor() {}

  getcourseName() {
    return this.courseName;
  }

  setcourseName(courseName) {
    this.courseName = courseName;
  }

  getcourseCode() {
    return this.courseCode;
  }

  setcourseCode(courseCode) {
    this.courseCode = courseCode;
  }

  getRoom() {
    return this.room;
  }

  setRoom(room) {
    this.room = room;
  }

  getPassCode() {
    return this.passCode;
  }

  setPassCode() {
    this.passCode = (+new Date()).toString(36);
  }

  async setImage() {
    this.imageURL = Math.floor(Math.random() * 8) + 1;
  }

  getImage() {
    return this.imageURL;
  }

  addInstructors(faculty) {
    this.instructors.push(faculty.getUrl());
    this.instructor = faculty.getName();
  }

  reference = database().ref('InternalDb/Courses/');

  getCourse = async passCode => {
    let ans = '';
    await this.reference
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());
          ans = keys[0];
        }
      });
    return ans;
  };

  createCourse = () => {
    this.reference
      .push()
      .set({
        courseName: this.courseName,
        courseCode: this.courseCode,
        room: this.room,
        passCode: this.passCode,
        instructors: this.instructors,
        imageURL: this.imageURL,
        instructor: this.instructor,
      })
      .then(() => {
        console.log('Data added');
        console.log(this.passCode);
      });
  };

  getCourseByUrl = async courseUrl => {
    let ans = {};
    await database()
      .ref('InternalDb/Courses/' + courseUrl)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) ans = snapshot.val();
      });
    return ans;
  };

  setCourseData = async (
    courseName,
    courseCode,
    room,
    passCode,
    instructors,
    imageURL,
    instructor,
    quizEmail,
    feedbackEmail,
    defaultEmailOption,
    url,
  ) => {
    await database()
      .ref('InternalDb/Courses/' + url)
      .set({
        courseName: courseName,
        courseCode: courseCode,
        room: room,
        passCode: passCode,
        instructors: instructors,
        imageURL: imageURL,
        instructor: instructor,
        quizEmail: quizEmail,
        feedbackEmail: feedbackEmail,
        defaultEmailOption: defaultEmailOption,
      })
      .then(() => {
        console.log('Courses modified');
      });
  };
}

export default Courses;
