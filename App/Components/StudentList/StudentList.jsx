import React, {useState, useCallback} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Courses from '../../database/Courses';
import StudentCard from './StudentCard';
import { useRoute,useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

function StudentList() {
    const route = useRoute()
    const {type,course,} = route.params
    const [studentList,setStudentList] = useState([])
    const [facultyList,setFacultyList] = useState([])
    const [courseURL,setCourseURL] = useState('')

    const getStudents = (courseURL) => {
        firestore()
            .collection('Student')
            .where("courses", 'array-contains', courseURL)
            .onSnapshot(snapshot => {
                const list = []

                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    
                    const dict = {}
                    dict["name"] = data["name"]
                    dict["email"] = data["email"]
                    dict["photo"] = data["photo"]
                    dict["verified"] = 1
                    // if ("verified" in dict){
                    //     const arr = doc.data()["verified"]
                    //     if (arr.includes(courseURL)){
                    //         dict["verified"] = 1
                    //     }
                    // }
                    list.push(dict)
                        
                })
                list.sort((a,b) =>
                    a.name!==undefined && b.name!==undefined
                    ? a.name.toUpperCase() > b.name.toUpperCase()
                        ? 1
                        : ((b.name.toUpperCase()  > a.name.toUpperCase())
                            ? -1
                            : 0)
                    : a.email > b.email
                        ? 1
                        : b.email > a.email
                            ? -1
                            : 0
                );

            setStudentList(list);
        })
    }

    const getFaculty = (courseURL) => {
        firestore()
            .collection('Faculty')
            .where("courses", 'array-contains', courseURL)
            .onSnapshot(snapshot => {
                const list = []
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    const dict = {}
                    dict["name"] = data["name"]
                    dict["email"] = data["email"]
                    dict["photo"] = data["photo"]
                    dict["verified"] = 1
                    list.push(dict)
                        
                })
                list.sort((a,b) =>
                    a.name!==undefined && b.name!==undefined
                    ? a.name.toUpperCase() > b.name.toUpperCase()
                        ? 1
                        : ((b.name.toUpperCase()  > a.name.toUpperCase())
                            ? -1
                            : 0)
                    : a.email > b.email
                        ? 1
                        : b.email > a.email
                            ? -1
                            : 0
                );

            setFacultyList(list);
        })
    }

    useFocusEffect(
    useCallback(() => {
        const onLoad = async () =>{
            const courseObj = new Courses()
            const url = await courseObj.getCourse(course.passCode)
            setCourseURL(url)
            getStudents(url)
            getFaculty(url)
        }
        onLoad()
    }, []))

    return(
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView>
               
                <View style={styles.grid}>
                    <Text style={styles.text}>
                        Faculty
                    </Text>

                    {facultyList.map((student,i)=> (
                        <StudentCard 
                            student={student}
                            key={i}
                            type={type}
                            course={course}
                            courseURL={courseURL}
                        />
                    ))}

                    <Text style={styles.text}>
                        {studentList.length===0
                        ?"No Students"
                        :studentList.length+(studentList.length==1?" Student"
                        :" Students")}
                    </Text>

                    {studentList.map((student,i)=> (
                        <StudentCard 
                            student={student}
                            key={i}
                            type={type}
                            course={course}
                            courseURL={courseURL}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default StudentList

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    text: {
        color: '#333',
        textAlign : 'center',
        alignSelf: "center",
        fontSize: 18,
        paddingTop : 25,
        paddingBottom : 25,
        fontWeight : "bold"
    },
    grid: {
        marginTop : 10,
        paddingBottom : 10,
        alignItems: 'center',
    },
})
