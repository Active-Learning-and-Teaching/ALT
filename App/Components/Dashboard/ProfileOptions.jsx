import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import React, {useCallback, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import Modal from 'react-native-modal';
import {Alert, SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';
import {Button,Icon} from 'react-native-elements';
import Dimensions from '../../utils/Dimensions';
import { useNavigation } from '@react-navigation/native';
import Faculty from '../../database/Faculty';
import Student from '../../database/Student';
import Courses from '../../database/Courses';

function ProfileOptions({type}) {

    const navigation = useNavigation();
    const [visible, setVisible] = useState(false)
    const [courseList, setCourseList] = useState([]);

    const toggleModal = () =>{
        setVisible(prev=>!prev)
    };


    const unSubscribe_Notifications = () => {
		for (let i = 0; i < courseList.length; i++) {
			messaging()
				.unsubscribeFromTopic(courseList[i].passCode)
				.then(() =>
					console.log(`Unsubscribed to topic! ${courseList[i].passCode}`),
				);
		}
	};

    const getAllCourses = useCallback((currentUser) => {
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

    const deleteAccount = async () => {
		if(type=="faculty"){
            const curr = await auth().currentUser;
			const faculty = new Faculty();
			await faculty.setName(curr.displayName);
			await faculty.setEmail(curr.email);
			await faculty.setUrl();

            const {data} = firebase
			.functions()
			.httpsCallable('deleteFaculty')({
				key: faculty.url,
				uid: auth().currentUser.uid,
			})
			.catch(function(error) {
				console.log(
					'There has been a problem with your fetch operation: ' + error,
				);
			});

            console.log(faculty.url);
            console.log('Deleted Account');
        }

        if(type=="student"){

            const curr = await auth().currentUser;
			const student = new Student();
			await student.setName(curr.displayName);
			await student.setEmail(curr.email);
			await student.setUrl();

            getAllCourses(student);
            unSubscribe_Notifications();
            
            const {data} = firebase
                .functions()
                .httpsCallable('deleteStudent')({
                    key:student.url,
                    userUID: auth().currentUser.uid,
                })
                .catch(function(error) {
                    console.log(
                        'There has been a problem with your fetch operation: ' + error,
                    );
                });


            console.log(student.url);
            console.log('Deleted Account');
        }
	};

    const signOut = async () => {
		auth()
			.signOut()
			.then(async r => {
				navigation.navigate('Login');
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
        toggleModal()
	};

    const showAlert = () => {
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
						console.log(auth().currentUser);

						deleteAccount();
                        toggleModal()

						navigation.navigate('Login');
					},
				},
			],
		);
	};

    return (
        <View>
            <View style={{padding:10}}>
                <Icon 
                    name='cog' 
                    type='font-awesome' 
                    style={{borderRadius:1}} 
                    onPress={toggleModal} 
                />
            </View>
            <ScrollView keyboardShouldPersistTaps={'always'}>
                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={visible}
                    onBackdropPress = {toggleModal}
                    style={{padding:10}}
                    onBackButtonPress= {toggleModal}
                    avoidKeyboard>
                    <SafeAreaView>
                        <View 
                            style={{borderRadius:10,borderWidth:5,borderColor:'#FFFFFF',height:Dimensions.window.height/3}}>
                            <View style={styles.container}>
                                <Button
                                    buttonStyle={styles.signout}
                                    title="Sign Out"
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    onPress={signOut}
                                />
                                <Button
                                    buttonStyle={styles.account}
                                    title="Delete Account"
                                    titleStyle={{color: 'white', fontWeight: 'normal'}}
                                    onPress={showAlert}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        </View>
    )
}

export default ProfileOptions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: '#fff'
    },
	signout: {
		backgroundColor: 'tomato',
		borderColor: 'black',
		borderRadius: 20,
		marginTop: 20,
		marginBottom: 20,
		marginLeft: 50,
		marginRight: 50,
	},
	account: {
		backgroundColor: '#333',
		borderColor: 'black',
		borderRadius: 20,
		marginTop: 30,
		marginBottom: 20,
		marginLeft: 50,
		marginRight: 50,
	},
});