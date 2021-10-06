import database from '@react-native-firebase/database';

class Quiz {

    coursePasscode :string
    startTime :string
    endTime : string
    duration : string
    correctAnswer : string
    instructor : string
    quizType : string

    constructor() {
    }


    reference = database().ref('InternalDb/KBC/')

    getQuestion  = async (passCode)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    ans = snapshot.val()
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


    setQuestion = async (passCode, startTime, endTime, duration, correctAnswer, errorRate, instructor, quizType, url, emailResponse,questionCount) =>{
        await database()
            .ref('InternalDb/KBC/'+url)
            .set({
                passCode: passCode,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                correctAnswer: correctAnswer,
                errorRate: errorRate,
                instructor: instructor,
                quizType: quizType,
                emailResponse: emailResponse,
                questionCount: questionCount

            })
            .then(()=>{
                console.log("Question modified")
            })
    }

    createQuestion =  async (passCode, startTime, endTime, duration, correctAnswer, errorRate, instructor, quizType) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                correctAnswer: correctAnswer,
                errorRate: errorRate,
                instructor: instructor,
                quizType: quizType,
                emailResponse: false,
                questionCount : 1,
            })
            .then(() => {
                console.log('Question created')
            })
    }

}


export default Quiz;
