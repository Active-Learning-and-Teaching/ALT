import React, { useState } from 'react';
import { Icon } from 'react-native-elements';
import { View, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import FormAddCourse from './FormAddCourse';
import StudentAddCourseForm from './StudentAddCourseForm';
import AnnouncementsAdd from '../Announcement/AnnouncementsAdd';

function CourseAdd({type, instructor, student, course}) {

    const [visible, setVisible] = useState(false)
    const toggleModal = () =>{
        setVisible(prev=>!prev)
    };

    return (
        <View>
            <View style={{padding:10}}>
                {
                Platform.OS==='ios'?
                <Icon 
                    name='plus' 
                    type='font-awesome' 
                    style={{borderRadius:1}} 
                    onPress={toggleModal} 
                />:
                <Icon 
                    name='plus' 
                    type='font-awesome' 
                    style={{borderRadius:1, padding:10}}
                    onPress={toggleModal} 
                />
                }
            </View>
            <ScrollView keyboardShouldPersistTaps={'always'}>
                <Modal
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={visible}
                    onBackdropPress = {toggleModal}
                    onBackButtonPress= {toggleModal}
                    avoidKeyboard>
                    <View 
                        className="flex-1 flex bg-white max-h-screen/1.6 max-w-screen-2xl my-12 mx-5">
                        { 
                            type==="faculty"?
                            <FormAddCourse toggle={toggleModal} instructor = {instructor} />:
                            type==="student"?
                            <StudentAddCourseForm student = {student} toggle={toggleModal}/>:
                            <AnnouncementsAdd course = {course} toggle={toggleModal}/>
                        }
                    </View>
                </Modal>
            </ScrollView>
        </View>
    )
}

export default CourseAdd