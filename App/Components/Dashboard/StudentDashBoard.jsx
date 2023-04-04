import React, {useState,useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {View, Alert, ScrollView, SafeAreaView, Text} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import CourseCard from './CourseCard';
import Student from '../../Databases/Student';
import Courses from '../../Databases/Courses';
import {firebase} from '@react-native-firebase/functions';
import {CommonActions, useRoute} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {Button} from 'react-native-elements';

function StudentDashBoard({navigation:{navigate}}) {
	const route = useRoute()
	const {setUser} = route.params
	const [currentUser,setCurrentUser] = useState(null)
	const [courseList,setCourseList] = useState([])
	const [TAcourseList,setTAcourseList] = useState([])

	const unSubscribe_Notifications = () => {
			for (let i = 0; i < courseList.length; i++) {
				messaging()
					.unsubscribeFromTopic(courseList[i].passCode)
					.then(() =>
						console.log(
							`Unsubscribed to topic! ${courseList[i].passCode}`,
						),
					);
			}
		};

	const deleteAccount = async (url, uid) => {
		//Unsubscribing to notification and then calling the delete end point of the Cloud Function.
		unSubscribe_Notifications();
		const {data} = firebase
			.functions()
			.httpsCallable('deleteStudent')({
				key: url,
				userUID: uid,
			})
			.catch(function(error) {
				console.log(
					'There has been a problem with your fetch operation: ' + error,
				);
			});
		console.log(currentUser.url);
		console.log('Deleted Account');
	};

	const showAlert = () =>{
		Alert.alert(
			'Are you sure you want to delete account?',
			'This will delete all the data associated with the account',
			[
				{
					text: 'Cancel',
					onPress: () => {
						console.log('Cancel Pressed');
					},
					style: 'cancel',
				},
				{
					text: 'Confirm',
					onPress: () => {
						const studenURL = currentUser.url;
						const uid = auth().currentUser.uid;
						console.log(auth().currentUser);
						deleteAccount(studenURL, uid);
						navigate.dispatch(
							CommonActions.reset({
								index: 1,
								routes: [{name: 'Login'}],
							}),
						);
					},
				},
			],
		);
	}

	const signOut = async () => {
		// Unsubcribing to notifications before signout
		unSubscribe_Notifications();
		auth()
			.signOut()
			.then(async r => {
				await navigate.dispatch(
					CommonActions.reset({
						index: 1,
						routes: [{name: 'Login'}],
					}),
				);

				try {
					await GoogleSignin.revokeAccess();
					await GoogleSignin.signOut();
				} catch (err) {
					console.log(err);
				}
			})
			.catch(err => {
				console.log(err.message);
			});
	};

	const getAllCourses = (currentUser) => {
		database()
			.ref('InternalDb/Student/' + currentUser.url)
			.on('value', snapshot => {
				if (snapshot.val()) {
					const keys = Object(snapshot.val());
					setCourseList([]) 
					if ('courses' in keys) {
						const arr = snapshot.val()['courses'].filter(n => n);
						const course = new Courses();
						for (var i = 0; i < arr.length; i++) {
							course.getCourseByUrl(arr[i]).then(r => {
								setCourseList(prev=>[...prev,r]);
								messaging()
									.subscribeToTopic(r.passCode)
									.then(() =>
										console.log(`Subscribed to topic! ${r.passCode}`),
									);
							});
						}
					}
				}
			});
	};

	const getAllTACourses = (currentUser) => {
		database()
			.ref('InternalDb/Student/' + currentUser.url)
			.on('value', snapshot => {
				if (snapshot.val()) {
					const keys = Object(snapshot.val());
					if ('courses' in keys) {
						const arr = snapshot.val()['tacourses'].filter(n => n);
						const course = new Courses();
						setTAcourseList([])
						for (var i = 0; i < arr.length; i++) {
							course.getCourseByUrl(arr[i]).then(r => {
								messaging()
								.subscribeToTopic(r.passCode)
								.then(() =>
								console.log(`Subscribed to topic! ${r.passCode}`),
								);
								setTAcourseList(prev=>[...prev,r]);
							});
						}
					}
				}
			});
	};

	useEffect(() => {	
		const onLoad = async() =>{
			const curr = await auth().currentUser;
			const student = new Student();
			await student.setName(curr.displayName);
			await student.setEmail(curr.email);
			await student.setUrl()
			setCurrentUser(student)
			getAllCourses(student);
			getAllTACourses(student);
			setUser(student)
		}

		onLoad()
	},[])

	return (
		<SafeAreaView className='flex-1 bg-transparent'>
			<ScrollView>
				<View className='my-2 items-center '>
					<Text 
						h2 
						className='font-bold text-2xl'>
						Courses
					</Text>
							{courseList.filter(item=>!TAcourseList.includes(item))
																.map((item, i) => (
						<CourseCard
							course={item}
							type={'student'}
							user={currentUser}
							navigation={navigate}
							key={i}
						/>
				))}
				</View>

				<View className='my-3 items-center '>
					<Text 
						h2 
						className='font-bold text-2xl'>
						TA Courses
					</Text>
					{TAcourseList.map((item, i) => (
						<CourseCard
							course={item}
							type={'student'}
							user={currentUser}
							navigation={navigate}
							key={i}
						/>
					))}
				</View>

				<Button
					buttonStyle={{
						backgroundColor:'tomato',
						borderRadius: 20,
						marginVertical: 20,
						marginHorizontal: 100,
					}}
					titleStyle={{
						color: 'white', 
						fontWeight: 'normal'
					}}
					title="Sign Out"
					onPress={signOut}
				/>
				<Button
					buttonStyle={{
						backgroundColor: '#333',
						borderRadius: 20,
						marginVertical: 20,
						marginHorizontal: 100,
					}}
					titleStyle={{
						color: 'white',
						fontWeight: 'normal'}}
					title="Delete Account"
					onPress={() => showAlert()}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

export default StudentDashBoard
