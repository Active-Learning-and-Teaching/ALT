import database from '@react-native-firebase/database';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Courses from './courses';

class Student {
  name: string | undefined;
  email: string | undefined;
  url: string | undefined;
  TAs: string[] = [];

  private reference2 = firestore().collection('Student');

  constructor() {}

  setName(name: string): void {
    this.name = name;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getName(): string | undefined {
    return this.name;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  async addTACourseStudent(courseUrl: string): Promise<void> {
    if (this.url) {
      // 1. Add the course to the student's TAs array (in the Student document)
      await this.reference2.doc(this.url).update({
        TAs: firestore.FieldValue.arrayUnion(courseUrl),
      });
  
      // 2. Now, update the course document to include the student's URL in the TAs field
      try {
        // Check if the course document exists first
        const courseDoc = await firestore().collection('Courses').doc(courseUrl).get();
  
        if (!courseDoc.exists) {
          throw new Error("Course does not exist");
        }
  
        const courseData = courseDoc.data();
        if (!courseData?.TAs) {
          throw new Error("TAs field is missing in the course document");
        }
  
        // Update the TAs array in the Courses collection
        await firestore().collection('Courses').doc(courseUrl).update({
          TAs: firestore.FieldValue.arrayUnion(this.url),
        });
  
        console.log('TA added to course');
      } catch (error) {
        console.log('Error adding TA to course:', error);
      }
    }
  }

  async setUrl(): Promise<void> {
    if (this.email) {
      await this.getStudent(this.email).then(val => {
        this.url = val;
      });
    }
  }

  async facultySetUrl(email: string): Promise<void> {
    await this.getStudent(email).then(val => {
      this.url = val;
    });
  }

  getUrl(): string | undefined {
    console.log('Printing url');
    console.log(this.url);
    return this.url;
  }

  getUser(email: string): Promise<boolean> {
    return this.getStudent(email).then(val => {
      return val !== '';
    });
  }

  private async getStudent(email: string): Promise<string> {
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
  }

  async createUser(name: string, email: string): Promise<void> {
    await this.reference2
      .add({
        name: name,
        email: email,
        photo: '0',
      })
      .then(() => {
        console.log('Data added');
      });
  }

  private async getCourseStudent(): Promise<string[]> {
    // Assuming this method fetches the list of course URLs for the student
    if (this.url) {
      const snapshot = await this.reference2.doc(this.url).get();
      const data = snapshot.data();
      return data?.courses || [];
    }
    return [];
  }

  private async setCourseStudent(courses: string[]): Promise<void> {
    if (this.url) {
      await database()
        .ref('InternalDb/Student/' + this.url)
        .update({
          courses: courses,
        })
        .then(() => {
          console.log('Courses set');
        });
    }
  }

  async addCourseStudent(courseUrl: string): Promise<void> {
    if (this.url) {
      // Add course to the current student's courses
      await this.reference2.doc(this.url).update({
        courses: firestore.FieldValue.arrayUnion(courseUrl),
      });

      try {
        const obj: Record<string, boolean> = {};
        obj['students.' + this.url] = true;
        await firestore()
          .collection('Courses')
          .doc(courseUrl)
          .update(obj)
          .then(() => {
            console.log('Student updated');
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async deleteCourse(courseUrl: string): Promise<void> {
    if (this.url) {
      await this.reference2.doc(this.url).update({
        courses: firestore.FieldValue.arrayRemove(courseUrl),
      });
    }
  }

  async getAllStudents(passCode: string): Promise<any[]> {
    const course = new Courses();
    let ans: any[] = [];
    await course.getCourse(passCode).then(async url => {
      await firestore()
        .collection('Student')
        .where('courses', 'array-contains', url)
        .get()
        .then((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
          const list: any[] = [];
          snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
            const data = doc.data();
            if (data) {
              const dict = {
                name: data['name'],
                email: data['email'],
                photo: data['photo'],
              };
              list.push(dict);
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
  }
}

export default Student;
