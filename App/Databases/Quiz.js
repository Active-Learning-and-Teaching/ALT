import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

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
    reference2 = firestore().collection('KBC');

//    getQuestion  = async (passCode)=> {
//        let ans = null
//        await this.reference
//            .orderByChild("passCode")
//            .equalTo(passCode)
//            .once('value')
//            .then(snapshot => {
//                if (snapshot.val()){
//                    ans = snapshot.val()
//                }
//            })
//        return ans
//    }

    getQuestion = async (passCode) => {
        let ans = null;
        await this.reference2
            .where("passCode", "==", passCode)
            .get()
            .then(snapshot => {
            if (!snapshot.empty) {
                const id = snapshot.docs[0].id;
                ans = {...snapshot.docs[0].data(),id};
            }
        });
        return ans;
    };

//    getTiming  = async (passCode)=> {
//        let ans = null
//        await this.reference
//            .orderByChild("passCode")
//            .equalTo(passCode)
//            .once('value')
//            .then(snapshot => {
//                if (snapshot.val()){
//                    const keys = Object.values(snapshot.val());
//                    console.log("Finding Issues")
//                    console.log(keys);
//                    ans = keys[0]
//                }
//            })
//        return ans
//    }

    getTiming = async (passCode) => {
    let ans = null;
    await this.reference2
        .where("passCode", "==", passCode)
        .get()
        .then(snapshot => {
        if (!snapshot.empty) {
            const keys = snapshot.docs[0].data();
            console.log("Finding Issues");
            console.log(keys);
            ans = keys;
            }
        })

    return ans;
    }


    setQuestion = async (passCode, startTime, endTime, duration, correctAnswer, errorRate, instructor, quizType, url, emailResponse,questionCount) =>{
        // await database()
        //     .ref('InternalDb/KBC/'+url)
        await this.reference2
        .doc(url)
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
        // await this.reference
        //     .push()
        //     .set({
        await this.reference2
            .add({
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
