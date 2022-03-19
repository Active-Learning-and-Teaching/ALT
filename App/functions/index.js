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
const nodemailer = require('nodemailer');
const moment = require('moment');
const url = 'https://alt-development-42a78-default-rtdb.firebaseio.com/';

const transporter = nodemailer.createTransport({
  host: functions.config().mailingsystem.host,
  auth: {
    user: functions.config().mailingsystem.email,
    pass: functions.config().mailingsystem.password,
  },
});

admin.initializeApp(functions.config().firebase);

function emailTemplate(
  courseName,
  date,
  results,
  type,
  quizCount,
  feedbackCount,
) {
  console.log("Results: ", results);
  if (type === 'Feedback1') {
    avg_points = 0;
    sum = 0;
    n = 0;
    for (let i = 1; i < 6; i++) {
      sum += results[i] * i;
      n += results[i];
    }
    avg_points = sum / n;
  }
  return type === 'Feedback0'
    ? `
          <html>
          <body>
          <div>
              <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                  
                  Following are the results of Colour Scale Feedback conducted on ${date} for the course ${courseName}.
                  <br/> 
                  <br/>        
              </p>
              <img src="https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20%20%20type%3A%20%27pie%27%2C%0A%20%20%20%20data%3A%20%7B%0A%20%20%20%20%20%20%20%20labels%3A%20%5B%27${results[0]}%20Green%27%2C%20%27${results[1]}%20Yellow%27%2C%20%27${results[2]}%20Red%27%5D%2C%0A%20%20%20%20%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%5B${results[0]}%2C%20${results[1]}%2C%20${results[2]}%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20backgroundColor%3A%20%5B%27green%27%2C%20%27yellow%27%2C%20%27red%27%5D%0A%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%7D%2C%0A%20%20%20%20options%3A%20%7B%0A%20%20%20%20%20%20%20%20legend%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20position%3A%20%27right%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20align%3A%20%27start%27%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20plugins%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20datalabels%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%27black%27%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20doughnutlabel%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20labels%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20text%3A%20%27Donut%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20size%3A%2020%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" height=40% width = 40%/>
              <br/>
              <br/>
              <p>
                  Regards,
                  <br/>
                  Team ALT
              </p> 
      </div>  
      </body>
      </html> 
          `
    : type === 'Feedback1'
      ? `
          <html>
          <body>
          <div>
              <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                  
                  Following are the results of Likert Scale Feedback conducted on ${date} for the course ${courseName}. The average response was ${avg_points}.
                  <br/> 
                  <br/>        
              </p>
              <img src="https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20%20%20type%3A%20%27pie%27%2C%0A%20%20%20%20data%3A%20%7B%0A%20%20%20%20%20%20%20%20labels%3A%20%5B%27${results[1]}%20o%27%2C%20%27${results[2]}%20oo%27%2C%20%27${results[3]}%20ooo%27%2C%20%27${results[4]}%20oooo%27%2C%20%27${results[5]}%20ooooo%27%5D%2C%0A%20%20%20%20%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%5B${results[1]}%2C%20${results[2]}%2C%20${results[3]}%2C%20${results[4]}%2C%20${results[5]}%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20backgroundColor%3A%20%5B%27%23F3460A%27%2C%20%27orange%27%2C%20%27pink%27%2C%20%27skyblue%27%2C%20%27%2360CA24%27%5D%0A%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%7D%2C%0A%20%20%20%20options%3A%20%7B%0A%20%20%20%20%20%20%20%20legend%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20position%3A%20%27right%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20align%3A%20%27start%27%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20plugins%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20datalabels%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%27black%27%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20doughnutlabel%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20labels%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20text%3A%20%27Donut%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20size%3A%2020%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" height=40% width = 40%/>
          <br/><br/><br/><br/>
          <p>
              Regards,
              <br/>
              Team ALT
          </p> 
      </div>  
      </body>
      </html> 
          `
      : type === 'Feedback2'
        ? `
    <html>
    <body>
    <div>
        <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
              
            Following are the results of Minute Paper Feedback conducted on ${date} for the course ${courseName}.
            <br/> 
            <br/>

        </p>
        <div style = "font-family:Arial, Helvetica, sans-serif; text-align:left;">
          <h4> Question 1 : What are the three most important things that you learnt? </h4> <br/>
            ${results[0][0]} <br/>
            ${results[0][1]} <br/>
            ${results[0][2]} <br/>
          <h4> Question 2 : What are the things that remain doubtful? </h4> <br/>
            ${results[1][0]} <br/>
            ${results[1][1]} <br/>
            ${results[1][2]} <br/>
        </div>
    </div>	
    </body>
    </html>
    `
        : type === 'mcq'
          ? `
      <html>
      <body>
      <div>
          <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                
              Following are the results of ${type} Quiz conducted on ${date} for the course ${courseName}.
              <br/> 
              <br/>        
              <img src="https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20%20%20type%3A%20%27pie%27%2C%0A%20%20%20%20data%3A%20%7B%0A%20%20%20%20%20%20%20%20labels%3A%20%5B%27${results['A']}%20A%27%2C%20%27${results['B']}%20B%27%2C%20%27${results['C']}%20C%27%2C%27${results['D']}%20D%27%5D%2C%0A%20%20%20%20%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%5B${results['A']}%2C%20${results['B']}%2C%20${results['C']}%2C%20${results['D']}%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20backgroundColor%3A%20%5B%27%234d89f9%27%2C%20%27%2300b88a%27%2C%20%27%23ff9f40%27%2C%27%23ff6384%27%5D%0A%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%7D%2C%0A%20%20%20%20options%3A%20%7B%0A%20%20%20%20%20%20%20%20legend%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20position%3A%20%27right%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20align%3A%20%27start%27%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20plugins%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20datalabels%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%27%23fff%27%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20doughnutlabel%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20labels%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20text%3A%20%27Donut%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20size%3A%2020%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" height=50% width = 50%>
          </p>
          <br/><br/><br/><br/>
          PFA. The CSV of answers submitted by the students.
          <br/> 
          <br/>
          <p>
              Regards,
              <br/>
              Team ALT   
      </div>  
      </body>
      </html>
      `
          : type === 'alphaNumerical' || type === 'multicorrect' || type === 'numeric'
            ? `
      <html>
          <head>
          <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
          }
          .column{
           padding-left: 10%;
           padding-right: 10%;
           margin: 3%;
          }
          .card {
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            padding: 16px;
            text-align: center;
            background-color: #f1f1f1;
          }
          </style>
          </head>
          <body>
          <div>
          <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                 
              Following are the results of ${type} Quiz conducted on ${date} for the course ${courseName}.
              <br/> 
              <br/>
          </p>
          <div>
              ${Object.entries(results).map(
              (value, i) =>
                `
                  <div class="column">
                      <div class="card">
                        <h3>${i + 1}. Answer- ${value[0]}</h3>
                        <p>${value[1]} Students</p>
                      </div>
                  </div> 
                  <br/> 
              `,
            )}
          </div>
          <br/><br/><br/><br/>
          PFA. The CSV of answers submitted by the students.
          <br/> 
          <br/>
          <p>
              Regards,
              <br/>
              Team ALT
          </p>    
      </div>
      </body>
      </html>
      `
            : type === 'StudentList'
              ? `
      <html>
      <head>
      </head>
      <body>
          <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                  <br/> 
                  PFA. List of Students registered for course ${courseName}
                  <br/> 
                  <br/>
          </p>     
          <br/><br/><br/><br/>
          <p>
              Regards,
              <br/>
              Team ALT
          </p>    
      </body>
      </html>
      `
              : type === 'Course'
                ? `
        <html>
        <head>
        </head>
        <body>
            <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                    Following are the details of the course ${courseName} :-
                    <br/>
                    <br/>
                    The course passcode on the app - ${passCode}
                    <br/>
                    Total Number of Quizzes - ${quizCount}
                    <br/>
                    Total Number of Feedbacks - ${feedbackCount}
                    <br/>
                    <br/>
                    <br/>
                    PFA. List of Students registered, List of Announcements made
                    <br/> 
                    <br/>
            </p>     
            <br/><br/><br/><br/>
            <p>
                Regards,
                <br/>
                Team ALT
            </p>    
        </body>
        </html>
        `
                : '';
}

