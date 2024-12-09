import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import React, { useCallback, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import Modal from 'react-native-modal';
import { Alert, SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Dimensions from '../utils/Dimentions';
import { useNavigation } from '@react-navigation/native';
import Faculty from '../database/faculty';
import Student from '../database/student';
import Courses from '../database/courses';

type ProfileOptionsProps = {
    type: 'faculty' | 'student';
};

function ProfileOptions({ type }: ProfileOptionsProps) {
    const navigation = useNavigation();
    const [visible, setVisible] = useState<boolean>(false);
    const [courseList, setCourseList] = useState<Courses[] | Record<string, any>[]>([]);

    const toggleModal = () => {
        setVisible((prev) => !prev);
    };

    const unSubscribeNotifications = () => {
        courseList.forEach((course) => {
            messaging()
                .unsubscribeFromTopic(course.passCode)
                .then(() =>
                    console.log(`Unsubscribed from topic! ${course.passCode}`)
                );
        });
    };

    const getAllCourses = useCallback((currentUser: Student) => {
        firestore()
            .collection('Student')
            .doc(currentUser.url)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    setCourseList([]);
                    const courseUrls = snapshot.data()?.courses || [];
                    const course = new Courses();
                    courseUrls.forEach((url: string) => {
                        course.getCourseByUrl(url).then((courseData) => {
                            setCourseList((prev) => [...prev, courseData]);
                        });
                    });
                }
            });
    }, []);

    const deleteAccount = async () => {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        if (type === 'faculty') {
            const faculty = new Faculty();
            await faculty.setName(currentUser.displayName || '');
            await faculty.setEmail(currentUser.email || '');
            await faculty.setUrl();

            await firebase
                .functions()
                .httpsCallable('deleteFaculty')({
                    key: faculty.url,
                    uid: currentUser.uid,
                })
                .catch((error) => {
                    console.error(
                        'There has been a problem with your fetch operation: ',
                        error
                    );
                });

            console.log(faculty.url);
            console.log('Deleted Account');
        } else if (type === 'student') {
            const student = new Student();
            await student.setName(currentUser.displayName || '');
            await student.setEmail(currentUser.email || '');
            await student.setUrl();

            getAllCourses(student);
            unSubscribeNotifications();

            await firebase
                .functions()
                .httpsCallable('deleteStudent')({
                    key: student.url,
                    userUID: currentUser.uid,
                })
                .catch((error) => {
                    console.error(
                        'There has been a problem with your fetch operation: ',
                        error
                    );
                });

            console.log(student.url);
            console.log('Deleted Account');
        }
    };

    const signOut = async () => {
        auth()
            .signOut()
            .then(() => {
                navigation.navigate('Login' as never);
            })
            .catch((err) => {
                console.error(err.message);
            });
        toggleModal();
    };

    const showAlert = () => {
        Alert.alert(
            'Are you sure you want to delete account?',
            'This will delete all the data associated with the account',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        console.log(auth().currentUser);
                        deleteAccount();
                        toggleModal();
                        navigation.navigate('Login' as never);
                    },
                },
            ]
        );
    };

    return (
        <View>
            <View style={{ padding: 10 }}>
                <Icon
                    name="cog"
                    type="font-awesome"
                    style={{ borderRadius: 1 }}
                    onPress={toggleModal}
                />
            </View>
            <ScrollView keyboardShouldPersistTaps={'always'}>
                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={visible}
                    onBackdropPress={toggleModal}
                    style={{ padding: 10 }}
                    onBackButtonPress={toggleModal}
                    avoidKeyboard
                >
                    <SafeAreaView>
                        <View
                            style={{
                                borderRadius: 10,
                                borderWidth: 5,
                                borderColor: '#FFFFFF',
                                height: Dimensions.window.height / 3,
                            }}
                        >
                            <View style={styles.container}>
                                <Button
                                    buttonStyle={styles.signout}
                                    title="Sign Out"
                                    titleStyle={{ color: 'white', fontWeight: 'normal' }}
                                    onPress={signOut}
                                />
                                <Button
                                    buttonStyle={styles.account}
                                    title="Delete Account"
                                    titleStyle={{ color: 'white', fontWeight: 'normal' }}
                                    onPress={showAlert}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        </View>
    );
}

export default ProfileOptions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fff',
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
