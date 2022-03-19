import database from '@react-native-firebase/database';
import moment from 'moment';

class FeedbackResponses {
  coursePasscode: string;
  userID: string;
  userName: string;
  answer: [];
  timestamp: string;

  constructor() {}

  reference = database().ref('InternalDb/FeedbackResponse/');

  getFeedbackResponse = async (userID, passCode) => {
    let ans = null;
    await this.reference
      .orderByChild('userID_passCode')
      .equalTo(userID + '_' + passCode)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());
          ans = keys[0];
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
      .orderByChild('userID_passCode')
      .equalTo(userID + '_' + passCode)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const keys = Object.values(snapshot.val())[0];
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
    await database()
      .ref('InternalDb/FeedbackResponse/' + url)
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
      .push()
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
        console.log('Response Created');
      });
  };

  getAllResponse = async (passCode, startTime, endTime, kind) => {
    let ans = null;
    // console.log('Getting all Feedback Responses')
    await this.reference
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value')
      .then(async snapshot => {
        let list = {};
        // console.log("Snapshot "  + snapshot.val());
        if (kind === '0') {
          list = {0: 0, 1: 0, 2: 0};
        } else if (kind === '1') {
          list = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        } else {
          list = [];
        }
        await snapshot.forEach(data => {
          const keys = Object(data.val());
          // console.log(keys);
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
