import database from '@react-native-firebase/database';
import * as config from '../config';
import moment from 'moment';

class KBCResponses {

    coursePasscode :string
    userID :string
    userName : string
    answer : string
    timestamp:string

    constructor() {
    }


    reference = database().ref(config['internalDb']+'/KBCResponse/')

    getResponse  = async (userID, passCode)=> {
        let ans = null
        await this.reference
            .orderByChild("userID_passCode")
            .equalTo( userID+"_"+passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.keys(snapshot.val());
                    ans = keys[0]
                }
            })
        return ans
    }

    setResponse = async (passCode, userID, userName, answer, timestamp, url) =>{
        await database()
            .ref(config['internalDb']+'/KBCResponse/'+url)
            .set({
                passCode: passCode,
                userID: userID,
                userName: userName,
                userID_passCode : userID+"_"+passCode,
                answer: answer,
                timestamp:timestamp
            })
            .then(()=>{
                console.log("Response modified")
            })
    }

    createResponse =  async (passCode, userID, userName, answer, timestamp) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                userID: userID,
                userName: userName,
                userID_passCode : userID+"_"+passCode,
                answer: answer,
                timestamp: timestamp
            })
            .then(() => {
                console.log('Response Created')
            })
    }

    getAllMcqResponse = async (passCode, startTime, endTime)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                const list = {'A':0,'B':0,'C':0,'D':0}
                snapshot.forEach( (data) => {
                    const keys = Object(data.val())
                    const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
                    const temp1 = moment(keys["timestamp"], "DD/MM/YYYY HH:mm:ss")
                    const temp2 = moment(endTime, "DD/MM/YYYY HH:mm:ss")

                    if (temp1<=temp2 && temp1>=temp){
                        list[keys["answer"]] += 1
                    }
                })
                ans = list
            })
        return ans
    }

    getAllNumericalResponse = async (passCode, startTime, endTime)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                const dict = {}
                snapshot.forEach( (data) => {
                    const keys = Object(data.val())
                    const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
                    const temp1 = moment(keys["timestamp"], "DD/MM/YYYY HH:mm:ss")
                    const temp2 = moment(endTime, "DD/MM/YYYY HH:mm:ss")

                    if (temp1<=temp2 && temp1>=temp){
                        let answer = keys["answer"].trim().toUpperCase()
                        console.log(answer)
                        if(answer in dict){
                            dict[answer]+=1
                        }
                        else{
                            dict[answer] = 1
                        }
                    }
                })
                ans = dict
            })
        return ans
    }


}


export default KBCResponses;
