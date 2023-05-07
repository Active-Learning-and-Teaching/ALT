import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

class Courses {
  courseName: string;
  courseCode: string;
  room: string;
  passCode: string;
  instructors = [];
  TAs=[];
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



  addTAs= async(TaURL,courseURL)=> {
    let TaList = await this.getTAs(courseURL).then(value => {
      if (!value.includes(TaURL)) {
        value.push(TaURL);
        this.setTAs(courseURL,TaList);
      }
    });
    
    try {
      await database().ref('InternalDb/Courses/'+courseURL+'/TAs/'+TaURL).set(true)  
    } catch (error) {
      console.log(error)
    }

  }

  getTAs=async (url)=>{
    let ans = [];
    await database()
      .ref('InternalDb/Courses/' + url)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());
          if ('TAs' in keys) ans = keys['TAs'].map(x => x);
        }
      });
    return ans;
  }


  setTAs= async (url,TaList) => {
    await database()
      .ref(`InternalDb/Courses/${url}`)
      .update({TAs:TaList})
      .then(() => {
        console.log('Courses Tas set');
      });
  }
  
  // reference = database().ref('InternalDb/Courses/');

  // reference = database().ref('InternalDb/Courses/');
  reference = firestore().collection('Courses');


  getCourse = async passCode => {
    let ans = '';

    await this.reference
      .where('passCode', '==', passCode)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ans = snapshot.docs[0].id;
        }
      });

    return ans;
  };

  // createCourse = () => {
  //   this.reference
  //     .push()
  //     .set({
  //       courseName: this.courseName,
  //       courseCode: this.courseCode,
  //       room: this.room,
  //       passCode: this.passCode,
  //       instructors: this.instructors,
  //       imageURL: this.imageURL,
  //       instructor: this.instructor,
  //     })
  //     .then(() => {
  //       console.log('Data added');
  //       console.log(this.passCode);
  //     });
  // };

  createCourse = async () => {
    this.reference
      .add({
        courseName: this.courseName,
        courseCode: this.courseCode,
        room: this.room,
        passCode: this.passCode,
        instructors: this.instructors,
        TAs:this.TAs,
        imageURL: this.imageURL,
        instructor: this.instructor,
      })
      .then(() => {
        console.log('Course Added');
      });
  };

  // getCourseByUrl = async courseUrl => {
  //   let ans = {};
  //   await database()
  //     .ref('InternalDb/Courses/' + courseUrl)
  //     .once('value')
  //     .then(snapshot => {
  //       if (snapshot.val()) ans = snapshot.val();
  //     });
  //   return ans;
  // };

  getCourseByUrl = async courseUrl => {
    let ans = {};

    await this.reference
      .doc(courseUrl)
      .get()
      .then(doc => {
        if (!doc.empty) {
          ans = doc.data();
        }
      });

    return ans;
  };

  setCourseData = async (
    courseName,
    courseCode,
    room,
    passCode,
    instructors,
    TAs,
    imageURL,
    instructor,
    quizEmail,
    feedbackEmail,
    defaultEmailOption,
    url,
  ) => {
    await this.reference
      .doc(url)
      .set({
        courseName: courseName,
        courseCode: courseCode,
        room: room,
        passCode: passCode,
        instructors: instructors,
        imageURL: imageURL,
        instructor: instructor,
        TAs:TAs,
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
