import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';

class Faculty {
  private name: string | undefined;
  private email: string | undefined;
  private url: string | undefined;

  private reference = firestore().collection('Faculty');

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

  async setUrl(): Promise<void> {
    if (this.email) {
      const val = await this.getFaculty(this.email);
      this.url = val;
    }
  }

  getUrl(): string | undefined {
    return this.url;
  }

  async getUser(email: string): Promise<boolean> {
    let ans = false;
    const snapshot = await this.reference.where('email', '==', email).get();
    if (!snapshot.empty) {
      ans = true;
    }
    return ans;
  }

  async getFaculty(email: string): Promise<string> {
    let ans = '';
    const snapshot = await this.reference.where('email', '==', email).get();
    if (!snapshot.empty) {
      ans = snapshot.docs[0].id;
    }
    return ans;
  }

  async createUser(name: string, email: string): Promise<void> {
    await this.reference.add({
      name: name,
      email: email,
      photo: '0',
    });
    console.log('Data added');
  }

  async addCourseFaculty(courseUrl: string): Promise<void> {
    if (this.url) {
      await this.reference.doc(this.url).update({
        courses: firestore.FieldValue.arrayUnion(courseUrl),
      });
    }
  }

  async deleteCourse(passCode: string, courseUrl: string): Promise<void> {
    if (this.url) {
      await this.reference.doc(this.url).update({
        courses: firestore.FieldValue.arrayRemove(courseUrl),
      });
      console.log('>>');
      console.log('triggering delete for passCode:' + passCode);

      try {
        const { data } = await firebase.functions().httpsCallable('deleteCourse')({
          passCode: passCode,
        });
      } catch (error) {
        console.log(
          'There has been a problem with your delete Course operation: ' +
            error,
        );
      }
    }
  }
}

export default Faculty;
