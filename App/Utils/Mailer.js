import RNSmtpMailer from "react-native-smtp-mailer";
import {emailTemplate} from './MailTemplate';
import Toast from 'react-native-simple-toast';
const RNFS = require('react-native-fs');
import * as config from '../config.json';
export const Mailer = (courseName,email,name,count,date,topics,results,type) => {
    RNSmtpMailer.sendMail({
        mailhost: "smtp.gmail.com",
        port: "465",
        ssl: true,
        username: config['usernameEmail'],
        password: config['passwordEmail'],
        from: "tlsauth2020@gmail.com",
        recipients: email,

        subject: type==="StudentList"
            ?
            courseName+" list of Students"
            :
            courseName + " " + type + " " + count + " results " +"("+date+")",

        htmlBody : emailTemplate(courseName,name,date,topics,results,type),
        attachmentPaths : type==="StudentList"?[
            RNFS.DocumentDirectoryPath + `/${courseName}.csv`
        ]:[],
        attachmentNames : type==="StudentList"?[
            `${courseName}.csv`
        ]:[],
        attachmentTypes : type==="StudentList"?[
            "csv"
        ]:[]
    })
        .then(success => {
            Toast.show('Email Sent!');
            console.log(success)
        })
        .catch(err => {
            Toast.show('Sending Failed');
            console.log(err)
        });
}
