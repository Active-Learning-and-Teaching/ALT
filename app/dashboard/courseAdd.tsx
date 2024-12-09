import React, { useState } from 'react';
import { Icon } from 'react-native-elements';
import { SafeAreaView, View, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import FormAddCourse from './formAddCourse';
import StudentAddCourseForm from './studentAddCourseForm';
import AnnouncementsAdd from '../announcement/announcementsAdd';
import Dimensions from '../utils/Dimentions';
import Courses from '../database/courses';

interface User {
    id: string;
    name: string;
    email: string;
}

interface CourseAddProps {
  type: 'faculty' | 'student' | 'course';
  instructor?: string | any; // Instructor name or details, optional based on type
  student: User | any; // Student name or details, optional based on type
  course?: Courses | any; // Course details, optional based on type
}

const CourseAdd: React.FC<CourseAddProps> = ({ type, instructor, student, course }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleModal = () => {
    setVisible(prev => !prev);
  };

  return (
    <View>
      <View style={{ padding: 10 }}>
        {Platform.OS === 'ios' ? (
          <Icon 
            name="plus" 
            type="font-awesome" 
            style={{ borderRadius: 1 }} 
            onPress={toggleModal} 
          />
        ) : (
          <Icon 
            name="plus" 
            type="font-awesome" 
            style={{ borderRadius: 1, padding: 10 }}
            onPress={toggleModal} 
          />
        )}
      </View>
      <ScrollView keyboardShouldPersistTaps="always">
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
              style={{ borderRadius: 10, borderWidth: 5, borderColor: '#FFFFFF', height: Dimensions.window.height / 2 }}
            >
              {type === 'faculty' ? (
                <FormAddCourse toggle={toggleModal} instructor={instructor} />
              ) : type === 'student' ? (
                <StudentAddCourseForm student={student} toggle={toggleModal} />
              ) : (
                <AnnouncementsAdd course={course} toggle={toggleModal} />
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default CourseAdd;