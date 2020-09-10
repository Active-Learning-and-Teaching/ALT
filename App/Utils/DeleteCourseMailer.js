import RNSmtpMailer from "react-native-smtp-mailer";
import Toast from 'react-native-simple-toast';
const RNFS = require('react-native-fs');
import * as config from '../config.json';
import {deleteCourseTemplate} from './MailTemplate';

export const DeleteCourseMailer = (courseName,courseCode,email,name,feedbackCount,quizCount,passCode,type) => {
    RNSmtpMailer.sendMail({
        mailhost: "smtp.gmail.com",
        port: "465",
        ssl: true,
        username: config['usernameEmail'],
        password: config['passwordEmail'],
        from: "tlsauth2020@gmail.com",
        recipients: email,

        subject: type==="Delete"?
            `[${courseCode}] ${courseName} successfully deleted`:
            `[${courseCode}] Details of ${courseName}`
        ,

        htmlBody : deleteCourseTemplate(courseName,name,feedbackCount,quizCount,passCode),

        attachmentPaths :
            [RNFS.DocumentDirectoryPath + `/${courseCode+"_"+"Announcement"}.csv`,
            RNFS.DocumentDirectoryPath + `/${courseCode+"_"+"StudentList"}.csv`],

        attachmentNames : [`${courseCode+"_"+"Announcement"}.csv`, `${courseCode+"_"+"StudentList"}.csv`],

        attachmentTypes : ["csv"],
    })
        .then(success => {
            Toast.show('Email Sent!');
            console.log(success)

            //Removing the csv
            const reactFile = require('react-native-fs');
            const announcementFileName = courseCode+"_"+"Announcement"
            const announcementPath = reactFile.DocumentDirectoryPath + `/${announcementFileName}.csv`;

            reactFile.unlink(announcementPath)
                .then(() => {
                    console.log('File Deleted');
                })
                .catch((err) => {
                    console.log(err.message);
                });

            const studentFileName = courseCode+"_"+"StudentList"
            const studentPath = reactFile.DocumentDirectoryPath + `/${studentFileName}.csv`;

            reactFile.unlink(studentPath)
                .then(() => {
                    console.log('File Deleted');
                })
                .catch((err) => {
                    console.log(err.message);
                });


        })
        .catch(err => {
            Toast.show('Sending Email Failed');
            console.log(err)
        });
}
