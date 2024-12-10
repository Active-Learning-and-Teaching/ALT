import React from 'react';
import { Avatar, Icon, ListItem } from 'react-native-elements';
import { Linking, StyleSheet, View } from 'react-native';
import Dimensions from '../utils/Dimentions';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Courses from '../database/courses';
import Toast from 'react-native-simple-toast';
import Student from '../database/student';
import CheckBox from '@react-native-community/checkbox';
import database from '@react-native-firebase/database';

// Define Prop Types
interface StudentCardProps {
  course: {
    passCode: string;
    instructors: string[];
  };
  type: string;
  key: string | number;
  courseURL: string;
  student: {
    name: string;
    email: string;
    verified?: number;
    url?: string;
  };
}

const StudentCard: React.FC<StudentCardProps> = ({course, type, key, courseURL, student }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const showActionSheet = () => {
    showActionSheetWithOptions(
      {
        title: 'Options',
        options: [
          `Remove ${student.name ?? student.email}`,
          `Make Course TA ${student.name ?? student.email}`,
          'Cancel',
        ],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 0,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            await removeStudent();
            break;
          case 1:
            await makeTA();
            break;
          case 2:
        }
      }
    );
  };

  const createTitle = ( email: string, name?: string): string => {
    if (name?.trim()) {
      const res = name.split(' ').filter((word) => word);
      if (res.length === 1) return res[0].charAt(0).toUpperCase();
      return res[0].charAt(0).toUpperCase() + res[res.length - 1].charAt(0).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const removeStudent = async () => {
    const coursesObj = new Courses();
    const studentObj = new Student();
    studentObj.setName(student.name ?? '');
    studentObj.setEmail(student.email);
    await studentObj.facultySetUrl(student.email).then(async () => {
      await coursesObj.getCourse(course.passCode).then(async (courseUrl: string) => {
        await studentObj.deleteCourse(courseUrl).then(() => Toast.show('Student removed', Toast.SHORT));
      });
    });
  };

  const makeTA = async () => {
    const coursesObj = new Courses();
    const studentObj = new Student();
    await studentObj.setEmail(student.email);
    await studentObj.setUrl();
    const facultyURL = course.instructors[0];
    const studentURL = student.url ?? '';
    await coursesObj.addTAs(`${facultyURL}_${studentURL}`, courseURL);
    if (course) {
      await studentObj.addTACourseStudent(courseURL).then(() => console.log('Added Course to Student'));
    }
  };

  const verifyStudent = async (email: string, courseUrl: string) => {
    let ans: string[] = [];
    let url = '';
    await database()
      .ref('InternalDb/Student/')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val() as Record<string, any>;
        if (data) {
          const keys = Object.values(data);
          if ('verified' in keys[0]) {
            ans = keys[0]['verified'] ?? [];
          }
        }
      });

    if (!ans.includes(courseUrl)) {
      ans.push(courseUrl);
      await database()
        .ref(`InternalDb/Student/${url}`)
        .update({ verified: ans })
        .then(() => console.log('Student Verified'));
    }
  };

  const cancelStudent = async (email: string, courseUrl: string) => {
    let ans: string[] = [];
    await database()
      .ref('InternalDb/Student/')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const keys : any = Object.values(data);
          ans = keys[0]?.['verified'] ?? [];
        }
      });

    ans = ans.filter((url) => url !== courseUrl);

    await database()
      .ref('InternalDb/Student/')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const url = Object.keys(data)[0];
          database().ref(`InternalDb/Student/${url}`).update({ verified: ans });
        }
      });
  };

  const containerStyle = styles.container;
  const title = createTitle(student.name, student.email);

  return (
    <View>
      <ListItem
        onLongPress={type === 'faculty' ? showActionSheet : undefined}
        underlayColor="#ffffff00"
        key={key}
        containerStyle={containerStyle}
        bottomDivider
      >
        <Avatar
          title={title}
          titleStyle={{ color: 'white', fontSize: 20 }}
          overlayContainerStyle={{ backgroundColor: 'tomato' }}
          size="medium"
          rounded
        />
        <ListItem.Content>
          <ListItem.Title style={styles.title}>
            {student.name?.trim() ?? student.email}
          </ListItem.Title>
          <ListItem.Subtitle style={styles.caption}>{student.email}</ListItem.Subtitle>
        </ListItem.Content>
        {type === 'faculty' && (
          <CheckBox
            style={{ flex: 0.05, padding: 10 }}
            value={student.verified === 1}
            onValueChange={(newValue) => {
              if (student.verified === 0) {
                student.verified = 1;
                verifyStudent(student.email, courseURL);
              } else {
                student.verified = 0;
                cancelStudent(student.email, courseURL);
              }
            }}
          />
        )}
        <Icon
          name="mail-forward"
          type="font-awesome"
          size={20}
          color="grey"
          onPress={() => Linking.openURL(`mailto:${student.email}`)}
        />
      </ListItem>
    </View>
  );
};

export default StudentCard;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.window.width - 10,
    height: Dimensions.window.height / 9,
    marginTop: 2,
    marginBottom: 2,
    paddingTop: 2,
    paddingBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderRadius: 15,
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
    color: 'black',
    marginTop: 1,
    paddingTop: 1,
    marginBottom: 2,
    paddingBottom: 2,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 12,
    color: 'black',
  },
});
