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
function deleteAllMatchingKey(table,key) {
    const db_ref = admin.database().ref('InternalDb/'+table+'/');
    db_ref.orderByChild("passCode").equalTo(key).once("value", function(snapshot) {
      console.log('starting to remove from table '+table)
      snapshot.forEach(function(child){
        console.log(child.key);
        child.ref.remove();
      });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      res.send("ERROR")
    });

}
function deleteCourseHelper(passCode){
    deleteAllMatchingKey('Courses',passCode)
    deleteAllMatchingKey('Announcements',passCode)
    deleteAllMatchingKey('KBC',passCode)
    deleteAllMatchingKey('KBCResponse',passCode)
    deleteAllMatchingKey('Feedback',passCode)
    deleteAllMatchingKey('FeedbackResponse',passCode)
    removeFromStudentList(passCode)
    removeCourseFromFacultyList(passCode)
}

exports.deleteCourse = functions.https.onRequest((req,res) => {

//  flow : 1. del announcements
// 2. del student registerations ,faculty registrations
// getting all announcements and deleting them
const passCode = req.body['passCode'];
console.log("Got passCode to delete "+ passCode)
deleteCourseHelper(passCode);
res.send("Done deleting")
});


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


