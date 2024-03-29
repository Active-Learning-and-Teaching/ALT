import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import Quiz from './Quiz';
class QuizResponses {
  coursePasscode: string;
  userID: string;
  userName: string;
  answer: string;
  timestamp: string;

  constructor() {}

  reference2 = firestore().collection('KBCResponse');

  getResponse = async (userID, passCode) => {
    let ans = null;
    await this.reference2
      .where('userID_passCode', '==', userID + '_' + passCode)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const keys = snapshot.docs[0].id;
          ans = keys;
        }
      });

    return ans;
  };

  setResponse = async (
    passCode,
    userID,
    userName,
    answer,
    timestamp,
    name,
    quiz_response_time,
    normalised_response_time,
    url,
    opens,
    firstOpen,
  ) => {
    await this.reference2
      .doc(url)
      .set({
        passCode: passCode,
        userID: userID,
        userName: userName,
        userID_passCode: userID + '_' + passCode,
        answer: answer,
        timestamp: timestamp,
        name: name,
        quiz_response_time: quiz_response_time,
        normalised_response_time: normalised_response_time,
        opens: opens,
        firstOpen: firstOpen,
      })
      .then(() => {
        console.log('Response modified');
      });
  };

  createResponse = async (
    passCode,
    userID,
    userName,
    answer,
    timestamp,
    name,
    quiz_response_time,
    normalised_response_time,
    opens,
    firstOpen,
  ) => {
    await this.reference2
      .add({
        passCode: passCode,
        userID: userID,
        userName: userName,
        userID_passCode: userID + '_' + passCode,
        answer: answer,
        timestamp: timestamp,
        name: name,
        quiz_response_time: quiz_response_time,
        normalised_response_time: normalised_response_time,
        opens: opens,
        firstOpen: firstOpen,
      })
      .then(() => {
        console.log('Response Created');
      });
  };

  getAllMcqResponse = async (passCode, startTime, endTime) => {
    let ans = null;
    await this.reference2
      .where('passCode', '==', passCode)
      .get()
      .then(snapshot => {
        const list = {A: 0, B: 0, C: 0, D: 0};
        snapshot.forEach(data => {
          const keys = data.data();
          const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment.utc(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');
          if (temp1 <= temp2 && temp1 >= temp) {
            list[keys['answer']] += 1;
          }
        });
        ans = list;
      });
    return ans;
  };

  getAllAlphaNumericalResponse = async (passCode, startTime, endTime) => {
    let ans = null;
    await this.reference2
      .where('passCode', '==', passCode)
      .get()
      .then(snapshot => {
        const dict = {};
        snapshot.forEach(data => {
          const keys = data.data();
          const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment.utc(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');
          if (temp1 <= temp2 && temp1 >= temp) {
            let answer = keys['answer']
              .trim()
              .toUpperCase()
              .replace(/,/g, '');
            console.log(answer);
            if (answer in dict) {
              dict[answer] += 1;
            } else {
              dict[answer] = 1;
            }
          }
        });
        ans = dict;
      });
    return ans;
  };
}

export default QuizResponses;
