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

function removeFromStudentList(courseKey){
  const student = admin.database().ref('InternalDb/Student/');
  student.once("value", function(snapshot){
    snapshot.forEach(el=>{
      let studentKey = el.ref.path.pieces_.reverse()[0];
      const thisStudent = admin.database().ref('InternalDb/Student/'+studentKey+'/courses');
      thisStudent.once("value", function(snapshot){
        snapshot.forEach((el)=>{
          if(el.val() === courseKey){
            el.ref.remove();
          }
        })
      })
    })
  })
}
function removeCourseFromFacultyList(courseKey){
  const student = admin.database().ref('InternalDb/Faculty/');
  student.once("value", function(snapshot){
    snapshot.forEach(el=>{
      let facultyKey = el.ref.path.pieces_.reverse()[0];
      const thisStudent = admin.database().ref('InternalDb/Faculty/'+facultyKey+'/courses');
      thisStudent.once("value", function(snapshot){
        snapshot.forEach((el)=>{
          if(el.val() === courseKey){
            el.ref.remove();
          }
        })
      })
    })
  })
}

function removeFromFacultyList(key){
  const faculty = admin.database().ref('InternalDb/Faculty/'+key+'/courses');
  faculty.once("value", function(snapshot){
    snapshot.forEach((el)=>{
      removeFromStudentList(el.val())
      el.ref.remove();
    })
  })
}

function delCoursesOfFaculty(facultyKey){
  console.log("Called");
  removeFromFacultyList(facultyKey);
}

exports.deleteFaculty = functions.https.onRequest((req,res) => {
key = req.body['key'];
console.log("Faculty KEY "+ key )
db_ref = admin.database().ref('InternalDb/Faculty/'+key)
db_ref.once("value", function(snapshot) 
{
  console.log(snapshot.val());
  if(snapshot.val()['courses']){
  snapshot.val()['courses'].forEach(function(child)
  {
    console.log("Removing course of key " + child);
    course_ref = admin.database().ref('InternalDb/Courses/'+child)
    course_ref.once("value", 
      function(courseSnapshot){
          var passcode  = courseSnapshot.val()['passCode'];
          deleteCourseHelper(passcode);
        }
      ,
      function (errorObject) {
        console.log("The Course read failed: " + errorObject.code);
        res.send("ERROR");
      }
    );
  });
  delCoursesOfFaculty(key);
  snapshot.ref.remove();
  res.send("removed");
  }
  else{
    res.send("error while removing");
  }
}, function (errorObject) {
  console.log("The faculty read failed: " + errorObject.code);
  res.send("ERROR")
});
}
);


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


