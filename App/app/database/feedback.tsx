import firestore from '@react-native-firebase/firestore';

class Feedback {
  private coursePasscode: string = '';
  private startTime: string = '';
  private endTime: string = '';
  private instructor: string = '';

  constructor() {}

  reference = firestore().collection('Feedback');

  /**
   * Retrieves feedback by passCode.
   * @param passCode - The passcode of the course.
   * @returns The feedback object including its document ID.
   */
  getFeedback = async (passCode: string): Promise<{ [key: string]: any } | null> => {
    let ans: { [key: string]: any } | null = null;
    console.log('Fetching feedback...');
    await this.reference
      .where('passCode', '==', passCode)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const id = snapshot.docs[0].id;
          ans = { ...snapshot.docs[0].data(), id };
          console.log('getFeedback result:', ans);
        }
      });
    return ans;
  };

  /**
   * Retrieves detailed feedback by passCode.
   * @param passCode - The passcode of the course.
   * @returns The feedback details object.
   */
  getFeedbackDetails = async (
    passCode: string,
    timeout: number = 10 // Optional timeout in milliseconds
  ): Promise<{ [key: string]: any } | null> => {
    let ans: { [key: string]: any } | null = null;
    console.log('Fetching feedback details...');
    
    // Create a promise that resolves the feedback or times out
    const fetchPromise = new Promise<{ [key: string]: any } | null>((resolve, reject) => {
      this.reference
        .where('passCode', '==', passCode)
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            console.log('Feedback details:', data);
            resolve(data);
          } else {
            console.warn('No feedback found for the given passCode.');
            resolve(null); // No feedback found
          }
        })
        .catch((error) => {
          console.error('Error fetching feedback:', error);
          reject(error); // Reject the promise in case of errors
        });
    });
  
    // Create a timeout promise
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => {
        console.warn('Fetching feedback details timed out.');
        resolve(null);
      }, timeout)
    );
  
    // Use Promise.race to ensure the function resolves/rejects within the timeout
    ans = await Promise.race([fetchPromise, timeoutPromise]);
    console.log(ans);
    
    return ans;
  };
  

  /**
   * Updates or creates feedback data in the database.
   * @param passCode - The passcode of the course.
   * @param startTime - The start time of the feedback session.
   * @param endTime - The end time of the feedback session.
   * @param kind - The kind of feedback.
   * @param instructor - The instructor's name.
   * @param url - The document URL for the feedback.
   * @param emailResponse - Whether email responses are enabled.
   * @param feedbackCount - The count of feedback submissions.
   * @param summary - Optional summary of the feedback.
   */
  setFeedback = async (
    passCode: string,
    startTime: string,
    endTime: string,
    kind: string,
    instructor: string,
    url: string,
    emailResponse: boolean,
    feedbackCount: number,
    summary?: string
  ): Promise<void> => {
    const feedbackData: { [key: string]: any } = {
      passCode,
      startTime,
      endTime,
      kind,
      instructor,
      emailResponse,
      feedbackCount,
    };

    if (summary) {
      feedbackData.summary = summary;
    }

    await this.reference
      .doc(url)
      .set(feedbackData)
      .then(() => {
        console.log('Feedback modified');
      });
  };

  /**
   * Creates a new feedback document in the database.
   * @param passCode - The passcode of the course.
   * @param startTime - The start time of the feedback session.
   * @param endTime - The end time of the feedback session.
   * @param kind - The kind of feedback.
   * @param instructor - The instructor's name.
   */
  createFeedback = async (
    passCode: string,
    startTime: string,
    endTime: string,
    kind: string,
    instructor: string
  ): Promise<void> => {
    await this.reference
      .add({
        passCode,
        startTime,
        endTime,
        kind,
        instructor,
        emailResponse: false,
        feedbackCount: 1,
      })
      .then(() => {
        console.log('Feedback created');
      });
  };
}

export default Feedback;
