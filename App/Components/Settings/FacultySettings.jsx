import React, {useState} from 'react';
import {Button} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Courses from '../../Databases/Courses';
import { useRoute } from '@react-navigation/native';
import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Switch,
} from 'react-native';

function FacultySettings() {

	const routes = useRoute()
	const {course,setCourse} = routes.params
	const [error,setError] = useState(null)
	const [defaultEmailOption,setDefaultEmailOption] = useState(course.defaultEmailOption)
	const [quizEmail,setQuizEmail] = useState(course.quizEmail)
	const [feedbackEmail,setFeedbackEmail] = useState(course.feedbackEmail)


	const setData = async (data) => {
		if (quizEmail === '' || feedbackEmail === '') 
			setError('Enter details.')
		else {
			setError(null)
			const coursesObj = new Courses();
			await coursesObj.getCourse(course.passCode).then(url => {
				coursesObj.setCourseData(
					course.courseName,
					course.courseCode,
					course.room,
					course.passCode,
					course.instructors,
					course.imageURL,
					course.instructor,
					quizEmail,
					feedbackEmail,
					defaultEmailOption,
					url,
				);

				course.quizEmail = quizEmail;
				course.feedbackEmail = feedbackEmail;
				course.defaultEmailOption = defaultEmailOption;
				setCourse(course).then(r => {
					data === 'email'
						? Toast.show('Updated Email Settings')
						: Toast.show(`Updated ${course.courseName} Settings`);
				});
			});
		}
	};

	const toggleSwitch = async () => {
		setDefaultEmailOption(prev => !prev)
		await setData('email')
	};

	return (
		<SafeAreaView style={styles.safeContainer}>
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.toggleButtonView}>
						<Text style={styles.toggleText}>Email Responses</Text>
						<Switch
							trackColor={{false: '#767577', true: 'tomato'}}
							thumbColor={
							defaultEmailOption ? '#f4f3f4' : '#f4f3f4'
							}
							ios_backgroundColor="#3e3e3e"
							onValueChange={toggleSwitch}
							value={defaultEmailOption}
						/>
					</View>
					<Text style={styles.text}>Email for Quiz Results</Text>
					<TextInput
						caretHidden
						style={styles.textInput}
						autoCapitalize="none"
						textAlign={'center'}
						onChangeText={text => setQuizEmail(text)}
						value={quizEmail}
					/>
					<Text style={styles.text}>Email for Feedback Results</Text>
					<TextInput
						caretHidden
						style={styles.textInput}
						autoCapitalize="none"
						textAlign={'center'}
						onChangeText={text => setFeedbackEmail(text)}
						value={feedbackEmail}
					/>
					{error ? (
					<Text style={styles.errorMessage}>{error}</Text>
					) : (
					<Text />
					)}

					<Button
						style={styles.buttonMessage}
						buttonStyle={styles.mybutton}
						titleStyle={{color: 'white', fontWeight: 'normal'}}
						title="Update Settings"
						onPress={() => setData('completeData')}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default FacultySettings

const styles = StyleSheet.create({
  safeContainer: {
	flex: 1,
	backgroundColor: 'transparent',
  },
  container: {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	padding: 35,
  },
  toggleButtonView: {
	flex: 1,
	flexDirection: 'row',
	justifyContent: 'flex-end',
	alignItems: 'center',
	paddingTop: 30,
  },
  toggleText: {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	fontSize: 25,
	fontWeight: 'bold',
	color: '#333',
	textAlign: 'center',
  },
  textInput: {
	color: 'black',
	width: '100%',
	paddingTop: 15,
	paddingBottom: 5,
	alignSelf: 'center',
	borderColor: '#ccc',
	borderBottomWidth: 1,
	fontSize: 20,
  },
  text: {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	paddingTop: 55,
	padding: 15,
	fontSize: 20,
	fontWeight: 'bold',
	color: '#333',
	marginTop: 25,
	textAlign: 'center',
  },
  errorMessage: {
	color: 'red',
	marginBottom: 15,
	paddingTop: 10,
	paddingBottom: 10,
  },
  buttonMessage: {
	marginTop: 30,
	paddingTop: 20,
	marginBottom: 30,
	paddingBottom: 20,
  },
  mybutton: {
	backgroundColor: 'tomato',
	borderColor: 'black',
	borderRadius: 20,
	marginTop: 30,
	marginBottom: 30,
  },
});
