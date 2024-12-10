import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

class Courses {
  courseName: string = '';
  courseCode: string = '';
  room: string = '';
  passCode: string = '';
  instructors: string[] = [];
  TAs: string[] = [];
  imageURL: string = '';
  instructor: string = '';

  // Firestore reference
  private reference = firestore().collection('Courses');

  constructor() {}

  getcourseName(): string {
    return this.courseName;
  }

  setcourseName(courseName: string): void {
    this.courseName = courseName;
  }

  getcourseCode(): string {
    return this.courseCode;
  }

  setcourseCode(courseCode: string): void {
    this.courseCode = courseCode;
  }

  getRoom(): string {
    return this.room;
  }

  setRoom(room: string): void {
    this.room = room;
  }

  getPassCode(): string {
    return this.passCode;
  }

  setPassCode(): void {
    this.passCode = (+new Date()).toString(36);
  }

  async setImage(): Promise<void> {
    this.imageURL = (Math.floor(Math.random() * 8) + 1).toString();
  }

  getImage(): string {
    return this.imageURL;
  }

  addInstructors(faculty: { getUrl: () => string; getName: () => string }): void {
    this.instructors.push(faculty.getUrl());
    this.instructor = faculty.getName();
  }

  async addTAs(taId: string, courseUrl: string): Promise<void> {
    try {
      // Retrieve the current TAs for the course
      const courseDoc = await this.reference.doc(courseUrl).get();

      if (!courseDoc.exists) {
        throw new Error('Course does not exist');
      }

      const courseData = courseDoc.data();
      const currentTAs: string[] = courseData?.TAs || [];

      // Add the new TA if not already present
      if (!currentTAs.includes(taId)) {
        currentTAs.push(taId);

        // Update the course document
        await this.reference.doc(courseUrl).update({ TAs: currentTAs });
        console.log(`TA added to course: ${taId}`);
      } else {
        console.log('TA already exists in the course');
      }
    } catch (error) {
      console.error('Error adding TA:', error);
    }
  }

  async getCourse(passCode: string): Promise<string> {
    let ans = '';
    await this.reference
      .where('passCode', '==', passCode)
      .get()
      .then((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        if (!snapshot.empty) {
          ans = snapshot.docs[0].id;
        }
      });
    return ans;
  }

  async createCourse(): Promise<void> {
    await this.reference
      .add({
        courseName: this.courseName,
        courseCode: this.courseCode,
        room: this.room,
        passCode: this.passCode,
        instructors: this.instructors,
        TAs: this.TAs,
        imageURL: this.imageURL,
        instructor: this.instructor,
      })
      .then(() => {
        console.log('Course Added');
      });
  }

  async getCourseByUrl(courseUrl: string): Promise<Record<string, any>> {
    let ans: Record<string, any> = {};
    await this.reference
      .doc(courseUrl)
      .get()
      .then((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
        if (doc.exists) {
          ans = doc.data() || {};
        }
      });
    return ans;
  }

  async setCourseData(
    courseName: string,
    courseCode: string,
    room: string,
    passCode: string,
    instructors: string[],
    TAs: string[],
    imageURL: string,
    instructor: string,
    quizEmail: string,
    feedbackEmail: string,
    defaultEmailOption: boolean,
    url: string,
  ): Promise<void> {
    await this.reference
      .doc(url)
      .set({
        courseName,
        courseCode,
        room,
        passCode,
        instructors,
        imageURL,
        instructor,
        TAs,
        quizEmail,
        feedbackEmail,
        defaultEmailOption,
      })
      .then(() => {
        console.log('Courses modified');
      });
  }
}

export default Courses;
