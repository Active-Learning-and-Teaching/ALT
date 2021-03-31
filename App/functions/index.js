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

    const response = await admin.messaging().send(message);
    console.log(response);
  });

exports.sendPushNotification = functions.database
  .ref('InternalDb/Student/{sid}') // Put your path here with the params.
  .onWrite(async (change, context) => {
    try {
      const {after} = change;
      const {_data} = after;
      const {deviceToken} = _data.receiver; // Always send the device token within the data entry.
      console.log('Yo');

      if (!deviceToken) return;

      const payload = {
        notification: {
          title: 'Notification',
          body: `FCM notification triggered!`,
        },
        data: context.params, // Passing the path params along with the notification to the device. [optional]
      };

      return await admin.messaging().sendToDevice(deviceToken, payload);
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });
