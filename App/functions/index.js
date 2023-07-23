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
						Please find attached the csv containing all the feedback responses 
						 <br/> 
						<br/>

				</p>
				
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
		.firestore()
		.collection('Courses');
	let snapshots;
	let courseURL;
	try {
		snapshots = await db_ref
			.where('passCode', '==', passCode)
			.get();
		if(!snapshots.empty){
			if(snapshots.docs.length>1){
				throw 'Multiple courses found with passcode: ' + passCode;
			}
			courseURL = snapshots.docs[0].id;
		}
		else{
			throw 'No courses with passcode: ' + passCode;
		}
		console.log('Inside getURLFromPasscode: ', courseURL);
	} catch (errorObject) {
		console.log('The read in getURLFromPasscode failed: ', errorObject);
	}
	return courseURL;
}
async function getEmailFromPasscode(passCode, type) {
	let docId = await getURLFromPasscode(passCode);
	const db_ref = admin
		.app()
		.firestore()
		.collection("Courses")
		.doc(docId);

	let primary = '';
	let quiz = '';
	let feedback = '';
	let snapshot;
	try {
		snapshot = await db_ref.get();
		const course = snapshot.data();
		quiz = course['quizEmail'] || '';
		feedback = course['feedbackEmail'] || '';
	} catch (errorObject) {
		console.log('The read in getEmailFromPasscode failed: ', errorObject);
	}

	await admin
		.app()
		.firestore()
		.collection('Faculty/')
		.where('courses', 'array-contains', docId)
		.get()
		.then(snapshot => {
			if(!snapshot.empty){
				primary = snapshot.docs[0].data().email || '';
			}
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
	// let myurl = await getURLFromPasscode(passCode);
	// console.log("getCourseName",passCode);
	const db_ref = admin
		.app()
		.firestore()
		.collection('Courses');
	let courseName;
	await db_ref.where('passCode', '==', passCode)
		.get()
		.then(
		function (snapshot) {
			if(!snapshot.empty){
					courseName = snapshot.docs[0].data().courseName;
			}
			
		},
		function (errorObject) {
			console.log('The read failed: ', errorObject);
		}
	);
	console.log("getCourseName", courseName);
	return courseName;
}
async function getKBCURLFromPasscode(passCode) {
	const db_ref = admin
		.app()
		.firestore()
		.collection('KBC');
	let courseURL;
	await db_ref
		.where('passCode', '==', passCode)
		.get()
		.then(
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
		.firestore()
		.collection('Announcements');
	let ans = '';
	await db_ref
		.where('passCode', '==', passCode)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				const list = [];
				snapshot.docs.forEach(doc => {
					const keys = doc.data();
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
		.firestore()
		.collection('KBC');
	let ans = null;
	await db_ref
		.where('passCode', '==', passCode)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				ans = snapshot.docs[0].data();
			}
		});
	let count = ans === null ? '0' : ans['questionCount'];
	return count;
}
async function getQuizResponse(passCode, startTime, endTime, type) {
	let ans = null;
	await admin
		.app()
		.firestore()
		.collection('KBCResponse')
		.where('passCode', '==', passCode)
		.get()
		.then(snapshot => {
			const dict = {};
			const list = { A: 0, B: 0, C: 0, D: 0 };
			snapshot.docs.forEach(doc => {
				const keys = doc.data();
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
		.firestore()
		.collection('KBCResponse')
		.where('passCode', '==', passCode)
		.get()
		.then(snapshot => {
			const a = {};
			const b = [];
			snapshot.docs.forEach(doc => {
				const keys = doc.data();
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
		.firestore()
		.collection('Feedback');

	let ans = null;
	await db_ref
		.where('passCode', '==', passCode)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				ans = snapshot.docs[0].data();
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
			.firestore()
			.collection('Feedback')
			.where('passCode', '==', passCode)
			.get()
			.then(async snapshot => {
				if(!snapshot.empty){
					ans = snapshot.docs[0].data();
				}
			});
	} else {
		await admin
			.app()
			.firestore()
			.collection('FeedbackResponse')
			.where('passCode', '==', passCode)
			.get()
			.then(async snapshot => {
				let list = {};
				if (type === '0') list = { 0: 0, 1: 0, 2: 0 };
				else if (type === '1') list = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
				else list = [];

				snapshot.docs.forEach(doc => {
					const keys = doc.data();
					const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
					const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
					const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');
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
		.firestore()
		.collection('FeedbackResponse')
		.where('passCode', '==', passCode)
		.get()
		.then(async snapshot => {
			if (!snapshot.empty) {
				snapshot.docs.forEach(doc => {
					const keys = doc.data();
					const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
					const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
					const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');
					// generate csv file for feedback responses between start and end time
					const typeBack = [keys['responses'][0], keys['responses'][1]];
					if (temp1 <= temp2 && temp1 >= temp) {
						list.push(typeBack);
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
		.firestore()
		.collection('Feedback');
	let feedbackURL;
	await db_ref
		.where('passCode', '==', passCode)
		.get()
		.then((snapshot) => {
				if(snapshot.empty){
					console.log('No such feedback document!');
				}
				feedbackURL = snapshot.docs[0].id;
			},
			function (errorObject) {
				console.log('The read failed: ', errorObject);
			},
		);
	return feedbackURL;
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
	const db_ref = admin.app().firestore().collection("Student");
	let studentList = [];
	await db_ref
				.where("courses", 'array-contains', courseURL)
				.get()
				.then((snapshot)=>{
					if(!snapshot.empty){
						snapshot.docs.map((doc)=>{
							let dict = {};
							dict['key'] = doc.id;
							dict['name'] = doc.data()['name'];
							dict['email'] = doc.data()['email'];
							dict['photo'] = doc.data()['photo'];
							dict['verified'] = 0;
							if ('verified' in doc.data()) {
								if (doc.data()['verified'].includes(courseURL)) {
									dict['verified'] = 1;
								}
							}
							studentList.push(dict);
						})
					}
					else{
						console.log("No student enrolled in the course in getStudents");
					}
				});

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
		.firestore()
		.collection(table);
	return db_ref
		.where(childKey, '==', key)
		.get()
		.then(snapshots => {
			console.log('starting to remove from table ' + table);
			let childrenToRemove = [];
			snapshots.docs.forEach(child => {
				// console.log(child.key);
				childrenToRemove.push(db_ref.doc(child.id).delete());
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
	const db = admin.app().firestore();
	const snapshots = await db
		.collection('Student')
		.where("courses", 'array-contains', courseKey)
		.get();
	let studentsToModify = [];
	if (!snapshots.empty) {
		snapshots.docs.forEach(student => {
			console.log('Student: ', student.id);
			
			const promise = db
				.collection('Student').doc(student.id)
				.update({
					'courses': admin.firestore.FieldValue.arrayRemove(courseKey)
				});
			studentsToModify.push(promise);
		});
		return Promise.all(studentsToModify);
	}
}
async function removeStudentFromCourses(studentID) {
	const db = admin.app().firestore();
	console.log('Removing Student from courses');
	const snapshots = await db
		.collection("Student").doc(studentID).get();
	let removeFromCourses = [];
	const courses = snapshots.data().courses;
	if (courses) {
		courses.forEach(course => {
			removeFromCourses.push(
				db.collection("Courses").doc(course).update({
					'students': admin.firestore.FieldValue.arrayRemove(studentID)
				})
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
	db = admin.app().firestore();
	db_ref = db
		.collection('Faculty').doc(facultyID);
	let coursesToRemove = [];
	snapshots = await db_ref.get();
	const courses = snapshots.data().courses;
	console.log('Course are: ', courses);
	if (courses) {
		courses.forEach(course => {
			courseRemovePromise = db
				.collection('Courses').doc(course)
				.get()
				.then(snapshot => {
					return deleteCourseHelper(snapshot.data().passCode, course);
				});
			coursesToRemove.push(courseRemovePromise);
		});
		return Promise.all(coursesToRemove);
	}
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
	email,
) {

	curr_time = moment.utc();
	// console.log(curr_time)
	// console.log(answer)
	console.log(list);
	db_ref = admin
		.app()
		.firestore()
		.collection('Lectures');
	// getting lecture timings

	// finding which class is going on currently

	timings = await db_ref
		.where('passCode', '==', passCode)
		.get();

	if (timings.empty) {
		return;
	}

	// console.log(timings)
	// console.log(curr_time.day())
	var starTime = null;
	var endTime = null;
	var lecNo = null;

	timings.docs.forEach(doc => {
		const value = doc.data();
		if (value['day'] == curr_time.day()) {
			startTime = value['startTime'];
			endTime = value['endTime'];
		}
	});

	startTime = moment.utc(
		curr_time.format('DD/MM/YYYY') + ' ' + startTime,
		'DD/MM/YYYY HH:mm:ss',
	);
	endTime = moment.utc(
		curr_time.format('DD/MM/YYYY') + ' ' + startTime,
		'DD/MM/YYYY HH:mm:ss',
	);
	// console.log('func ends')
	// Making a table : stud_email-starTime-passCode
	// iterating over all responses
	await Promise.all(
		list.map(async student => {
			// student = list[i]
			const grade = autoGrader(student.Answer, answer, errorRate, type);

			// check if exists
			const db_ref = admin
				.app()
				.firestore()
				.collection('StudentResearch');

			const snapshot = await db_ref
				.where(
					'email-startTime-passCode',
					'==',
					student.Email +
						'-' +
						startTime.format('DD/MM/YYYY HH:mm:ss') +
						'-' +
						passCode,
				)
				.get();
			if (snapshot.empty) {
				await db_ref.add({
					email: student.Email,
					passCode: passCode,
					startTime: startTime.format('DD/MM/YYYY HH:mm:ss'),
					attempted_quizzes: student.Answer == 'N/A' ? 0 : 1,
					not_attempted_quizzes: student.Answer == 'N/A' ? 1 : 0,
					correct_quizzes: grade == '1' ? 1 : 0,
					feedbacks_attended: 0,
					responseTime: student.responseTime,
					'email-startTime-passCode':
						student.Email +
						'-' +
						startTime.format('DD/MM/YYYY HH:mm:ss') +
						'-' +
						passCode,
				});
			} else {
				const docId = snapshot.docs[0].id;
				const value = snapshot.docs[0].data();
				await db_ref
					.doc(docId)
					.update(
						{
							attempted_quizzes:
								student.Answer == 'N/A'
									? value['attempted_quizzes']
									: value['attempted_quizzes'] + 1,
							correct_quizzes:
								grade == '1'
									? value['correct_quizzes'] + 1
									: value['correct_quizzes'],
							responseTime: value['responseTime'] + student.responseTime,
							not_attempted_quizzes:
								student.Answer == 'N/A'
									? value['not_attempted_quizzes'] + 1
									: value['not_attempted_quizzes'],
						},
						error => {
							if (error) {
								console.log(error);
							}
						},
					);
			}
		}),
	);
}
async function feedbackResearchLogger(
					passCode,
					startTime,
					endTime){
	const list = await admin
		.app()
		.firestore()
		.collection('FeedbackResponse')
		.where('passCode', '==', passCode)
		.get()
		.then(async snapshot => {
			let list = [];
			snapshot.docs.forEach(doc => {
					const keys = doc.data();
					const temp = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
					const temp1 = moment(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
					const temp2 = moment(endTime, 'DD/MM/YYYY HH:mm:ss');
						if (temp1 <= temp2 && temp1 >= temp) {
							list.push({Email:keys['userName']})
						}
			});
			return list;
		})
	console.log(list)

	curr_time = moment.utc()
	db_ref = admin
		.app()
		.firestore()
		.collection('Lectures');
	const timings = await db_ref.where('passCode', '==', passCode).get();

	if (timings.empty) return;

	console.log(timings)
	console.log(curr_time.day())
	var starTime = null;
	var endTime = null;
	var lecNo = null;

	timings.docs.forEach(doc => {
		const value = doc.data();
		if (value['day'] == curr_time.day()) {
			startTime = value['startTime'];
			endTime = value['endTime'];
		}
	});

	startTime = moment.utc(curr_time.format('DD/MM/YYYY')+' ' + startTime,'DD/MM/YYYY HH:mm:ss')
	endTime = moment.utc(curr_time.format('DD/MM/YYYY')+' ' + startTime,'DD/MM/YYYY HH:mm:ss')
	console.log('func ends')
	await Promise.all(list.map(async(student)=> {

		// check if exists
		db_ref = admin
			.app()
			.firestore()
			.collection('StudentResearch');

		const snapshot = await db_ref.where('email-startTime-passCode', '==', student.Email + '-'+ startTime.format('DD/MM/YYYY HH:mm:ss') + '-' + passCode).get();
		if(snapshot.empty){

			await db_ref.add({
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
			const docId = snapshot.docs[0].id;
			const value = snapshot.docs[0].data();
			// console.log(key)
			// console.log(value)
			// console.log('Feedback attended by key '+ key)
			await db_ref.doc(docId)
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

		return admin
			.app()
			.firestore()
			.collection('KBC')
			.where('passCode', '==', passCode)
			.get()
			.then(async snapshot => {
				if(!snapshot.empty){
					const value = snapshot.docs[0].data();
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
				}
				else{
					console.log("No quiz found for the given passcode");
				}
			})
			.catch(error => {
				console.log(error);
			});

	} else if (type === 'Feedback') {
		coursefburl = await getFBURLFromPasscode(passCode);
		return admin
			.app()
			.firestore()
			.collection('Feedback')
			.where('passCode', '==', passCode)
			.get()
			.then(async snapshot => {

				if(!snapshot.empty){
					const value = snapshot.docs[0].data();
					type = value.kind || '0';
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
				}
				else{
					console.log('No feedback available for the given passCode');
				}

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
		.firestore()
		.collection('Student').doc(studentID);
	return dbRef
		.get()
		.then(
			async snapshot => {
				if (snapshot.exists) {
					await deleteStudentHelper(studentID);
					await dbRef.delete();
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
		.firestore
		.collection('Faculty').doc(key);
	return db_ref
		.get()
		.then(
			async snapshot => {
				if (snapshot.exists) {
					await deleteFacultyHelper(key);
					await db_ref.delete();
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


exports.quizNotificationFirestore = functions.firestore
.document('KBC/{qid}')
.onWrite(async (change, context) => {
	try {
		const { after } = change;
		const data = after.data();
		const courseName = await getCourseNameFromPasscode(data.passCode);
		let type = 'single-correct';
		if (data.quizType === 'multicorrect') {
			type = 'multi-correct';
		}
		if (data.quizType === 'alphaNumerical') {
			type = 'alpha-numeric';
		}
		if (data.quizType === 'numeric') {
			type = 'numeric';
		}

		console.log('Quiz Notification executing');
		if (!data.emailResponse && data.quizType != '') {
			const payload = {
				notification: {
					title: 'Quiz',
					body: `A new ${type} quiz has been started in ${courseName}!`,
				},
				topic: data.passCode, // Passing the path params along with the notification to the device. [optional]
			};
			return await admin.messaging().send(payload);
		}
	} catch (ex) {
		return console.error('Error:', ex.toString());
	}
});

exports.quizCancelNotificationFirestore = functions.firestore
.document('KBC/{qid}')
.onUpdate(async (change, context) => {
  try {
    const { after } = change;
    const data = after.data();
    const courseName = await getCourseNameFromPasscode(data.passCode);

    console.log('Quiz Notification executing');

    if (data.quizType=="" && !data.emailResponse && data.passCode!="") {
      const payload = {
        notification: {
          title: 'Quiz Cancelled',
          body: `The quiz for ${courseName} has been cancelled!`,
        },
        topic: data.passCode, // Passing the path params along with the notification to the device. [optional]
      };
      return await admin.messaging().send(payload);
    }
  } catch (ex) {
    return console.error('Error:', ex.toString());
  }
});


exports.feedbackNotificationFirestore = functions.firestore
.document('Feedback/{id}')
.onWrite(async (change, context) => {
	try {
		const { after } = change;
		const data = after.data();
		const courseName = await getCourseNameFromPasscode(data.passCode);
		console.log('Feedback Notification executing');
		var str1 = data.startTime.substring(0, 10);
		var str2 = data.startTime.substring(10, data.startTime.length);
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
			!data.emailResponse &&
			data.startTime != ''
		) {
			console.log('Sending Notif');
			const Noitfier = {
				notification: {
					title: 'FeedBack',
					body: `A new feedBack form has been posted in ${courseName} !`,
				},
				topic: data.passCode, // Passing the path params along with the notification to the device. [optional]
			};
			return await admin.messaging().send(Noitfier);
		}
	} catch (ex) {
		return console.error('Error:', ex.toString());
	}
});

exports.announcementsNotificationFirestore = functions.firestore
.document('Announcements/{docId}')
.onWrite(async (change, context) => {
	try {
		const { after } = change;
		const data = after.data();
		const courseName = await getCourseNameFromPasscode(data.passCode);
		console.log('Announcement Notification executing', courseName);
		const Announce = {
			notification: {
				title: `${courseName} : ${data.heading}`,
				body: `${data.description}`,
			},
			topic: data.passCode, // Passing the path params along with the notification to the device. [optional]
		};
		return await admin.messaging().send(Announce);
	} catch (ex) {
		return console.error('Error:', ex.toString());
	}
});


exports.countStudentChangesFirestore = functions.firestore
.document('KBCResponse/{response_id}')
.onUpdate((change,context)=>
{
	const after = change.after.data()
	const before = change.before.data()
	console.log(change.after.ref);
	if (after['answer']!=before['answer']){
		if('updateCount' in after){
			updateCount= after['updateCount']+1}
		else{
			updateCount =1
		}
		return change.after.ref.update({updateCount:updateCount}).catch((error)=> {if(error){console.log(error)}})
	}
	else{
		return null
	}
})