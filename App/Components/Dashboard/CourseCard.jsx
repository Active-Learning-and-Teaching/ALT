import React, {useState,useEffect} from 'react';
import {StyleSheet, ImageBackground, Text, Alert} from 'react-native';
import {Avatar} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import {CoursePics} from '../../Utils/CoursePics';
import Courses from '../../Databases/Courses';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import {firebase} from '@react-native-firebase/functions';

function CourseCard({type,user,course}) {
    console.log("inside working course card", course);
    const navigation = useNavigation();
    const [image,setImage] = useState("")
    const [courseState,setCourseState] = useState(course)
    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheet = () => {
        showActionSheetWithOptions({
            title:type==="faculty" ?
                    'Do you want to remove this course ?' :
                    'Do you want to leave this course ?',
            options:type==="faculty" ?
                    ['Email Course Details','Remove Course', 'Cancel'] :
                    ['Leave Course', 'Cancel'],
            cancelButtonIndex:type==="faculty"?2:1,
            destructiveButtonIndex:type==="faculty"?1:0,
        }, 
        async (selectedIndex) => {
            if(type==="faculty"){
                if(selectedIndex===0)
                    emailCourseDetails()
                else if(selectedIndex===1)
                    showAlert();
            }
            else if(selectedIndex===0)
                showAlert();
        });
    };

    const getImage = () =>{
        setImage(CoursePics(courseState.imageURL))
    }

    const emailCourseDetails = async () => {
        console.log('triggering mail for passCode:' + courseState.passCode)
        Toast.show('Sending Email...');
        const { data } = firebase.functions().httpsCallable('mailingSystem')({passCode:courseState.passCode, type:"Course"})
        .catch(function(error) {console.log('There has been a problem with your mail operation: ' + error);})
    }

    const showAlert = () =>{
        if (type==="faculty"){
            Alert.alert(
                'Are you sure you want to remove course '+courseState.courseName + " ?",
                'This action is irreversible!',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {console.log('Cancel Pressed')},
                        style: 'cancel',
                    },
                    {
                        text: 'Confirm',
                        onPress: async () => {
                            const courses = new Courses()
                            await emailCourseDetails().then(r=>
                                Toast.show('Deleting Course...')
                            )
                            await courses.getCourse(courseState.passCode)
                            .then(async value => {
                                await user.deleteCourse(courseState.passCode,value)
                                    .then(r => console.log("Deleted Course"))
                            })
                        }
                    },
                ]
            )
        }
        else{
            Alert.alert(
                'Are you sure you want to leave course '+courseState.courseName + " ?",
                '',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {console.log('Cancel Pressed')},
                        style: 'cancel',
                    },
                    {
                        text: 'Confirm',
                        onPress: async () => {
                            const courses = new Courses()
                            await courses.getCourse(course.passCode)
                            .then(async value => {
                                await user.deleteCourse(value)
                                    .then(r => Toast.show('Course Successfully Deleted'))
                            })
                        }
                    },
                ]
            )
        }
    }

    useEffect(() => {
        getImage()
    },[])

    return(
        <ImageBackground
            className='flex-1 w-[calc(100%-20px)] h-[calc(100vh/3.5)] my-2 py-2 shadow-md'
            source={image}
            loadingIndicatorSource={require('../../Assets/LoadingImage.jpg')}
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
                onLongPress={()=>{showActionSheet()}}
                title = {courseState.courseCode + " "+ courseState.courseName}
                titleStyle={{
                    textAlign: 'left',
                    position: 'absolute',
                    left: 15,
                    top: 0,
                    fontSize: 20,
                    fontWeight : "bold",
                }}
                containerStyle={{
                    width : Dimensions.window.width-20,
                    height : Dimensions.window.height/(6),
                    margin: 6,
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.05,
                    borderRadius: 25,
                }}
                activeOpacity={0.2}
            />
            <Text 
                className='absolute left-5 bottom-5 text-18 text-white'>
                {courseState.instructor}
            </Text>
        </ImageBackground>
    )
}

export default CourseCard