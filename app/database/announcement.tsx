import database from '@react-native-firebase/database';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import moment from 'moment';

class Announcement {
  private coursePasscode: string = '';
  private date: string = '';
  private heading: string = '';
  private description: string = '';

  private reference: FirebaseFirestoreTypes.CollectionReference = firestore().collection('Announcements');

  constructor() {}

  setCoursePasscode(coursePasscode: string): void {
    this.coursePasscode = coursePasscode;
  }

  getCoursePasscode(): string {
    return this.coursePasscode;
  }

  setDate(date: string): void {
    this.date = date;
  }

  getDate(): string {
    return this.date;
  }

  setHeading(heading: string): void {
    this.heading = heading;
  }

  getHeading(): string {
    return this.heading;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getDescription(): string {
    return this.description;
  }

  async createAnnouncement(
    passCode: string,
    heading: string,
    description: string,
    date: string
  ): Promise<void> {
    try {
      await this.reference.add({
        passCode,
        heading,
        description,
        date,
      });
      console.log('Data added');
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  }

  async getAllAnnouncement(passCode: string): Promise<any[]> {
    try {
      const snapshot = await this.reference.where('passCode', '==', passCode).get();

      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => doc.data());

        list.sort((a: any, b: any) => {
          const keyA = moment.utc(a.date, 'DD/MM/YYYY HH:mm:ss');
          const keyB = moment.utc(b.date, 'DD/MM/YYYY HH:mm:ss');
          return keyB.diff(keyA); // Sort descending
        });

        return list;
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }

    return [];
  }

  // Deprecated
  async getAnnouncementUrl(passCode: string, date: string): Promise<string | null> {
    try {
      const snapshot = await database()
        .ref()
        .orderByChild('passCode')
        .equalTo(passCode)
        .once('value');

      if (snapshot.exists()) {
        const object = snapshot.val();
        const url = Object.keys(object).find((key) => object[key]['date'] === date);
        return url || null;
      }
    } catch (error) {
      console.error('Error getting announcement URL:', error);
    }

    return null;
  }

  async deleteAnnouncement(url: string): Promise<void> {
    try {
      await this.reference.doc(url).delete();
      console.log('Announcement deleted');
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  }
}

export default Announcement;