/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable eol-last */
/* eslint-disable no-var */
/* eslint-disable quotes */
/* eslint-disable indent */

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require("nodemailer");
const moment = require('moment')
const url = 'https://testfortls.firebaseio.com/';
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "atlapp2021@gmail.com",
    pass: "Teaching2021!!",
  },
});

admin.initializeApp(functions.config().firebase);

async function getURLFromPasscode(passCode) {
    const db_ref = admin.app().database(url).ref('InternalDb/Courses/');
    let courseURL;
    await db_ref.orderByChild("passCode").equalTo(passCode).once("value",
          function(snapshot) {
            courseURL = Object.keys(snapshot.val())[0].replace(' ', '');
          },
          function(errorObject) {
            console.log("The read failed: " + errorObject.code);
          },
    );
    return courseURL;
}

async function getKBCURLFromPasscode(passCode) {
  const db_ref = admin.app().database(url).ref('InternalDb/KBC/');
  let courseURL;
  await db_ref.orderByChild("passCode").equalTo(passCode).once("value",
        function(snapshot) {
          courseURL = Object.keys(snapshot.val())[0].replace(' ', '');
        },
        function(errorObject) {
          console.log("The read failed: " + errorObject.code);
        },
  );
  return courseURL;
}


async function deleteAllMatchingKey(table, key, childKey) {
    const db_ref = admin.app().database(url).ref('InternalDb/'+table+'/');
    db_ref.orderByChild(childKey).equalTo(key).once("value", function(snapshot) {
      console.log('starting to remove from table '+table);
      snapshot.forEach(function(child) {
        console.log(child.key);
        child.ref.remove().then(()=>{
          console.log();
        });
      });
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }).then(()=>{
      console.log("Done");
    }).catch((error)=>{
      console.log(error);
    });
}
async function deleteCourseHelper(passCode, courseURL) {
    console.log("Starting remove from faculty list");
    removeCourseFromFacultyList(courseURL);
    console.log("Starting remove from student list");
    removeFromStudentList(courseURL);
    await deleteAllMatchingKey('Courses', passCode, "passCode");
    await deleteAllMatchingKey('Announcements', passCode, "passCode");
    await deleteAllMatchingKey('KBC', passCode, "passCode");
    await deleteAllMatchingKey('KBCResponse', passCode, "passCode");
    await deleteAllMatchingKey('Feedback', passCode, "passCode");
    await deleteAllMatchingKey('FeedbackResponse', passCode, "passCode");
}
function removeFromStudentList(courseKey) {
  const student = admin.app().database(url).ref('InternalDb/Student/');
  student.once("value", function(snapshot) {
    snapshot.forEach((el)=>{
      const studentKey = el.ref.path.pieces_.reverse()[0];
      const thisStudent = admin.app().database(url).ref('InternalDb/Student/'+studentKey+'/courses');
      thisStudent.once("value", function(snapshot) {
        snapshot.forEach((el)=>{
          if (el.val() === courseKey) {
            el.ref.remove().then(()=>{
              console.log();
            });
          }
        });
      }).then(()=>{
        console.log();
      });
    });
  }).then(()=>{
    console.log();
  });
}
function removeCourseFromFacultyList(courseKey) {
  const student = admin.app().database(url).ref('InternalDb/Faculty/');
  student.once("value", function(snapshot) {
    snapshot.forEach((el)=>{
      const facultyKey = el.ref.path.pieces_.reverse()[0];
      const thisStudent = admin.app().database(url).ref('InternalDb/Faculty/'+facultyKey+'/courses');
      thisStudent.once("value", function(snapshot) {
        snapshot.forEach((el)=>{
          if (el.val() === courseKey) {
            el.ref.remove().then(()=>{
              console.log();
            });
          }
        });
      }).then(()=>{
        console.log();
      });
    });
  }).then(()=>{
    console.log();
  });
}
function removeFromFacultyList(key) {
  const faculty = admin.app().database(url).ref('InternalDb/Faculty/'+key+'/courses');
  faculty.once("value", function(snapshot) {
    snapshot.forEach((el)=>{
      removeFromStudentList(el.val());
      el.ref.remove().then(()=>{
        console.log();
      });
    });
  }).then(()=>{
    console.log();
  });
}
function delCoursesOfFaculty(facultyKey) {
  removeFromFacultyList(facultyKey);
}
function deleteStudentHelper(studentID) {
  deleteAllMatchingKey("KBCResponse", studentID, "userID");
  deleteAllMatchingKey("FeedbackResponse", studentID, "userID");
}
function autoGrader(studentAnswer,correctAnswer,type){
  if (!type === "numerical"){
      studentAnswer = studentAnswer.replace(/,/g,"")
      if(studentAnswer===correctAnswer)
          return 1;
      else
          return 0;
  }
  else{
      studentAnswer = studentAnswer.trim().toUpperCase().replace(/,/g,"")
      correctAnswer = correctAnswer.trim().toUpperCase().replace(/,/g,"")
                  
      if(studentAnswer===correctAnswer)
          return 1;
      else if(!studentAnswer.search(correctAnswer)===-1)
          return 1;
      else
          return 0;
  }
}
async function getAllStudentsforMail(passCode, startTime, endTime){

  let myurl = null
  console.log(passCode)
  await admin.app().database(url)
      .ref('InternalDb/Courses/')
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value')
      .then(snapshot => {myurl = Object.keys(snapshot.val())[0].replace(' ', '')})

  let vlist = null
  await admin.app().database(url)
      .ref('InternalDb/Student/')
      .once('value')
      .then(snapshot => {
          const list = []
          snapshot.forEach( (data) => {
              const keys = Object(data.val())
              const x = data.key
              if ("verified" in keys){
                  const arr = data.val()["verified"]
                  if (arr.includes(myurl)){
                      list.push(x)
                  }
              }
          })
          vlist = list
      })
  
  console.log("Collecting: 1")

  let ans = null
  let attempted = null

  await admin.app().database(url).ref('InternalDb/KBCResponse/')
      .orderByChild("passCode")
      .equalTo(passCode)
      .once('value')
      .then(snapshot => {
          const a = {}
          const b = []
          snapshot.forEach( (data) => {
              const keys = Object(data.val())
              const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
              const temp1 = moment(keys["timestamp"], "DD/MM/YYYY HH:mm:ss")
              const temp2 = moment(endTime, "DD/MM/YYYY HH:mm:ss")

              if (temp1<=temp2 && temp1>=temp){
                  let answer = keys['answer'].trim().toUpperCase()
                  let email = keys['userName']
                  let ID = keys['userID']
                  let name = keys['name']===undefined? "N/A": keys["name"]
                  const val={"Name":name,"Email":email,"Answer":answer}
                  if (vlist.includes(ID)){
                  a[ID]=val
                  b.push(ID)
                  }
              }
          })
          ans = a
          attempted = b
      })

  console.log("Collecting: 2")

  let final = null
  await admin.app().database(url)
      .ref('InternalDb/Student/')
      .once('value')
      .then(snapshot => {
          const list = []
          snapshot.forEach( (data) => {
              const x = data.key
              const keys = Object(data.val())
              if (vlist.includes(x)){
                  if (attempted.includes(x)){
                      list.push(ans[x])
                  }
                  else
                  {
                      let name = keys['name']
                      let email = keys['email']
                      let answer = "N/A"
                      const val={"Name":name,"Email":email,"Answer":answer}
                      list.push(val)
                  }

              }
          })
          final = list
      })

  console.log("Collecting: 3")

  return final
}
async function studentsResponseCsvMailer(list,answer,type,passCode,quizNumber,time,email){
  
  console.log("Grading: 0")
  const correctAnswer = answer === "*" ? 'N/A' : answer.trim().toUpperCase().replace(/,/g,"");
  max = answer==="*"?'N/A':1
  const date = time.replace(/\//g,"-").split(" ")[0]
  const fileName = passCode+"_"+date+"_"+"Quiz-"+quizNumber
  await list.sort((a,b) =>a.Email > b.Email? 1: b.Email > a.Email? -1: 0);
  const path = `${fileName}.csv`;
  console.log("Grading: 1")
  const aboutQuiz =  `${"QUIZ #"+quizNumber},${date},${"Correct Answer : "+correctAnswer},${"Max Score : "+max}\n\n`
  const headerString = 'Student Name, Email, Response, Score\n';
  const rowString = await list.map((student,i) =>`${student.Name},${student.Email},${student.Answer.replace(/,/g,"")},${answer === "*" ? 'N/A': autoGrader(student.Answer,correctAnswer,type)}\n`).join('');
  const csvString = `${aboutQuiz}${headerString}${rowString}`;
  console.log("Grading: 2")

  try {
    await transporter.sendMail(
      {
      from: "atlapp2021@gmail.com",
      to: email,
      subject: "Quiz Responses",
      text: "Ola! Please check the attachment.",
      html: "<b>PFA Quiz Responses</b>",
       // here is the magic
      attachments: [
        {
          filename: path,
          content: csvString,
        },
      ],
    },);
    console.log("Grading: 3")
    return "Mail sent"
  } catch(error) {
    functions.logger.error('There was an error while sending the email:',error);
    return "Error"
  }
}

exports.deleteCourse = functions.https.onCall(async (data, context) => {
  const passCode = data.passCode;
  console.log("Got passCode to delete "+ passCode);
  const courseURL = await getURLFromPasscode(passCode);
  await deleteCourseHelper(passCode, courseURL);
  return 'done';
});

exports.deleteStudent = functions.https.onCall((data, context) =>{
  studentID = data.key;
  userUID = data.userUID;
  console.log("Student ID: " + studentID);
  console.log("Recieved data");
  console.log(data);
  console.log(context);
  dbRef = admin.app().database(url).ref('InternalDb/Student/' + studentID);
  dbRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      deleteStudentHelper(studentID);
      snapshot.ref.remove().then(()=>{
        console.log();
      });
      return "removed";
    } else {
      return "error while removing";
    }
  }, function(errorObject) {
    console.log("The student read failed: " + errorObject.code);
    return "Error";
  }).then(()=>{
    console.log();
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

exports.deleteFaculty = functions.https.onCall((data, context) => {
  const key = data.key;
  const userUID = data.uid;
  console.log("Faculty KEY "+ key );
  console.log("recieved data");
  console.log(data);
  console.log(context);
  db_ref = admin.app().database(url).ref('InternalDb/Faculty/'+key);
  db_ref.once("value", function(snapshot) {
    console.log(snapshot.val());
    if (snapshot.val()['courses']) {
    snapshot.val()['courses'].forEach(function(child) {
      console.log("Removing course of key " + child);
      course_ref = admin.app().database(url).ref('InternalDb/Courses/'+child);
      course_ref.once("value",
        function(courseSnapshot) {
            if (courseSnapshot.val()) {
              var passcode = courseSnapshot.val()['passCode'];
              deleteCourseHelper(passcode, child);
            }
          }
        ,
        function(errorObject) {
          console.log("The Course read failed: " + errorObject.code);
          return "Error";
        },
      ).then(()=>{
        console.log();
      });
    });
    delCoursesOfFaculty(key);
    snapshot.ref.remove().then(()=>{
      console.log();
    });
    context.send("removed");
    return "removed";
    } else {
      return "error while removing";
    }
  }, function(errorObject) {
    console.log("The faculty read failed: " + errorObject.code);
    return "Error";
  }).then(()=>{
    console.log();
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

exports.quizNotification  = functions.database
  .ref('InternalDb/KBC/{qid}') // Put your path here with the params.
  .onWrite(async (change, context) => {
    try {
      const {after} = change;
      const {_data} = after;
      const {_path} = after;
      console.log('function Quiz Notification executing');
      if (!_data.emailResponse && _data.quizType != '') {
        const payload = {
          notification: {
            title: 'Quiz',
            body: `A new quiz has been started by instructor ${_data.instructor} !`,
          },
          topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
        };
        return await admin.messaging().send(payload);
      }
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });

exports.feedbackNotification  = functions.database
  .ref('InternalDb/Feedback/{id}') // Put your path here with the params.
  .onWrite(async (change, context) => {
    try {
      const {after} = change;
      const {_data} = after;
      const {_path} = after;
      console.log('function Feedback Notification executing');
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

      if (!_data.emailResponse && _data.startTime != '') {
        const Noitfier = {
          notification: {
            title: 'FeedBack',
            body: `A new feedBack form has been posted by instructor ${_data.instructor} !`,
          },
          topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
        };
        return await admin.messaging().send(Noitfier);
      }
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });

exports.announcementsNotification  = functions.database
  .ref('InternalDb/Announcements/{a_id}') // Put your path here with the params.
  .onWrite(async (change, context) => {
    try {
      const {after} = change;
      const {_data} = after;
      const {_path} = after;
      console.log('function Announcement Notification executing');
      const Announce = {
        notification: {
          title: `${_data.heading}`,
          body: `${_data.description}`,
        },
        topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
      };
      return await admin.messaging().send(Announce);
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });

exports.quizResponses = functions.https.onCall(async (data,context) => {
  passCode = data.passCode
  courseurl = await getKBCURLFromPasscode(passCode)
  console.log('Mail Function Started')
  return admin.app().database(url)
    .ref("InternalDb/KBC/"+courseurl)
    .once('value')
    .then(snapshot => {
      console.log(data.passCode)
      value = snapshot.val()
      console.log("Collecting List")
      return getAllStudentsforMail(passCode,value['startTime'],value['endTime']).then(
        data => {
          console.log("List : Done")
          return studentsResponseCsvMailer(data,value['correctAnswer'],value['quizType'],value['passCode'],value['questionCount'],value['startTime'],value['instructor'])
        })
      })
    .catch((error)=>{console.log(error)})
});
