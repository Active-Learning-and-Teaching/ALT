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

    getFeedbackResponse  = async (userID, passCode)=> {
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

    getFeedbackResponseForOneStudent = async (userID, passCode, startTime, endTime)=> {
        let ans = null
        await this.reference
            .orderByChild("userID_passCode")
            .equalTo( userID+"_"+passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.values(snapshot.val())[0];
                    if (keys["timestamp"]<=endTime && keys["timestamp"]>=startTime) {
                        ans = true
                    }
                    else {
                        ans = false
                    }
                }
            })
        return ans
    }

    setFeedbackResponse = async (passCode, userID, userName, responses, timestamp, url) =>{
        await database()
            .ref(config['internalDb']+'/FeedbackResponse/'+url)
            .set({
                passCode: passCode,
                userID: userID,
                userName: userName,
                userID_passCode : userID+"_"+passCode,
                responses: responses,
                timestamp:timestamp
            })
            .then(()=>{
                console.log("Response modified")
            })
    }

    createFeedbackResponse =  async (passCode, userID, userName, responses, timestamp) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                userID: userID,
                userName: userName,
                userID_passCode : userID+"_"+passCode,
                responses: responses,
                timestamp: timestamp
            })
            .then(() => {
                console.log('Response Created')
            })
    }

    getAllResponse = async (passCode, startTime, endTime, topics)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(async snapshot => {
                const list = {}
                for await (const topic of topics)
                    list[topic] = {0:0, 1:0, 2:0}

                await snapshot.forEach( (data) => {
                    const keys = Object(data.val())
                    if (keys["timestamp"]<=endTime && keys["timestamp"]>=startTime){
                        for (const topic of topics)
                            list[topic][keys["responses"][topic]] += 1
                    }
                })
                ans = list
            })
        return ans
    }
}


export default FeedbackResponses;
