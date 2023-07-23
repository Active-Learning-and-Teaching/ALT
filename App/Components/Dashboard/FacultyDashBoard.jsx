import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native'
import Courses from '../../Databases/Courses';
import Faculty from '../../Databases/Faculty';
import CourseCard from './CourseCard';

function FacultyDashBoard({navigation}) {
	const route = useRoute();
	const {setUser} = route.params;
	const [currentUser, setCurrentUser] = useState(null);
	const [courseList, setCourseList] = useState([]);
	const [loading,setLoading] = useState(false)

	useEffect(()=>{
		const unsubscribe = navigation.addListener('focus', () => {
			setLoading(true);
			setTimeout(() => {
				setLoading(false);
			}, 2000);
		});
		return unsubscribe;
	},[navigation])

	const getAllCourses = useCallback(currentUser => {
		firestore()
			.collection('Faculty')
			.doc(currentUser.url)
			.onSnapshot(snapshot => {
				if (!snapshot.empty) {
						setCourseList([]);
					if (snapshot.data().courses && snapshot.data().courses.length) {
						const arr = snapshot.data().courses;
						const course = new Courses();
						for (var i = 0; i < arr.length; i++) {
							course.getCourseByUrl(arr[i]).then(r => {
								if(r){
									if (!('quizEmail' in r)) r.quizEmail = currentUser.email;

									if (!('feedbackEmail' in r))
										r.feedbackEmail = currentUser.email;
	
									if (!('defaultEmailOption' in r)) r.defaultEmailOption = true;
									setCourseList(prev => [...prev, r]);
								}   
							});
						}
					}
				}
			});
	}, []);

	useEffect(() => {
		const onLoad = async () => {
			const curr = await auth().currentUser;
			const faculty = new Faculty();
			await faculty.setName(curr.displayName);
			await faculty.setEmail(curr.email);
			await faculty.setUrl();
			setCurrentUser(faculty);
			getAllCourses(faculty);
			setUser(faculty);
		};

		onLoad();
	}, []);

	if(loading){
		return(
			<View className="absolute inset-0 flex items-center justify-center w-screen h-screen bg-white">
				<ActivityIndicator size="large" color="#9E9E9E"/>
			</View>
		)
	}

	return (
		<SafeAreaView className="flex-1 bg-transparent ">
			<ScrollView>
				<View className="mt-2 mb-2 pb-2 pt-2 items-center">
					{courseList.map((item, i) => (
							<CourseCard
								course={item}
								type={'faculty'}
								user={currentUser}
								navigation={navigation.navigate}
								key={i}
							/>
						)
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

export default FacultyDashBoard;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 35,
		backgroundColor: '#fff',
	},
	textStyle: {
		fontSize: 15,
		marginBottom: 20,
	},
	buttonMessage: {
		paddingTop: 10,
		marginTop: 15,
	},
	signout: {
		backgroundColor: 'tomato',
		borderColor: 'black',
		borderRadius: 20,
		marginTop: 20,
		marginBottom: 20,
		marginLeft: 100,
		marginRight: 100,
	},
	account: {
		backgroundColor: '#333',
		borderColor: 'black',
		borderRadius: 20,
		marginTop: 30,
		marginBottom: 20,
		marginLeft: 100,
		marginRight: 100,
	},
	create: {
		backgroundColor: 'tomato',
		borderColor: 'black',
		borderRadius: 20,
		marginTop: 20,
		marginBottom: 20,
		marginLeft: 100,
		marginRight: 100,
	},
});