async function getURLFromPasscode(passCode) {
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Courses/');
  let snapshots;
  let courseURL;
  try {
    snapshots = await db_ref
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value');
    snapshots.forEach(snapshot => {
      courseURL = snapshot.key;
    });
    if (snapshots.numChildren() == 0) {
      throw 'No courses with passcode: ' + passCode;
    }
    console.log('Inside getURLFromPasscode: ', courseURL);
  } catch (errorObject) {
    console.log('The read in getURLFromPasscode failed: ', errorObject);
  }
  return courseURL;
}
async function getEmailFromPasscode(passCode, type) {
  let myurl = await getURLFromPasscode(passCode);
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Courses/' + myurl);
  let primary = '';
  let quiz = '';
  let feedback = '';
  let snapshot;
  try {
    snapshot = await db_ref.once('value');
    const course = snapshot.val();
    if ('quizEmail' in course) {
      quiz = course['quizEmail'];
    }
    if ('feedbackEmail' in course) {
      feedback = course['feedbackEmail'];
    }
  } catch (errorObject) {
    console.log('The read in getEmailFromPasscode failed: ', errorObject);
  }

  await admin
    .app()
    .database(url)
    .ref('InternalDb/Faculty/')
    .orderByChild('courses')
    .once('value', snapshot => {
      snapshot.forEach(data => {
        const keys = Object(data.val());
        if ('courses' in keys) {
          const arr = data.val()['courses'];
          if (arr.includes(myurl)) {
            primary = data.val()['email'];
          }
        }
      });
    });

  if (type === 'Quiz') {
    if (quiz !== '') {
      return quiz;
    } else {
      return primary;
    }
  } else if (type === 'Feedback') {
    if (feedback !== '') {
      return feedback;
    } else {
      return primary;
    }
  } else {
    return primary;
  }
}
async function getCourseNameFromPasscode(passCode) {
  let myurl = await getURLFromPasscode(passCode);
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Courses/' + myurl);
  let courseName;
  await db_ref.once(
    'value',
    function (snapshot) {
      courseName = snapshot.val()['courseName'];
    },
    function (errorObject) {
      console.log('The read failed: ', errorObject);
    },
  );
  return courseName;
}
async function getKBCURLFromPasscode(passCode) {
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/KBC/');
  let courseURL;
  await db_ref
    .orderByChild('passCode')
    .equalTo(passCode)
    .once(
      'value',
      function (snapshot) {
        courseURL = Object.keys(snapshot.val())[0].replace(' ', '');
      },
      function (errorObject) {
        console.log('The read failed: ', errorObject);
      },
    );
  return courseURL;
}
async function getAllAnnouncement(passCode) {
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Announcements/');
  let ans = '';
  await db_ref
    .orderByChild('passCode')
    .equalTo(passCode)
    .once('value')
    .then(snapshot => {
      if (snapshot.val()) {
        const list = [];
        snapshot.forEach(data => {
          const keys = Object(data.val());
          const dict = {};
          dict['date'] = keys['date'];
          dict['description'] = keys['description'];
          dict['heading'] = keys['heading'];
          list.push(dict);
          list.sort(function (a, b) {
            const keyA = moment(a['date'], 'DD/MM/YYYY HH:mm:ss');
            const keyB = moment(b['date'], 'DD/MM/YYYY HH:mm:ss');
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          ans = list;
        });
      }
    });
  if (ans.length === 0) {
    return '-1';
  } else {
    return ans;
  }
}
function autoGrader(studentAnswer, correctAnswer, errorRate, type) {
  if (type === 'alphaNumerical') {
    studentAnswer = studentAnswer
      .trim()
      .toUpperCase()
      .replace(/,/g, '');
    correctAnswer = correctAnswer
      .trim()
      .toUpperCase()
      .replace(/,/g, '');

    if (studentAnswer === correctAnswer) return 1;
    else if (!(studentAnswer.search(correctAnswer) === -1)) return 1;
    else return 0;
  } else if (type === 'numeric') {
    studentAnswer = parseFloat(studentAnswer.trim().replace(/,/g, ''));
    correctAnswer = parseFloat(correctAnswer.trim().replace(/,/g, ''));
    errorRate = parseFloat(errorRate.trim().replace(/,/g, ''));
    if (
      studentAnswer >= correctAnswer - errorRate &&
      studentAnswer <= correctAnswer + errorRate
    ) {
      return 1;
    } else {
      return 0;
    }
  } else {
    studentAnswer = studentAnswer.replace(/,/g, '');
    if (studentAnswer === correctAnswer) return 1;
    else return 0;
  }
}
async function getQuizCount(passCode) {
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/KBC/');
  let ans = null;
  await db_ref
    .orderByChild('passCode')
    .equalTo(passCode)
    .once('value')
    .then(snapshot => {
      if (snapshot.val()) {
        const keys = Object.values(snapshot.val());
        ans = keys[0];
      }
    });
  let count = ans === null ? '0' : ans['questionCount'];
  return count;
}
async function getQuizResponse(passCode, startTime, endTime, type) {
  let ans = null;
  await admin
    .app()
    .database(url)
    .ref('InternalDb/KBCResponse/')
    .orderByChild('passCode')
    .equalTo(passCode)
    .once('value')
    .then(snapshot => {
      const dict = {};
      const list = { A: 0, B: 0, C: 0, D: 0 };
      snapshot.forEach(data => {
        const keys = Object(data.val());
        const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
        const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
        const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');

        if (temp1 <= temp2 && temp1 >= temp) {
          if (type === 'mcq') {
            list[keys['answer']] += 1;
          } else {
            let answer = keys['answer']
              .trim()
              .toUpperCase()
              .replace(/,/g, '');
            if (answer in dict) {
              dict[answer] += 1;
            } else {
              dict[answer] = 1;
            }
          }
        }
      });
      if (type === 'mcq') {
        ans = list;
      } else {
        ans = dict;
      }
    });
  console.log('All Responses Collected');
  return ans;
}
async function QuizResponseMailer(
  list,
  answer,
  errorRate,
  type,
  passCode,
  quizNumber,
  startTime,
  endTime,
  email,
) {

  const correctAnswer =
    answer === '*'
      ? 'N/A'
      : answer
        .trim()
        .toUpperCase()
        .replace(/,/g, '');
  errorRate =
    (errorRate === '*') | (errorRate == '')
      ? 'N/A'
      : errorRate.trim().replace(/,/g, '');
  max = answer === '*' ? 'N/A' : 1;
  const date = startTime.replace(/\//g, '-').split(' ')[0];
  const fileName = passCode + '_' + date + '_' + 'Quiz-' + quizNumber;
  await list.sort((a, b) =>
    a.Email > b.Email ? 1 : b.Email > a.Email ? -1 : 0,
  );
  const path = `${fileName}.csv`;
  const aboutQuiz = `${'QUIZ #' + quizNumber},${date},${'Correct Answer : ' +
    correctAnswer},${'Max Score : ' + max}\n\n`;
  const headerString = 'Student Name, Email, Response, Score\n';
  const rowString = await list
    .map(
      (student, i) =>
        `${student.Name},${student.Email},${student.Answer.replace(/,/g, '')},${answer === '*'
          ? 'N/A'
          : autoGrader(student.Answer, correctAnswer, errorRate, type)
        }\n`,
    )
    .join('');
  const csvString = `${aboutQuiz}${headerString}${rowString}`;
  let results = null;
  let courseName = null;
  await getQuizResponse(passCode, startTime, endTime, type).then(
    async value => {
      results = value;
    },
  );
  await getCourseNameFromPasscode(passCode).then(async value => {
    courseName = value;
  });
  try {
    await transporter.sendMail({
      from: 'atlapp2021@gmail.com',
      to: email,
      subject: 'Quiz Responses : ' + courseName,
      text: '',
      html: emailTemplate(courseName, date, results, type, 0, 0),
      attachments: [
        {
          filename: path,
          content: csvString,
        },
      ],
    });
    return 'Mail sent';
  } catch (error) {
    functions.logger.error(
      'There was an error while sending the email:',
      error,
    );
    return 'Error';
  }
}
async function getAllStudentsforMail(passCode, startTime, endTime) {
  let vlist = null;
  let verifiedStudentList = null;
  let studentList = await getStudents(passCode);
  verifiedStudentList = studentList
  vlist = verifiedStudentList.map(student => {
    return student['key'];
  });

  let ans = null;
  let attempted = null;

  await admin
    .app()
    .database(url)
    .ref('InternalDb/KBCResponse/')
    .orderByChild('passCode')
    .equalTo(passCode)
    .once('value')
    .then(snapshot => {
      const a = {};
      const b = [];
      snapshot.forEach(data => {
        const keys = Object(data.val());
        const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
        const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
        const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');

        if (temp1 <= temp2 && temp1 >= temp) {
          let answer = keys['answer'].trim().toUpperCase();
          let email = keys['userName'];
          let ID = keys['userID'];
          let name = keys['name'] === undefined ? 'N/A' : keys['name'];
          const val = { Name: name, Email: email, Answer: answer,responseTime : temp1-temp };
          // if (vlist.includes(ID)) {
          a[ID] = val;
          b.push(ID);
          // }
          console.log(val)
        }
      });
      ans = a;
      attempted = b;
    });

  let final = [];
  console.log("Attempted", attempted)
  verifiedStudentList.forEach(student => {
    if (attempted.includes(student['key'])) {
      final.push(ans[student['key']]);
    } else {
      const val = {
        Name: student['name'],
        Email: student['email'],
        Answer: 'N/A',
        responseTime:0
      };
      final.push(val);
    }
  });
  console.log(final)
  return final;
}
async function getFeedbackCount(passCode) {
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Feedback/');
  let ans = null;
  await db_ref
    .orderByChild('passCode')
    .equalTo(passCode)
    .once('value')
    .then(snapshot => {
      if (snapshot.val()) {
        const keys = Object.values(snapshot.val());
        ans = keys[0];
      }
    });
  let count = ans === null ? '0' : ans['feedbackCount'];
  return count;
}
async function getFeedbackResponse(passCode, startTime, endTime, type) {
  let ans = null;
  if (type === '2') {
    await admin
      .app()
      .database(url)
      .ref('InternalDb/Feedback/')
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value')
      .then(async snapshot => {
        if (snapshot.val()) {
          const keys = Object.values(snapshot.val())[0];
          ans = keys['summary'];
        }
      });
  } else {
    await admin
      .app()
      .database(url)
      .ref('InternalDb/FeedbackResponse/')
      .orderByChild('passCode')
      .equalTo(passCode)
      .once('value')
      .then(async snapshot => {
        let list = {};
        if (type === '0') list = { 0: 0, 1: 0, 2: 0 };
        else if (type === '1') list = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        else list = [];

        snapshot.forEach(data => {
          const keys = Object(data.val());
          const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');

          // if (temp1 <= temp2 && temp1 >= temp) {
          //   list[keys['responses']] += 1;
          // }
          if (type == '0' || type == '1') {
            if (temp1 <= temp2 && temp1 >= temp) {
              list[keys['responses']] += 1;
            }
          } else {
            list.push(keys['responses']);
          }
        });
        ans = list;
        // console.log(ans);
      });
  }
  return ans;
}
async function getFeedbackCSV(passCode, startTime, endTime) {
  let list = [];
  await admin
    .app()
    .database(url)
    .ref('InternalDb/FeedbackResponse/')
    .orderByChild('passCode')
    .equalTo(passCode)
    .once('value')
    .then(async snapshot => {
      if (snapshot.val()) {
        snapshot.forEach(data => {
          const keys = Object(data.val());
          const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');
          // generate csv file for feedback responses between start and end time
          if (temp1 <= temp2 && temp1 >= temp) {
            list.push(keys['responses']);
          }
        });
      }
    });
  let csvHeader = 'Sr. No., Question, Response1, Response2, Response3\n';
  let csvString = list.map((response, i) => `${i + 1},1,${response[0][0].replace(/,/g,' ').replace(/\n/g,' ')},${response[0][1].replace(/,/g,' ').replace(/\n/g,' ')},${response[0][2].replace(/,/g,' ').replace(/\n/g,' ')}\n${i + 1},2,${response[1][0].replace(/,/g,' ').replace(/\n/g,' ')},${response[1][1].replace(/,/g,' ').replace(/\n/g,' ')},${response[1][2].replace(/,/g,' ').replace(/\n/g,' ')}\n`).join('');
  let csvContent = `${csvHeader}${csvString}`;
  console.log(csvContent);
  return csvContent;
}
async function getFBURLFromPasscode(passCode) {
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Feedback/');
  let courseURL;
  await db_ref
    .orderByChild('passCode')
    .equalTo(passCode)
    .once(
      'value',
      function (snapshot) {
        courseURL = Object.keys(snapshot.val())[0].replace(' ', '');
      },
      function (errorObject) {
        console.log('The read failed: ', errorObject);
      },
    );
  return courseURL;
}
async function FeedbackResponseMailer(
  results,
  passCode,
  startTime,
  endTime,
  type,
  email,
) {
  const courseName = await getCourseNameFromPasscode(passCode);
  const date = startTime.replace(/\//g, '-').split(' ')[0];

  try {

    if (type == 'Feedback2') {
      const csvContent = await getFeedbackCSV(passCode, startTime, endTime);
      await transporter.sendMail({
        from: 'atlapp2021@gmail.com',
        to: email,
        subject: 'Feedback Responses : ' + courseName,
        text: '',
        html: emailTemplate(courseName, date, results, type, 0, 0),
        attachments: [
          {
            filename: 'Feedback_Response.csv',
            content: csvContent,
          },
        ],
      });
    } else {
      await transporter.sendMail({
        from: 'atlapp2021@gmail.com',
        to: email,
        subject: 'Feedback Responses : ' + courseName,
        text: '.',
        html: emailTemplate(courseName, date, results, type, 0, 0),
      });
    }
    return 'Mail sent';
  } catch (error) {
    functions.logger.error(
      'There was an error while sending the email:',
      error,
    );
    return 'Error';
  }
}
async function getStudents(passCode) {
  const courseURL = await getURLFromPasscode(passCode);
  console.log('Inside getStudents for course: ' + courseURL);
  const db_ref = admin.app().database(url).ref('InternalDb/Student/');
  const studentSnapshots = await db_ref.once('value');
  let studentList = [];
  studentSnapshots.forEach(student => {
    if (student.hasChild('courses')) {
      if (student.child('courses').val().includes(courseURL)) {
        let dict = {};
        dict['key'] = student.key;
        dict['name'] = student.val()['name'];
        dict['email'] = student.val()['email'];
        dict['photo'] = student.val()['photo'];
        dict['verified'] = 0;
        if ('verified' in student.val()) {
          if (student.val()['verified'].includes(courseURL)) {
            dict['verified'] = 1;
          }
        }
        studentList.push(dict);
      }
    }
  })

  studentList.sort((a, b) =>
    a.name !== undefined && b.name !== undefined
      ? a.name.toUpperCase() > b.name.toUpperCase()
        ? 1
        : b.name.toUpperCase() > a.name.toUpperCase()
          ? -1
          : 0
      : a.email > b.email
        ? 1
        : b.email > a.email
          ? -1
          : 0,
  );

  return studentList;
}
async function StudentListMailer(list, passCode, email) {
  const courseName = await getCourseNameFromPasscode(passCode);
  const path = `${courseName}.csv`;
  const headerString = 'Student Name, Email, Verified\n';
  const rowString = list
    .map(
      (student, i) => `${student.name},${student.email},${student.verified}\n`,
    )
    .join('');
  const csvString = `${headerString}${rowString}`;

  try {
    await transporter.sendMail({
      from: 'atlapp2021@gmail.com',
      to: email,
      subject: 'List Of Students : ' + courseName,
      text: '',
      html: emailTemplate(courseName, '', '', '', 0, 0),
      attachments: [
        {
          filename: path,
          content: csvString,
        },
      ],
    });
    return 'Mail sent';
  } catch (error) {
    functions.logger.error(
      'There was an error while sending the email:',
      error,
    );
    return 'Error';
  }
}
async function CourseMailer(list, passCode, email, announcements, qc, fc) {
  const courseName = await getCourseNameFromPasscode(passCode);
  const StudentPath = `Students.csv`;
  const AnnouncementsPath = `Announcements.csv`;
  const studentheaderString = 'Student Name, Email, Verified\n';
  const studentrowString = list
    .map(
      (student, i) => `${student.name},${student.email},${student.verified}\n`,
    )
    .join('');
  const studentString = `${studentheaderString}${studentrowString}`;
  const announcementheaderString =
    'Announcement Date, Announcement Heading, Announcement Description\n';
  let announcementrowString = ` , , \n`;
  if (announcements !== '-1') {
    announcementrowString = await announcements
      .map(
        (announcement, i) =>
          `${announcement.date},${announcement.heading},${announcement.description
          }\n`,
      )
      .join('');
  }
  const announcementString = `${announcementheaderString}${announcementrowString}`;

  try {
    await transporter.sendMail({
      from: 'atlapp2021@gmail.com',
      to: email,
      subject: 'Course Info : ' + courseName,
      text: '',
      html: emailTemplate(courseName, '', '', 'Course', qc, fc),
      attachments: [
        {
          filename: StudentPath,
          content: studentString,
        },
        {
          filename: AnnouncementsPath,
          content: announcementString,
        },
      ],
    });
    return 'Mail sent';
  } catch (error) {
    functions.logger.error(
      'There was an error while sending the email:',
      error,
    );
    return 'Error';
  }
}
async function deleteAllMatchingKey(table, key, childKey) {
  const db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/' + table + '/');
  return db_ref
    .orderByChild(childKey)
    .equalTo(key)
    .once('value')
    .then(snapshots => {
      console.log('starting to remove from table ' + table);
      let childrenToRemove = [];
      snapshots.forEach(child => {
        // console.log(child.key);
        childrenToRemove.push(child.ref.remove());
      });
      return Promise.all(childrenToRemove);
    })
    .then(() => {
      console.log('Done');
    })
    .catch(errorObject => {
      console.log(errorObject);
    });
}
async function deleteCourseHelper(passCode, courseURL) {
  console.log('Inside delete course helper');
  console.log('Passcode,course: ', passCode, courseURL);
  await removeFromStudentList(courseURL);
  await deleteAllMatchingKey('Courses', passCode, 'passCode');
  await deleteAllMatchingKey('Announcements', passCode, 'passCode');
  await deleteAllMatchingKey('KBC', passCode, 'passCode');
  await deleteAllMatchingKey('KBCResponse', passCode, 'passCode');
  await deleteAllMatchingKey('Feedback', passCode, 'passCode');
  await deleteAllMatchingKey('FeedbackResponse', passCode, 'passCode');
}
async function removeFromStudentList(courseKey) {
  console.log('Inside removeFromStudentList');
  const db = admin.app().database(url);
  const snapshots = await db
    .ref('InternalDb/Student/')
    .once('value');
  let studentsToModify = [];
  if (snapshots.val()) {
    snapshots.forEach(student => {
      console.log('Student: ', student.key);
      if (student.child('courses').includes(courseKey)) {
        const promise = db
          .ref('InternalDb/Student/' + student.key + '/courses/')
          .once('value')
          .then(courses => {
            console.log('Courses: ', courses.val());
            let newCourses = courses.val().filter(course => {
              return course !== courseKey;
            });
            return newCourses;
          })
          .then(courses => {
            console.log('New Courses: ', courses);
            return db
              .ref('InternalDb/Student/' + student.key + '/courses/')
              .set(courses);
          });
        studentsToModify.push(promise);
      }
    });
    return Promise.all(studentsToModify);
  }
}
async function removeStudentFromCourses(studentID) {
  const db = admin.app().database(url);
  console.log('Removing Student from courses');
  const snapshots = await db
    .ref('InternalDb/Student/' + studentID + '/courses')
    .once('value');
  let removeFromCourses = [];
  const courses = snapshots.val();
  if (courses) {
    courses.forEach(course => {
      removeFromCourses.push(
        db
          .ref('InternalDb/Courses/' + course + '/students/' + studentID)
          .remove(),
      );
    });
    return Promise.all(removeFromCourses).then(() => {
      console.log('Done');
    });
  }
}
async function deleteStudentHelper(studentID) {
  await deleteAllMatchingKey('KBCResponse', studentID, 'userID');
  await deleteAllMatchingKey('FeedbackResponse', studentID, 'userID');
  await removeStudentFromCourses(studentID);
}
async function deleteFacultyHelper(facultyID) {
  console.log('Inside Delete Faculty Helper');
  db = admin.app().database(url);
  db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Faculty/' + facultyID);
  let coursesToRemove = [];
  snapshots = await db_ref.child('courses').once('value');
  const courses = snapshots.val();
  console.log('Course are: ', courses);
  if (courses) {
    courses.forEach(course => {
      courseRemovePromise = db
        .ref('InternalDb/Courses/' + course + '/passCode/')
        .once('value')
        .then(passCode => {
          return deleteCourseHelper(passCode.val(), course);
        });
      coursesToRemove.push(courseRemovePromise);
    });
    return Promise.all(coursesToRemove);
  }
}
function quizHash(startTime,date){
  return 
}
async function quizResearchLogger(
  list,
  answer,
  errorRate,
  type,
  passCode,
  quizNumber,
  startTime,
  endTime,
  email,){
  // 
  curr_time = moment.utc()
  // console.log(curr_time)
  // console.log(answer)
  console.log(list)
  db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Lectures/')
   // getting lecture timings

  // finding which class is going on currently

timings = await db_ref.orderByChild('passCode').equalTo(passCode).once('value')
timings = timings.val()
if (!timings) {return}

// console.log(timings)
// console.log(curr_time.day())
var starTime = null;
var endTime = null;
var lecNo = null;
for (const [key, value] of Object.entries(timings)) {
  // 
  // console.log(value['day']+' '+curr_time.day())
  if (value['day']==curr_time.day()){
    console.log(key, value);
    startTime = value['startTime']
    endTime = value['endTime']

  }
}
startTime = moment.utc(curr_time.format('DD/MM/YYYY')+' ' + startTime,'DD/MM/YYYY HH:mm:ss')
endTime = moment.utc(curr_time.format('DD/MM/YYYY')+' ' + startTime,'DD/MM/YYYY HH:mm:ss')
// console.log('func ends')
// Making a table : stud_email-starTime-passCode
// iterating over all responses
await Promise.all(list.map(async(student)=> {
  // student = list[i]
  const grade = autoGrader(student.Answer,answer,errorRate,type)
  
  // getting reference
  reference = await admin
    .app()
    .database(url)
  // check if exists
  db_ref = await admin
    .app()
    .database(url)
    .ref('InternalDb/StudentResearch/')
  snapshot = await db_ref.orderByChild('email-startTime-passCode').equalTo(student.Email + '-'+ startTime.format('DD/MM/YYYY HH:mm:ss') + '-' +passCode).once('value')
  if (!snapshot.val()){

    await db_ref.push({
      'email':student.Email,
      'passCode': passCode,
      'startTime': startTime.format('DD/MM/YYYY HH:mm:ss'),
      'attempted_quizzes': student.Answer=='N/A'?0:1,
      'not_attempted_quizzes':student.Answer=='N/A'?1:0,
      'correct_quizzes': grade=='1' ? 1 : 0,
      'feedbacks_attended':0,
      'responseTime':student.responseTime ,
      'email-startTime-passCode':student.Email + '-'+ startTime.format('DD/MM/YYYY HH:mm:ss') + '-' +passCode
    })
  }
  else{
    entries = Object.entries(snapshot.val());
    [key,value] = entries[0];

    await db_ref.child(key)
    .update({'attempted_quizzes':student.Answer=='N/A'?value['attempted_quizzes']:value['attempted_quizzes']+1,
      'correct_quizzes':grade=='1'?value['correct_quizzes']+ 1 : value['correct_quizzes'],
      'responseTime':value['responseTime'] + student.responseTime,
      'not_attempted_quizzes':student.Answer=='N/A'?value['not_attempted_quizzes']+1:value['not_attempted_quizzes']},(error) => {if(error){console.log(error)}})
  }





})
)}
async function feedbackResearchLogger(
          passCode,
          startTime,
          endTime){
  list = await admin
    .app()
    .database(url)
    .ref('InternalDb/FeedbackResponse/')
    .orderByChild('passCode')
    .equalTo(passCode)
    .once('value')
    .then(async snapshot => {
      let list = [];
      snapshot.forEach(data => {
          const keys = Object(data.val());
          const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
          const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
          const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');

          // if (temp1 <= temp2 && temp1 >= temp) {
          //   list[keys['responses']] += 1;
          // }

            if (temp1 <= temp2 && temp1 >= temp) {
              list.push({Email:keys['userName']})
            }
          }         );
        return list
    })
  console.log(list)

  curr_time = moment.utc()
  db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Lectures/')
  timings = await db_ref.orderByChild('passCode').equalTo(passCode).once('value')
  timings = timings.val()
  if (!timings) {return}

  console.log(timings)
  console.log(curr_time.day())
  var starTime = null;
  var endTime = null;
  var lecNo = null;
  for (const [key, value] of Object.entries(timings)) {
    // 
    console.log(value['day']+' '+curr_time.day())
    if (value['day']==curr_time.day()){
      console.log(key, value);
      startTime = value['startTime']
      endTime = value['endTime']

    }
  }
  startTime = moment.utc(curr_time.format('DD/MM/YYYY')+' ' + startTime,'DD/MM/YYYY HH:mm:ss')
  endTime = moment.utc(curr_time.format('DD/MM/YYYY')+' ' + startTime,'DD/MM/YYYY HH:mm:ss')
  console.log('func ends')
  await Promise.all(list.map(async(student)=> {
    // student = list[i]

    // getting reference
    reference = await admin
      .app()
      .database(url)
    // check if exists
    db_ref = await admin
      .app()
      .database(url)
      .ref('InternalDb/StudentResearch/')
    snapshot = await db_ref.orderByChild('email-startTime-passCode').equalTo(student.Email + '-'+ startTime.format('DD/MM/YYYY HH:mm:ss') + '-' +passCode).once('value')
    if (!snapshot.val()){

      await db_ref.push({
        'email':student.Email,
        'passCode': passCode,
        'startTime': startTime.format('DD/MM/YYYY HH:mm:ss'),
        'attempted_quizzes': 0,
        'not_attempted_quizzes':0,
        'correct_quizzes': 0,
        'feedbacks_attended':1,
        'responseTime':0 ,
        'email-startTime-passCode':student.Email + '-'+ startTime.format('DD/MM/YYYY HH:mm:ss') + '-' +passCode
      })
    }
    else{
      entries = Object.entries(snapshot.val());
      [key,value] = entries[0];
      // console.log(key)
      // console.log(value)
      // console.log('Feedback attended by key '+ key)
      await db_ref.child(key)
      .update({'feedbacks_attended':value['feedbacks_attended']+1},(error) => {if(error){console.log(error)}})

    }
}))
}


exports.mailingSystem = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { message: 'Authentication Required!', code: 401 };
  }

  type = data.type;
  passCode = data.passCode;
  email = await getEmailFromPasscode(passCode, type);
  console.log('Mail Function Started');
  console.log(email);

  if (type === 'Quiz') {
    coursequizurl = await getKBCURLFromPasscode(passCode);
    return admin
      .app()
      .database(url)
      .ref('InternalDb/KBC/' + coursequizurl)
      .once('value')
      .then(async snapshot => {
        const value = snapshot.val();
        const data = await getAllStudentsforMail(
          passCode,
          value['startTime'],
          value['endTime'],
        );
        await quizResearchLogger(data,
          value['correctAnswer'],
          value['errorRate'],
          value['quizType'],
          value['passCode'],
          value['questionCount'],
          value['startTime'],
          value['endTime'],
          email,)
        return await QuizResponseMailer(
          data,
          value['correctAnswer'],
          value['errorRate'],
          value['quizType'],
          value['passCode'],
          value['questionCount'],
          value['startTime'],
          value['endTime'],
          email,
        );
      })
      .catch(error => {
        console.log(error);
      });
  } else if (type === 'Feedback') {
    coursefburl = await getFBURLFromPasscode(passCode);
    return admin
      .app()
      .database(url)
      .ref('InternalDb/Feedback/' + coursefburl)
      .once('value')
      .then(async snapshot => {
        const value = snapshot.val();
        const keys = Object(snapshot.val());
        type = '0';
        if ('kind' in keys) {
          type = keys['kind'];
        }
        const data = await getFeedbackResponse(
          passCode,
          value['startTime'],
          value['endTime'],
          type,
        );
        await feedbackResearchLogger(
          passCode,
          value['startTime'],
          value['endTime'])
        return await FeedbackResponseMailer(
          data,
          passCode,
          value['startTime'],
          value['endTime'],
          'Feedback' + type,
          email,
        );
      })
      .catch(error => {
        console.log(error);
      });
  } else if (type === 'StudentList') {
    courseurl = await getURLFromPasscode(passCode);
    const data = await getStudents(passCode);
    return await StudentListMailer(data, passCode, email).catch(error => {
      console.log(error);
    });
  } else if (type === 'Course') {
    courseurl = await getURLFromPasscode(passCode);
    const a = await getAllAnnouncement(passCode);
    const qc = await getQuizCount(passCode);
    const fc = await getFeedbackCount(passCode);
    const data = await getStudents(passCode);
    return await CourseMailer(data, passCode, email, a, qc, fc);
  }
});
exports.deleteCourse = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { message: 'Authentication Required!', code: 401 };
  }
  const passCode = data.passCode;
  console.log('Got passCode to delete ' + passCode);
  const courseURL = await getURLFromPasscode(passCode);
  await deleteCourseHelper(passCode, courseURL);
  return 'done';
});
exports.deleteStudent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { message: 'Authentication Required!', code: 401 };
  }
  studentID = data.key;
  userUID = data.userUID;
  console.log('Student ID: ' + studentID);
  console.log('Recieved data');
  console.log(data);
  console.log(context);
  dbRef = admin
    .app()
    .database(url)
    .ref('InternalDb/Student/' + studentID);
  return dbRef
    .once('value')
    .then(
      async snapshot => {
        if (snapshot.val()) {
          await deleteStudentHelper(studentID);
          await snapshot.ref.remove();
        } else {
          throw new functions.https.HttpsError(
            'unknown',
            'error while removing',
          );
        }
      },
      errorObject => {
        console.log('The student read failed: ' + errorObject.code);
        throw new functions.https.HttpsError(
          'unknown',
          'error while student read',
        );
      },
    )
    .then(
      () => {
        return admin.auth().deleteUser(userUID);
      },
      error => {
        console.log('Error deleting user from firebase auth:', error);
        throw new functions.https.HttpsError(
          'unknown',
          'error while deleting user from firebase auth',
        );
      },
    )
    .then(() => {
      console.log('Deleted Student ' + studentID);
    });
});
exports.deleteFaculty = functions.https.onCall((data, context) => {
  if (!context.auth) {
    return { message: 'Authentication Required!', code: 401 };
  }
  const key = data.key;
  const userUID = data.uid;
  console.log('Faculty KEY ' + key);
  console.log('recieved data');

  db_ref = admin
    .app()
    .database(url)
    .ref('InternalDb/Faculty/' + key);
  return db_ref
    .once('value')
    .then(
      async snapshot => {
        if (snapshot.val()) {
          await deleteFacultyHelper(key);
          await snapshot.ref.remove();
        } else {
          throw new functions.https.HttpsError(
            'unknown',
            'error while removing',
          );
        }
      },
      errorObject => {
        console.log('The Faculty read failed: ', errorObject);
        throw new functions.https.HttpsError(
          'unknown',
          'error while faculty read',
        );
      },
    )
    .then(
      () => {
        return admin.auth().deleteUser(userUID);
      },
      errorObject => {
        console.log('Error deleting user from firebase auth:', errorObject);
        throw new functions.https.HttpsError(
          'unknown',
          'error while deleting user from firebase auth',
        );
      },
    )
    .then(() => {
      console.log('Deleted Faculty:', key);
    });
});

exports.quizNotification = functions.database
  .ref('InternalDb/KBC/{qid}')
  .onWrite(async (change, context) => {
    try {
      const { after } = change;
      const { _data } = after;
      const courseName = await getCourseNameFromPasscode(_data.passCode);
      let type = 'single-correct';
      if (_data.quizType === 'multicorrect') {
        type = 'multi-correct';
      }
      if (_data.quizType === 'alphaNumerical') {
        type = 'alpha-numeric';
      }
      if (_data.quizType === 'numeric') {
        type = 'numeric';
      }

      console.log('Quiz Notification executing');
      if (!_data.emailResponse && _data.quizType != '') {
        const payload = {
          notification: {
            title: 'Quiz',
            body: `A new ${type} quiz has been started in ${courseName}!`,
          },
          topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
        };
        return await admin.messaging().send(payload);
      }
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });
exports.feedbackNotification = functions.database
  .ref('InternalDb/Feedback/{id}')
  .onWrite(async (change, context) => {
    try {
      const { after } = change;
      const { _data } = after;
      const courseName = await getCourseNameFromPasscode(_data.passCode);
      console.log('Feedback Notification executing');
      var str1 = _data.startTime.substring(0, 10);
      var str2 = _data.startTime.substring(10, _data.startTime.length);
      console.log(str2);

      str1 = str1.replace('/', '-');
      str1 = str1.replace('/', '-');

      var newdate = str1
        .split('-')
        .reverse()
        .join('-');
      newdate = newdate.concat(str2);
      var t = new Date(newdate);
      console.log(`The new date is ${t}`);
      var clientTime = (t.getTime() - 330 * 60 * 1000) / 1000;
      console.log(`The call date in UTC seconds ${clientTime}`);
      var server = new Date();
      console.log(`The server date is ${server}`);
      console.log(`The server date in UTC seconds ${server.getTime() / 1000}`);
      //console.log(new Date().toString().split('GMT')[0] + ' UTC');
      serverTime = server.getTime() / 1000;

      if (
        serverTime > clientTime &&
        !_data.emailResponse &&
        _data.startTime != ''
      ) {
        console.log('Sending Notif');
        const Noitfier = {
          notification: {
            title: 'FeedBack',
            body: `A new feedBack form has been posted in ${courseName} !`,
          },
          topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
        };
        return await admin.messaging().send(Noitfier);
      }
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });
exports.announcementsNotification = functions.database
  .ref('InternalDb/Announcements/{a_id}')
  .onWrite(async (change, context) => {
    try {
      const { after } = change;
      const { _data } = after;
      const courseName = await getCourseNameFromPasscode(_data.passCode);
      console.log('Announcement Notification executing');
      const Announce = {
        notification: {
          title: `${courseName} : ${_data.heading}`,
          body: `${_data.description}`,
        },
        topic: _data.passCode, // Passing the path params along with the notification to the device. [optional]
      };
      return await admin.messaging().send(Announce);
    } catch (ex) {
      return console.error('Error:', ex.toString());
    }
  });
exports.countStudentChanges = functions.database
  .ref('InternalDb/KBCResponse/{response_id}')
  .onUpdate((change,context)=>
  {
    const after = change.after.val()
    const before = change.before.val()
    if (after['answer']!=before['answer']){
      if('updateCount' in after){
      updateCount= after['updateCount']+1}
      else{
        updateCount =1
      }
      return change.after.ref.update({updateCount:updateCount},(error)=> {if(error){console.log(error)}})
    }
    else{
      return null
    }
  })