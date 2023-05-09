import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

class FeedbackResponses {
  coursePasscode: string;
  userID: string;
  userName: string;
  answer: [];
  timestamp: string;

  constructor() {}

  reference = firestore().collection('FeedbackResponse');

  getFeedbackResponse = async (userID, passCode) => {
    let ans = null;
    await this.reference
      .where('userID_passCode', '==', userID + '_' + passCode)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ans = snapshot.docs[0].id;
        }
      });
    return ans;
  };

  getFeedbackResponseForOneStudent = async (
    userID,
    passCode,
    startTime,
    endTime,
  ) => {
    let ans = null;
    await this.reference
      .where('userID_passCode', '==', userID + '_' + passCode)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const keys = snapshot.docs[0].data();
          const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment.utc(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');

          if (temp1 <= temp2 && temp1 >= temp) {
            ans = true;
          } else {
            ans = false;
          }
        }
      });
    return ans;
  };

  setFeedbackResponse = async (
    passCode,
    userID,
    userName,
    responses,
    timestamp,
    url,
    firstOpen,
    feedback_response_time,
  ) => {
    await this.reference
      .doc(url)
      .set({
        passCode: passCode,
        userID: userID,
        userName: userName,
        userID_passCode: userID + '_' + passCode,
        responses: responses,
        timestamp: timestamp,
        firstOpen: firstOpen,
        feedback_response_time: feedback_response_time,
      })
      .then(() => {
        console.log('Response modified');
      });
  };

  createFeedbackResponse = async (
    passCode,
    userID,
    userName,
    responses,
    timestamp,
    firstOpen,
    feedback_response_time,
  ) => {
    await this.reference
      .add({
        passCode: passCode,
        userID: userID,
        userName: userName,
        userID_passCode: userID + '_' + passCode,
        responses: responses,
        timestamp: timestamp,
        firstOpen: firstOpen,
        feedback_response_time: feedback_response_time,
      })
      .then(() => {
        console.log('Response Created');
      });
  };

  getAllResponse = async (passCode, startTime, endTime, kind) => {
    let ans = null;
    console.log('checking', passCode);
    await this.reference
      .where('passCode', '==', passCode)
      .get()
      .then(async snapshot => {
        let list = {};
        if (kind === '0') {
          list = {0: 0, 1: 0, 2: 0};
        } else if (kind === '1') {
          list = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        } else {
          list = [];
        }
        await snapshot.docs.forEach(doc => {
          const keys = doc.data();
          const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment.utc(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');

          if (kind == '0' || kind == '1') {
            if (temp1 <= temp2 && temp1 >= temp) {
              list[keys['responses']] += 1;
            }
          } else {
            list.push(keys['responses']);
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
