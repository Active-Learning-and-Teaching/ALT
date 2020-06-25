import database from '@react-native-firebase/database';
import * as config from '../config';

class KBC {

    coursePasscode :string
    startTime :string
    endTime : string
    duration : string
    correctAnswer : string
    instructor : string

    constructor() {
    }


    reference = database().ref(config['internalDb']+'/KBC/')

    createQuestion =  async (passCode, startTime, endTime, duration, correctAnswer, instructor) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                correctAnswer: correctAnswer,
                instructor: instructor
            })
            .then(() => {
                console.log('Data added')
            })
    }

}


export default KBC;
