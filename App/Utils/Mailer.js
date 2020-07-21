import RNSmtpMailer from "react-native-smtp-mailer";
import {emailTemplate} from './MailTemplate';
import Toast from 'react-native-simple-toast';
const RNFS = require('react-native-fs');

export const Mailer = (courseName,email,name,date,topics,results,type) => {

    RNSmtpMailer.sendMail({
        mailhost: "smtp.gmail.com",
        port: "465",
        ssl: true,
        username: "tlsauth2020",
        password: "teaching2020!",
        from: "tlsauth2020@gmail.com",
        recipients: email,
        subject: courseName + " " + type + " results " +"("+date+")",
        htmlBody : emailTemplate(name,date,topics,results,type),
        attachmentPaths : [
            RNFS.DocumentDirectoryPath + "/test.txt"
        ],
        attachmentNames : [
            "firstFile.txt"
        ],
        attachmentTypes : [
            "txt"
        ]
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
