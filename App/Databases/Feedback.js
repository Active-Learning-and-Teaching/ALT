import database from '@react-native-firebase/database';
import * as config from '../config';

class Feedback {

    coursePasscode :string
    startTime :string
    endTime : string
    instructor : string


    constructor() {
    }


    reference = database().ref(config['internalDb']+'/Feedback/')

    getFeedback  = async (passCode)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.keys(snapshot.val());
                    ans = keys[0]
                }
            })
        return ans
    }

    // getTiming  = async (passCode)=> {
    //     let ans = null
    //     await this.reference
    //         .orderByChild("passCode")
    //         .equalTo(passCode)
    //         .once('value')
    //         .then(snapshot => {
    //             if (snapshot.val()){
    //                 const keys = Object.values(snapshot.val());
    //                 ans = keys[0]
    //             }
    //         })
    //     return ans
    // }


    setFeedback = async (passCode, startTime, endTime, topics, instructor, url, emailResponse) =>{
        await database()
            .ref(config['internalDb']+'/Feedback/'+url)
            .set({
                passCode: passCode,
                startTime: startTime,
                endTime: endTime,
                topics: topics,
                instructor: instructor,
                emailResponse: emailResponse,
            })
            .then(()=>{
                console.log("Feedback modified")
            })
    }

    createFeedback =  async (passCode, startTime, endTime, topics, instructor) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                startTime: startTime,
                endTime: endTime,
                topics: topics,
                instructor: instructor,
                emailResponse: false,
            })
            .then(() => {
                console.log('Feedback created')
            })
    }

}


export default Feedback;
