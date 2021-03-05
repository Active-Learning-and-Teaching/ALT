import RNSmtpMailer from "react-native-smtp-mailer";
import {emailTemplate} from './MailTemplate';
import Toast from 'react-native-simple-toast';
const RNFS = require('react-native-fs');
import * as config from '../config.json';
export const Mailer = (courseName,courseCode,email,name,count,date,topics,results,type) => {
    RNSmtpMailer.sendMail({
        mailhost: "smtp.gmail.com",
        port: "465",
        ssl: true,
        username: config['usernameEmail'],
        password: config['passwordEmail'],
        from: config['nameEmail'],
        recipients: email,
        
        subject:
            type==="StudentList"
            ?
            `[${courseCode}]: ${courseName} List of Students`
            :type==="Minute paper"
                ?
                `[${courseCode}]: ${type} #${count} results (${date})`
                :
                `[${courseCode}]: Quiz #${count}: ${type} results (${date})`,

        htmlBody : emailTemplate(courseName,name,date,topics,results,type),
        attachmentPaths : type==="StudentList"
            ? [RNFS.DocumentDirectoryPath + `/${courseName}.csv`]
            : type ==="Minute paper"
                ?[]
                :[RNFS.DocumentDirectoryPath + `/${courseCode+"_"+date.replace(/\//g,"-").split(" ")[0]+"_"+"Quiz-"+count}.csv`],
        attachmentNames : type==="StudentList"
            ? [`${courseName}.csv`]
            : type==="Minute paper"
                ?[]
                :[`${courseCode+"_"+date.replace(/\//g,"-").split(" ")[0]+"_"+"Quiz-"+count}.csv`],
        attachmentTypes : type==="StudentList"
            ?["csv"]
            :type ==="Minute paper"
                ?[]
                :["csv"],
    })
        .then(success => {
            Toast.show('Email Sent!');
            console.log(success)

            //Removing the csv
            const reactFile = require('react-native-fs');
            const fileName = type==="StudentList"
                ? courseName
                : type==="Minute paper"
                    ?""
                    :courseCode+"_"+date.replace(/\//g,"-").split(" ")[0]+"_"+"Quiz-"+count

            const path = reactFile.DocumentDirectoryPath + `/${fileName}.csv`;

            reactFile.unlink(path)
                .then(() => {
                    console.log('File Deleted');
                })
                .catch((err) => {
                    console.log(err.message);
                });

        })
        .catch(err => {
            Toast.show('Sending Failed');
            console.log(err)
        });
}
