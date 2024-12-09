import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, Text, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import Dimensions from '../utils/Dimentions';
import { CoursePics } from '../utils/coursePics';
import Courses from '../database/courses';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/functions';
import { ImageSourcePropType } from 'react-native';

interface User {
    deleteCourse: (passCode: string, value?: any) => Promise<void>;
}

interface Course {
    courseCode: string;
    courseName: string;
    passCode: string;
    imageURL: string;
    instructor: string;
}

interface CourseCardProps {
    type: 'faculty' | 'student';
    user: User;
    course: Course;
}

function CourseCard({ type, user, course }: CourseCardProps) {
    const navigation = useNavigation<any>();
    const [image, setImage] = useState<string>('');
    const [courseState, setCourseState] = useState<Course>(course);
    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheet = () => {
        showActionSheetWithOptions(
            {
                title: type === 'faculty' ? 'Do you want to remove this course ?' : 'Do you want to leave this course ?',
                options: type === 'faculty' ? ['Email Course Details', 'Remove Course', 'Cancel'] : ['Leave Course', 'Cancel'],
                cancelButtonIndex: type === 'faculty' ? 2 : 1,
                destructiveButtonIndex: type === 'faculty' ? 1 : 0,
            },
            async (selectedIndex) => {
                if (type === 'faculty') {
                    if (selectedIndex === 0) emailCourseDetails();
                    else if (selectedIndex === 1) showAlert();
                } else if (selectedIndex === 0) showAlert();
            }
        );
    };

    const getImage = () => {
        setImage(CoursePics(courseState.imageURL));
        console.log('Image URL: ', image);
    };

    const emailCourseDetails = async () => {
        console.log('triggering mail for passCode:' + courseState.passCode);
        try {
            const { data } = await firebase.functions().httpsCallable('mailingSystem')({ passCode: courseState.passCode, type: 'Course' });
        } catch (error) {
            console.log('There has been a problem with your mail operation: ' + error);
        }
    };

    const showAlert = () => {
        if (type === 'faculty') {
            Alert.alert(
                'Are you sure you want to remove course ' + courseState.courseName + ' ?',
                'This action is irreversible!',
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
                        onPress: async () => {
                            const courses = new Courses();
                            await emailCourseDetails().then(() => console.log('Mail Sent'));
                            await courses.getCourse(courseState.passCode).then(async (value) => {
                                await user.deleteCourse(courseState.passCode, value).then(() => console.log('Deleted Course'));
                            });
                        },
                    },
                ]
            );
        } else {
            Alert.alert(
                'Are you sure you want to leave course ' + courseState.courseName + ' ?',
                '',
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
                        onPress: async () => {
                            const courses = new Courses();
                            await courses.getCourse(course.passCode).then(async (value) => {
                                await user.deleteCourse(value).then(() => console.log('Deleted Course'));
                            });
                        },
                    },
                ]
            );
        }
    };

    useEffect(() => {
        getImage();
    }, []);

    return (
        <ImageBackground
            style={styles.container}
            source={image as ImageSourcePropType}
            loadingIndicatorSource={require('../../assets/LoadingImage.jpg')}
            borderRadius={20}
        >
            <Avatar
                onPress={()=>
                    navigation.navigate('Course', {
                         type : type,
                         user : user,
                         course : courseState,
                         setCourse : setCourseState,
                 })}
                onLongPress={() => {
                    showActionSheet();
                }}
                title={courseState.courseCode + ' ' + courseState.courseName}
                titleStyle={styles.avatarTitle}
                containerStyle={styles.avatarContainer}
                activeOpacity={0.2}
            />
            <Text style={styles.instructorText}>{courseState.instructor}</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.window.width - 20,
        height: Dimensions.window.height / 3.5,
        marginVertical: 2,
        paddingVertical: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
    },
    avatarTitle: {
        textAlign: 'left',
        position: 'absolute',
        left: 15,
        top: 0,
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: Dimensions.window.width - 20,
        height: Dimensions.window.height / 6,
        margin: 6,
        borderRadius: 25,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
    },
    instructorText: {
        position: 'absolute',
        left: 5,
        bottom: 5,
        fontSize: 18,
        color: 'white',
    },
});

export default CourseCard;
