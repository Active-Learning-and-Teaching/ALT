/* eslint-disable max-len */
/* eslint-disable eol-last */
/* eslint-disable no-var */
/* eslint-disable quotes */
/* eslint-disable indent */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.sendNotificationToTopic_New = functions.firestore
  .document('Course/{uid}')
  .onWrite(async (event) => {
    // let docID = event.after.id;
    const title = event.after.get('title');
    const content = event.after.get('content');
    var message = {
      notification: {
        title: title,
        body: content,
      },
      topic: 'Course',
    };

    console.log(message);
    const response = await admin.messaging().send(message);
    console.log(response);
  });