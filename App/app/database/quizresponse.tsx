import database from '@react-native-firebase/database';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import moment from 'moment';

class QuizResponses {
private coursePasscode: string = '';
private userID: string = '';
private userName: string = '';
private answer: string = '';
private timestamp: string = '';

// Reference to the Firestore collection
private reference2: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;

constructor() {
    this.reference2 = firestore().collection('KBCResponse');
}

// Method to get a response based on user ID and passcode
getResponse = async (userID: string, passCode: string): Promise<string | null> => {
    let ans: string | null = null;
    try {
    const snapshot = await this.reference2
        .where('userID_passCode', '==', `${userID}_${passCode}`)
        .get();

    if (!snapshot.empty) {
        const keys = snapshot.docs[0].id;
        ans = keys;
    }
    } catch (error) {
    console.error('Error fetching response:', error);
    }
    return ans;
};

// Method to set a response in the Firestore collection
setResponse = async (
    passCode: string,
    userID: string,
    userName: string,
    answer: string,
    timestamp: string,
    name: string,
    quiz_response_time: string,
    normalised_response_time: string,
    url: string,
    opens: number,
    firstOpen: string
): Promise<void> => {
    try {
    await this.reference2.doc(url).set({
        passCode,
        userID,
        userName,
        userID_passCode: `${userID}_${passCode}`,
        answer,
        timestamp,
        name,
        quiz_response_time,
        normalised_response_time,
        opens,
        firstOpen,
    });
    console.log('Response modified');
    } catch (error) {
    console.error('Error setting response:', error);
    }
};

// Method to create a response in the Firestore collection
createResponse = async (
    passCode: string,
    userID: string,
    userName: string,
    answer: string,
    timestamp: string,
    name: string,
    quiz_response_time: string,
    normalised_response_time: string,
    opens: number,
    firstOpen: string
): Promise<void> => {
    try {
    await this.reference2.add({
        passCode,
        userID,
        userName,
        userID_passCode: `${userID}_${passCode}`,
        answer,
        timestamp,
        name,
        quiz_response_time,
        normalised_response_time,
        opens,
        firstOpen,
    });
    console.log('Response Created');
    } catch (error) {
    console.error('Error creating response:', error);
    }
};

// Method to get all multiple-choice responses within a given time range
getAllMcqResponse = async (
    passCode: string,
    startTime: string,
    endTime: string
): Promise<{ A: number; B: number; C: number; D: number } | null> => {
    let ans: { A: number; B: number; C: number; D: number } | null = null;
    try {
        const snapshot = await this.reference2.where('passCode', '==', passCode).get();
        const list: Record<'A' | 'B' | 'C' | 'D', number> = { A: 0, B: 0, C: 0, D: 0 };
        snapshot.forEach(data => {
        const keys = data.data();
        const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
        const temp1 = moment.utc(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
        const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');
        if (temp1 <= temp2 && temp1 >= temp) {
            const answer = keys['answer'] as 'A' | 'B' | 'C' | 'D';
            if (answer in list) {
            list[answer] += 1;
            }
        }
        });


        ans = list;
    } catch (error) {
        console.error('Error fetching MCQ responses:', error);
    }
    return ans;
};

// Method to get all alphanumeric responses within a given time range
getAllAlphaNumericalResponse = async (
    passCode: string,
    startTime: string,
    endTime: string
): Promise<{ [key: string]: number } | null> => {
    let ans: { [key: string]: number } | null = null;
    try {
    const snapshot = await this.reference2.where('passCode', '==', passCode).get();
    const dict: { [key: string]: number } = {};

    snapshot.forEach((data) => {
        const keys = data.data();
        const temp = moment.utc(startTime, 'DD/MM/YYYY HH:mm:ss');
        const temp1 = moment.utc(keys['timestamp'], 'DD/MM/YYYY HH:mm:ss');
        const temp2 = moment.utc(endTime, 'DD/MM/YYYY HH:mm:ss');

        if (temp1 <= temp2 && temp1 >= temp) {
        let answer = keys['answer']
            .trim()
            .toUpperCase()
            .replace(/,/g, '');

        if (answer in dict) {
            dict[answer] += 1;
        } else {
            dict[answer] = 1;
        }
        }
    });

    ans = dict;
    } catch (error) {
    console.error('Error fetching alphanumeric responses:', error);
    }
    return ans;
};
}

export default QuizResponses;
