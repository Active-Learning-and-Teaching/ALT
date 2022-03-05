import database from '@react-native-firebase/database';

class Feedback {
  coursePasscode: string;
  startTime: string;
  endTime: string;
  instructor: string;

  constructor() {}

  reference = database().ref('InternalDb/Feedback/');

  getFeedback = async passCode => {
    let ans = null;
    await this.reference
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          ans = snapshot.val();
        }
      });
    return ans;
  };

  getFeedbackDetails = async passCode => {
    let ans = null;
    await this.reference
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const keys = Object.values(snapshot.val());
          ans = keys[0];
        }
      });
    return ans;
  };

  setFeedback = async (
    passCode,
    startTime,
    endTime,
    kind,
    instructor,
    url,
    emailResponse,
    feedbackCount,
    summary,
  ) => {
    await database()
      .ref('InternalDb/Feedback/' + url)
      .set({
        passCode: passCode,
        startTime: startTime,
        endTime: endTime,
        kind: kind,
        instructor: instructor,
        emailResponse: emailResponse,
        feedbackCount: feedbackCount,
        summary:summary,
      })
      .then(() => {
        console.log('Feedback modified');
      });
  };

  createFeedback = async (
    passCode,
    startTime,
    endTime,
    kind,
    instructor,
  ) => {
    await this.reference
      .push()
      .set({
        passCode: passCode,
        startTime: startTime,
        endTime: endTime,
        kind: kind,
        instructor: instructor,
        emailResponse: false,
        feedbackCount: 1,
      })
      .then(() => {
        console.log('Feedback created');
      });
  };
}

export default Feedback;
