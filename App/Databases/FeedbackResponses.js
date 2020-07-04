import database from '@react-native-firebase/database';
import * as config from '../config';

class FeedbackResponses {

    coursePasscode :string
    userID :string
    userName : string
    answer : []
    timestamp:string

    constructor() {
    }


    reference = database().ref(config['internalDb']+'/FeedbackResponse/')

    // getResponse  = async (userID, passCode)=> {
    //     let ans = null
    //     await this.reference
    //         .orderByChild("userID_passCode")
    //         .equalTo( userID+"_"+passCode)
    //         .once('value')
    //         .then(snapshot => {
    //             if (snapshot.val()){
    //                 const keys = Object.keys(snapshot.val());
    //                 ans = keys[0]
    //             }
    //         })
    //     return ans
    // }
    //
    // setResponse = async (passCode, userID, userName, answer, timestamp, url) =>{
    //     await database()
    //         .ref(config['internalDb']+'/FeedbackResponse/'+url)
    //         .set({
    //             passCode: passCode,
    //             userID: userID,
    //             userName: userName,
    //             userID_passCode : userID+"_"+passCode,
    //             answer: answer,
    //             timestamp:timestamp
    //         })
    //         .then(()=>{
    //             console.log("Response modified")
    //         })
    // }
    //
    // createResponse =  async (passCode, userID, userName, answer, timestamp) => {
    //     await this.reference
    //         .push()
    //         .set({
    //             passCode: passCode,
    //             userID: userID,
    //             userName: userName,
    //             userID_passCode : userID+"_"+passCode,
    //             answer: answer,
    //             timestamp: timestamp
    //         })
    //         .then(() => {
    //             console.log('Response Created')
    //         })
    // }
    //
    // getAllResponse = async (passCode, startTime, endTime)=> {
    //     let ans = null
    //     await this.reference
    //         .orderByChild("passCode")
    //         .equalTo(passCode)
    //         .once('value')
    //         .then(snapshot => {
    //             const list = {'A':0,'B':0,'C':0,'D':0}
    //             snapshot.forEach( (data) => {
    //                 const keys = Object(data.val())
    //                 if (keys["timestamp"]<=endTime && keys["timestamp"]>=startTime){
    //                     list[keys["answer"]] += 1
    //                 }
    //             })
    //             ans = list
    //         })
    //     return ans
    // }

}


export default FeedbackResponses;
