import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

class FeedbackResponses {
  private coursePasscode: string = '';
  private userID: string = '';
  private userName: string = '';
  private answer: [] = [];
  private timestamp: string = '';

  constructor() {}

  reference = firestore().collection('FeedbackResponse');

  /**
   * Retrieves the feedback response ID for a given user and passcode.
   * @param userID - The user ID.
   * @param passCode - The course passcode.
   * @returns The document ID if found, otherwise null.
   */
  getFeedbackResponse = async (
    userID: string,
    passCode: string
  ): Promise<string | null> => {
    let ans: string | null = null;
    await this.reference
      .where('userID_passCode', '==', `${userID}_${passCode}`)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          ans = snapshot.docs[0].id;
        }
      });
    return ans;
  };

  /**
   * Checks if a feedback response exists for a student within a time range.
   * @param userID - The user ID.
   * @param passCode - The course passcode.
   * @param startTime - The start time.
   * @param endTime - The end time.
   * @returns True if a response exists within the range, otherwise false.
   */
  getFeedbackResponseForOneStudent = async (
    userID: string,
    passCode: string,
    startTime: string,
    endTime: string
  ): Promise<boolean | null> => {
    let ans: boolean | null = null;
    await this.reference
      .where('userID_passCode', '==', `${userID}_${passCode}`)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const keys = snapshot.docs[0].data();
          const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment.utc(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');

          ans = temp1 <= temp2 && temp1 >= temp;
        }
      });
    return ans;
  };

  /**
   * Sets a feedback response in the database.
   * @param passCode - The course passcode.
   * @param userID - The user ID.
   * @param userName - The user name.
   * @param responses - The response data.
   * @param timestamp - The timestamp.
   * @param url - The document URL.
   * @param firstOpen - Whether this is the first open.
   * @param feedback_response_time - The time taken to respond.
   */
  setFeedbackResponse = async (
    passCode: string,
    userID: string,
    userName: string,
    responses: any,
    timestamp: string,
    url: string,
    firstOpen: boolean,
    feedback_response_time: number
  ): Promise<void> => {
    await this.reference
      .doc(url)
      .set({
        passCode,
        userID,
        userName,
        userID_passCode: `${userID}_${passCode}`,
        responses,
        timestamp,
        firstOpen,
        feedback_response_time,
      })
      .then(() => {
        console.log('Response modified');
      });
  };

  /**
   * Creates a feedback response in the database.
   * @param passCode - The course passcode.
   * @param userID - The user ID.
   * @param userName - The user name.
   * @param responses - The response data.
   * @param timestamp - The timestamp.
   * @param firstOpen - Whether this is the first open.
   * @param feedback_response_time - The time taken to respond.
   */
  createFeedbackResponse = async (
    passCode: string,
    userID: string,
    userName: string,
    responses: any,
    timestamp: string,
    firstOpen: boolean,
    feedback_response_time: number
  ): Promise<void> => {
    await this.reference
      .add({
        passCode,
        userID,
        userName,
        userID_passCode: `${userID}_${passCode}`,
        responses,
        timestamp,
        firstOpen,
        feedback_response_time,
      })
      .then(() => {
        console.log('Response Created');
      });
  };

  /**
   * Retrieves all responses for a given passcode and time range.
   * @param passCode - The course passcode.
   * @param startTime - The start time.
   * @param endTime - The end time.
   * @param kind - The kind of response expected.
   * @returns An object containing the responses.
   */
  getAllResponse = async (
    passCode: string,
    startTime: string,
    endTime: string,
    kind: string
  ): Promise<any> => {
    let ans: any = null;
    console.log('checking', passCode);
    await this.reference
      .where('passCode', '==', passCode)
      .get()
      .then(async snapshot => {
        let list: { [key: string]: number } | any[] = {};
        if (kind === '0') {
          list = { 0: 0, 1: 0, 2: 0 };
        } else if (kind === '1') {
          list = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        } else {
          list = [];
        }
        await snapshot.docs.forEach(doc => {
          const keys = doc.data() as { timestamp: string; responses: string | number };
  
          const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment.utc(keys.timestamp, 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');
  
          if (kind === '0' || kind === '1') {
            if (temp1 <= temp2 && temp1 >= temp) {
              const response = keys.responses as string | number;
              if (typeof response === 'number' && response in list) {
                (list as { [key: number]: number })[response] += 1;
              }
            }
          } else {
            (list as any[]).push(keys.responses);
          }
        });
        ans = list;
      })
      .catch(error => {
        console.error(error);
      });
    return ans;
  };
  
}

export default FeedbackResponses;
