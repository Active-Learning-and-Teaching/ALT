import database from '@react-native-firebase/database';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface QuizData {
  passCode: string;
  startTime: string;
  endTime: string;
  duration: string;
  correctAnswer: string;
  errorRate?: number;
  instructor: string;
  quizType: string;
  emailResponse?: boolean;
  questionCount?: number;
  id?: string; // Add the 'id' property
}

class Quiz {
  coursePasscode: string;
  startTime: string;
  endTime: string;
  duration: string;
  correctAnswer: string;
  instructor: string;
  quizType: string;

  // Initialize the Firebase references
  reference = database().ref('InternalDb/KBC/');
  reference2 = firestore().collection('KBC');

  constructor(
    coursePasscode: string = '',
    startTime: string = '',
    endTime: string = '',
    duration: string = '',
    correctAnswer: string = '',
    instructor: string = '',
    quizType: string = ''
  ) {
    this.coursePasscode = coursePasscode;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = duration;
    this.correctAnswer = correctAnswer;
    this.instructor = instructor;
    this.quizType = quizType;
  }

  async getQuestion(passCode: string): Promise<QuizData | null> {
    let result: QuizData | null = null;
    await this.reference2
      .where('passCode', '==', passCode)
      .get()
      .then((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          result = { ...(doc.data() as QuizData), id: doc.id };
        }
      });
    return result;
  }

  async getTiming(passCode: string): Promise<QuizData | null> {
    let result: QuizData | null = null;
    await this.reference2
      .where('passCode', '==', passCode)
      .get()
      .then((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        if (!snapshot.empty) {
          result = snapshot.docs[0].data() as QuizData;
        }
      });
    return result;
  }

  async setQuestion(
    passCode: string,
    startTime: string,
    endTime: string,
    duration: string,
    correctAnswer: string,
    errorRate: string | undefined,
    instructor: string,
    quizType: string,
    url: string | undefined,
    emailResponse: boolean,
    questionCount: number | undefined
  ): Promise<void> {
    await this.reference2
      .doc(url)
      .set({
        passCode,
        startTime,
        endTime,
        duration,
        correctAnswer,
        errorRate,
        instructor,
        quizType,
        emailResponse,
        questionCount,
      })
      .then(() => {
        console.log('Question modified');
      });
  }

  async createQuestion(
    passCode: string,
    startTime: string,
    endTime: string,
    duration: number,
    correctAnswer: string,
    errorRate: string,
    instructor: string,
    quizType: string
  ): Promise<void> {
    await this.reference2
      .add({
        passCode,
        startTime,
        endTime,
        duration,
        correctAnswer,
        errorRate,
        instructor,
        quizType,
        emailResponse: false,
        questionCount: 1,
      })
      .then(() => {
        console.log('Question created');
      });
  }
}

export default Quiz;
