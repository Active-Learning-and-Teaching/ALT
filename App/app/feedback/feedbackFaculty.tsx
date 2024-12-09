// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, ToastAndroid, ActivityIndicator } from 'react-native';
// import { firebase } from '@react-native-firebase/functions';
// import FeedbackForm from './feedback';
// import FeedbackResultsList from './FeedbackResultsList';
// import CountdownTimer from './CountdownTimer';
// import feedback from './feedback';

// interface FeedbackDetails {
//   course: string;
//   user: string;
//   emailSent: boolean;
// }

// type FeedbackFacultyPageProps = {};

// const FeedbackFacultyPage: React.FC<FeedbackFacultyPageProps> = () => {
//   const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetails | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [resultPage, setResultPage] = useState<boolean>(false);
//   const [emailSent, setEmailSent] = useState<boolean>(false);

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     try {
//       const details = await feedback.getFeedbackDetails();
//       setFeedbackDetails(details);
//       setEmailSent(details.emailSent);
//     } catch (error) {
//       ToastAndroid.show('Error loading feedback details.', ToastAndroid.SHORT);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkEmailSent = async () => {
//     try {
//       const emailStatus = await feedback.checkEmailSent();
//       setEmailSent(emailStatus);
//       if (!emailStatus) {
//         await dbUpdateEmailStatus();
//       }
//     } catch (error) {
//       ToastAndroid.show('Error checking email status.', ToastAndroid.SHORT);
//     }
//   };

//   const dbUpdateEmailStatus = async () => {
//     try {
//       await feedback.updateEmailSent();
//       setEmailSent(true);
//       ToastAndroid.show('Email status updated.', ToastAndroid.SHORT);
//     } catch (error) {
//       ToastAndroid.show('Error updating email status.', ToastAndroid.SHORT);
//     }
//   };

//   const FeedbackMailer = async () => {
//     try {
//       await firebase.functions().httpsCallable('sendFeedbackEmail')();
//       ToastAndroid.show('Feedback email sent successfully.', ToastAndroid.SHORT);
//     } catch (error) {
//       ToastAndroid.show('Error sending feedback email.', ToastAndroid.SHORT);
//     }
//   };

//   const sendHTTPTrigger = async (url: string) => {
//     try {
//       const response = await feedback.triggerHTTP(url);
//       ToastAndroid.show(`HTTP Trigger Response: ${response}`, ToastAndroid.SHORT);
//     } catch (error) {
//       ToastAndroid.show('Error sending HTTP trigger.', ToastAndroid.SHORT);
//     }
//   };

//   const startFeedback = async (action: 'start' | 'stop' | 'delay') => {
//     try {
//       await feedback.start(action);
//       ToastAndroid.show(`Feedback ${action}ed successfully.`, ToastAndroid.SHORT);
//     } catch (error) {
//       ToastAndroid.show(`Error ${action}ing feedback.`, ToastAndroid.SHORT);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {!resultPage ? (
//         <View>
//           <Text style={styles.title}>Feedback Faculty Page</Text>
//           <FeedbackForm feedbackDetails={feedbackDetails} />
//           <CountdownTimer startFeedback={startFeedback} />
//           <Button title="Check Email Status" onPress={checkEmailSent} />
//           <Button title="Send Feedback Email" onPress={FeedbackMailer} />
//           <Button
//             title="View Results"
//             onPress={() => setResultPage(true)}
//           />
//         </View>
//       ) : (
//         <FeedbackResultsList
//           feedbackDetails={feedbackDetails}
//           setResultPage={() => setResultPage(false)}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });

// export default FeedbackFacultyPage;
