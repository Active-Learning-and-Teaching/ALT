import database from '@react-native-firebase/database';
import * as config from '../config';

class KBC {

    coursePasscode :string
    startTime :string
    endTime : string
    duration : string
    correctAnswer : string
    instructor : string
    quizType : string

    constructor() {
    }


    reference = database().ref(config['internalDb']+'/KBC/')

    getQuestion  = async (passCode)=> {
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

    getTiming  = async (passCode)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.values(snapshot.val());
                    ans = keys[0]
                }
            })
        return ans
    }


    setQuestion = async (passCode, startTime, endTime, duration, correctAnswer, instructor, quizType, url, emailResponse) =>{
        await database()
            .ref(config['internalDb']+'/KBC/'+url)
            .set({
                passCode: passCode,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                correctAnswer: correctAnswer,
                instructor: instructor,
                quizType: quizType,
                emailResponse: emailResponse,

            })
            .then(()=>{
                console.log("Question modified")
            })
    }

    createQuestion =  async (passCode, startTime, endTime, duration, correctAnswer, instructor, quizType) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                correctAnswer: correctAnswer,
                instructor: instructor,
                quizType: quizType,
                emailResponse: false,
            })
            .then(() => {
                console.log('Question created')
            })
    }

}


export default KBC;
