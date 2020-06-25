import database from '@react-native-firebase/database';
import * as config from '../config';

class KBCResponses {

    coursePasscode :string
    userID :string
    userName : string
    answer : string
    timestamp:string

    constructor() {
    }


    reference = database().ref(config['internalDb']+'/KBCResponse/')

    getResponse  = async (userID)=> {
        let ans = null
        await this.reference
            .orderByChild("userID")
            .equalTo(userID)
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
                answer: answer,
                timestamp: timestamp
            })
            .then(() => {
                console.log('Response Created')
            })
    }

}


export default KBCResponses;
