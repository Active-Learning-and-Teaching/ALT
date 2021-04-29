/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable eol-last */
/* eslint-disable no-var */
/* eslint-disable quotes */
/* eslint-disable indent */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// const url = 'https://testdb-cloudfn.firebaseio.com/'
const url = 'https://testfortls.firebaseio.com/';
// const url = 'https://tls-op-default-rtdb.firebaseio.com/'
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.QuizNotification = functions.database
  .ref('InternalDb/KBC/{qid}') // Put your path here with the params.
  .onWrite(async (change, context) => {
    try {
      const {after} = change;
      const {_data} = after;
      const {_path} = after;
      console.log('------------------');
      console.log('function Quiz Notification executing');
      //console.log(_path);
      //console.log(after);
      console.log('------------------');

      //console.log(_data.passCode);
      //console.log(context);
      //console.log(after);

      if (!_data.emailResponse && _data.quizType != '') {
        const payload = {
          notification: {
            title: 'Quiz Notification',
            body: `A New Quiz 📋has been started By instructor ${
              _data.instructor
            } !`,
          },
          topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
        };
        return await admin.messaging().send(payload);
      }
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });

exports.FeedbackNotification = functions.database
  .ref('InternalDb/Feedback/{id}') // Put your path here with the params.
  .onWrite(async (change, context) => {
    try {
      const {after} = change;
      const {_data} = after;
      const {_path} = after;
      console.log('------------------');
      console.log('function Feedback Notification executing');
      //console.log(_path);
      //console.log(after);
      console.log(context);
      console.log(_data.startTime);
      console.log(context.timestamp);
      console.log('------------------');
      var str1 = _data.startTime;

      str1 = str1.replace('/', '-');
      str1 = str1.replace('/', '-');

      var newdate = str1
        .split('-')
        .reverse()
        .join('-');
      console.log(newdate);
      var t = new Date(newdate);
      console.log(t);

      console.log(new Date().toString().split('GMT')[0] + ' UTC');

      //console.log(_data.passCode);
      //console.log(context);
      //console.log(after);

      if (!_data.emailResponse && _data.startTime != '') {
        const Noitfier = {
          notification: {
            title: 'FeedBack Notification',
            body: `A New FeedBack has been started by instructor ${
              _data.instructor
            } !`,
          },
          topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
        };
        return await admin.messaging().send(Noitfier);
      }
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });

exports.Annoucements = functions.database
  .ref('InternalDb/Announcements/{a_id}') // Put your path here with the params.
  .onWrite(async (change, context) => {
    try {
      const {after} = change;
      const {_data} = after;
      const {_path} = after;
      console.log('------------------');
      console.log('function Annoucement Notification executing');
      //console.log(_path);
      //console.log(after);
      console.log('------------------');

      //console.log(_data.passCode);
      //console.log(context);
      //console.log(after);

      const Announce = {
        notification: {
          title: `New Annoucement -> ${_data.heading}`,
          body: `${_data.description}`,
        },
        topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
      };
      return await admin.messaging().send(Announce);
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });
