import React, {useState} from 'react';
import {StyleSheet,View,TextInput} from 'react-native';
import {Button, Text} from 'react-native-elements';
import Courses from '../../database/Courses';

function FormAddCourse({instructor,toggle}) {
  
    const [courseName,setCourseName] = useState('')
    const [courseCode,setCourseCode] = useState('')
    const [room,setRoom] = useState('')
    const [error,setError] = useState(null)

    const CreateCourse = async () => {
        let newCourseName = courseName.replace(/\s+/g,' ').trim();
        let newCourseCode = courseCode.replace(/\s+/g,' ').trim();

        if (newCourseName === '' || newCourseCode === '') 
            setError("Please Enter details.")

        else {
            let newCourseName = courseName.charAt(0).toUpperCase() + courseName.slice(1);
            let newCourseCode = courseCode.toUpperCase()
            const courses = new Courses()

            courses.setcourseName(newCourseName)
            courses.setcourseCode(newCourseCode)
            courses.setRoom(room)
            courses.setPassCode()
            await courses.setImage()
            //Passing Faculty object to add his Url (Signature)
            courses.addInstructors(instructor)

            //Create course
            courses.createCourse()

            //Adding Course to Faculty
            const pass = courses.getPassCode()
            await courses.getCourse(pass)
            .then(async value => {
                await instructor.addCourseFaculty(value).then(r => console.log("Added Course to Faculty"))
            })

            setCourseName('')
            setCourseCode('')
            setRoom('')
            setError(null)
            toggle()
        }

    }

    return(
        <View style = {styles.container}>
            <Text style={styles.textCreate}>
                New Course
            </Text>
            <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Course Name"
                placeholderTextColor = "grey"
                onChangeText={courseNameText => setCourseName( courseNameText )}
                value={courseName}
            />
            <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Course Code"
                placeholderTextColor = "grey"
                onChangeText={courseCodeText => setCourseCode( courseCodeText )}
                value={courseCode}
            />
            <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Room"
                placeholderTextColor = "grey"
                onChangeText={roomText => setRoom( roomText )}
                value={room}
            />

            { error ?
                <Text style={styles.errorMessage}>
                    {error}
                </Text> : <Text/>}

            <Button 
                buttonStyle={styles.create} 
                title="Create" 
                titleStyle={{color:'white',fontWeight:'normal'}} 
                onPress={CreateCourse} 
            />
        </View>
    );
}

export default FormAddCourse

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    textInput: {
        color: 'black',
        width: '100%',
        marginBottom: 8,
        paddingBottom: 8,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    textCreate: {
        width: '100%',
        fontWeight: "bold",
        justifyContent: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        alignSelf: "center",
        color : "#333",
        fontSize : 18,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 5,
        paddingTop : 5,
        paddingBottom: 10,
    },
    create:{
        backgroundColor: 'tomato', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:20,
        marginBottom:20,
    },
});

