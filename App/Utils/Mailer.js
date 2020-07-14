import RNSmtpMailer from "react-native-smtp-mailer";
import {emailTemplate} from './MailTemplate';

export const Mailer = (email,name,date,results,type) => {

    RNSmtpMailer.sendMail({
        mailhost: "smtp.gmail.com",
        port: "465",
        ssl: true,
        username: "tlsauth2020",
        password: "teaching2020!",
        from: "tlsauth2020@gmail.com",
        recipients: email,
        subject: "Results for " + type + " on " + date,
        htmlBody : emailTemplate(name,date,results,type)
        // attachmentPaths: [
        //     RNFS.ExternalDirectoryPath + "/image.jpg",
        //     RNFS.DocumentDirectoryPath + "/test.txt",
        //     RNFS.DocumentDirectoryPath + "/test2.csv",
        //     RNFS.DocumentDirectoryPath + "/pdfFile.pdf",
        //     RNFS.DocumentDirectoryPath + "/zipFile.zip",
        //     RNFS.DocumentDirectoryPath + "/image.png"
        // ],
        // attachmentNames: [
        //     "image.jpg",
        //     "firstFile.txt",
        //     "secondFile.csv",
        //     "pdfFile.pdf",
        //     "zipExample.zip",
        //     "pngImage.png"
        // ], //only used in android, these are renames of original files. in ios filenames will be same as specified in path. In ios-only application, leave it empty: attachmentNames:[]
        // attachmentTypes: ["img", "txt", "csv", "pdf", "zip", "img"] //needed for android, in ios-only application, leave it empty: attachmentTypes:[]. Generally every img(either jpg, png, jpeg or whatever) file should have "img", and every other file should have its corresponding type.
    })
        .then(success => {
            console.log(success)
        })
        .catch(err => console.log(err));
}
