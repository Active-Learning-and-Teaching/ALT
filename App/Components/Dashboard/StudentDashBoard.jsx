import auth from '@react-native-firebase/auth';
import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View, ActivityIndicator} from 'react-native';
import Courses from '../../database/Courses';
import Student from '../../database/Student';
import CourseCard from './CourseCard';
import firestore from '@react-native-firebase/firestore';


function StudentDashBoard({navigation}) {
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
			.collection('Student')
			.doc(currentUser.url)
			.onSnapshot(snapshot => {
				if (!snapshot.empty) {
						setCourseList([]);
					if (snapshot.data().courses && snapshot.data().courses.length) {
						const arr = snapshot.data().courses;
						const course = new Courses();
						for (var i = 0; i < arr.length; i++) {
							course.getCourseByUrl(arr[i]).then(r => {
								setCourseList(prev => [...prev, r]);
							});
						}
					}
				}
			});
	}, []);

	useEffect(() => {
		const onLoad = async () => {
			const curr = await auth().currentUser;
			const student = new Student();
			await student.setName(curr.displayName);
			await student.setEmail(curr.email);
			await student.setUrl();
			setUser(student);
			setCurrentUser(student);
			getAllCourses(student);
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
		<SafeAreaView className="flex-1 bg-transparent">
			<ScrollView>
				<View className="my-2 items-center">
					<Text h2 className="font-bold text-2xl">
						Courses
					</Text>
					{courseList
						.map((item, i) => (
							<CourseCard
								course={item}
								type={'student'}
								user={currentUser}
								navigation={navigation.navigate}
								key={i}
							/>
						))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

export default StudentDashBoard;
