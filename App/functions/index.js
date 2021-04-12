/* eslint-disable max-len */
/* eslint-disable eol-last */
/* eslint-disable no-var */
/* eslint-disable quotes */
/* eslint-disable indent */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// const url = 'https://testdb-cloudfn.firebaseio.com/'
const url = 'https://testfortls.firebaseio.com/'
// const url = 'https://tls-op-default-rtdb.firebaseio.com/'
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

async function getURLFromPasscode(passCode){
    const db_ref = admin.app().database(url).ref('InternalDb/Courses/');
    let courseURL;
    await db_ref.orderByChild("passCode").equalTo(passCode).once("value",
          function(snapshot) {
            courseURL = Object.keys(snapshot.val())[0].replace(' ', '');
          }, 
          function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          }
    );
    return courseURL
}

function deleteAllMatchingKey(table,key, childKey) {
    const db_ref = admin.app().database(url).ref('InternalDb/'+table+'/');
    db_ref.orderByChild(childKey).equalTo(key).once("value", function(snapshot) {
      console.log('starting to remove from table '+table)
      snapshot.forEach(function(child){
        console.log(child.key);
        child.ref.remove();
      });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);

    });

}

function deleteCourseHelper(passCode, courseURL){
    deleteAllMatchingKey('Courses',passCode, "passCode")
    deleteAllMatchingKey('Announcements',passCode, "passCode")
    deleteAllMatchingKey('KBC',passCode, "passCode")
    deleteAllMatchingKey('KBCResponse',passCode, "passCode")
    deleteAllMatchingKey('Feedback',passCode, "passCode")
    deleteAllMatchingKey('FeedbackResponse',passCode, "passCode")
    removeFromStudentList(courseURL);
    removeCourseFromFacultyList(courseURL);
}

exports.deleteCourse = functions.https.onCall(async (data,context) => {

  //  flow : 1. del announcements
  // 2. del student registerations ,faculty registrations
  // getting all announcements and deleting them
  const passCode = data.passCode;
  console.log("Got passCode to delete "+ passCode)
  let courseURL = await getURLFromPasscode(passCode);
  deleteCourseHelper(passCode, courseURL);
  context.send("Done deleting")
  return 'done';
});

function removeFromStudentList(courseKey){
  const student = admin.app().database(url).ref('InternalDb/Student/');
  student.once("value", function(snapshot){
    snapshot.forEach(el=>{
      let studentKey = el.ref.path.pieces_.reverse()[0];
      const thisStudent = admin.app().database(url).ref('InternalDb/Student/'+studentKey+'/courses');
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
  const student = admin.app().database(url).ref('InternalDb/Faculty/');
  student.once("value", function(snapshot){
    snapshot.forEach(el=>{
      let facultyKey = el.ref.path.pieces_.reverse()[0];
      const thisStudent = admin.app().database(url).ref('InternalDb/Faculty/'+facultyKey+'/courses');
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
  const faculty = admin.app().database(url).ref('InternalDb/Faculty/'+key+'/courses');
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

function deleteStudentHelper(studentID){
  deleteAllMatchingKey("KBCResponse", studentID, "userID");
  deleteAllMatchingKey("FeedbackResponse", studentID, "userID");
}

exports.deleteStudent = functions.https.onCall((data, context) =>{
  studentID = data.key;
  userUID = data.userUID;
  console.log("Student ID: " + studentID);
  console.log("Recieved data");
  console.log(data);
  console.log(context);
  dbRef = admin.app().database(url).ref('InternalDb/Student/' + studentID);
  dbRef.once("value", function(snapshot){
    if (snapshot.val()){
      deleteStudentHelper(studentID);
      snapshot.ref.remove();
      return "removed";
    }
    else{
      return "error while removing";
    }
  }, function (errorObject) {
    console.log("The student read failed: " + errorObject.code);
    return "Error";
  });
  admin
  .auth()
  .deleteUser(userUID)
  .then(() => {
    console.log('Successfully deleted user from firebase auth');
  })
  .catch((error) => {
    console.log('Error deleting user from firebase auth:', error);
  });
});

exports.deleteFaculty = functions.https.onCall((data,context) => {
  // key = data.body['key'];
  key = data.key;
  console.log("Faculty KEY "+ key )
  console.log("recieved data")
  console.log(data)
  console.log(context)
  db_ref = admin.app().database(url).ref('InternalDb/Faculty/'+key)
  db_ref.once("value", function(snapshot) 
  {
    console.log(snapshot.val());
    if(snapshot.val()['courses']){
    snapshot.val()['courses'].forEach(function(child)
    {
      console.log("Removing course of key " + child);
      course_ref = admin.app().database(url).ref('InternalDb/Courses/'+child)
      course_ref.once("value", 
        function(courseSnapshot){
            var passcode  = courseSnapshot.val()['passCode'];
            deleteCourseHelper(passcode, child);
          }
        ,
        function (errorObject) {
          console.log("The Course read failed: " + errorObject.code);
          // res.send("ERROR");
          return "Error";
        }
      );
    });
    delCoursesOfFaculty(key);
    snapshot.ref.remove();
    // res.send("removed");
    return "removed"
    }
    else{
      // res.send("error while removing");
      return "error while removing"
    }
  }, function (errorObject) {
    console.log("The faculty read failed: " + errorObject.code);
    // res.send("ERROR")
    return "Error";
  });
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


