import React, {useState, useCallback} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import database from '@react-native-firebase/database';
import Courses from '../../Databases/Courses';
import StudentCard from './StudentCard';
import TACard from './TACard.jsx';
import { useRoute,useFocusEffect } from '@react-navigation/native';

function StudentList() {
    const route = useRoute()
    const {type,course,} = route.params
    const [studentList,setStudentList] = useState([])
    const [taList,setTaList] = useState([])
    const [courseURL,setCourseURL] = useState('')

    const getStudents = (courseURL) => {
        database()
            .ref('InternalDb/Student/')
            .orderByChild("courses")
            .on('value', snapshot => {
                const list = []
                snapshot.forEach( (data) => {
                    const url = Object(data.key)
                    const keys = Object(data.val())
                    if ("courses" in keys){
                        const arr = data.val()["courses"]
                        if (arr.includes(courseURL)){
                            const dict = {}
                            dict["url"]=url
                            dict["name"] = keys["name"]
                            dict["email"] = keys["email"]
                            dict["photo"] = keys["photo"]
                            dict["verified"] = 0

                            if ("verified" in keys){
                                const arr = data.val()["verified"]
                                if (arr.includes(courseURL)){
                                    dict["verified"] = 1
                                }
                            }
                            list.push(dict)
                        }
                    }
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
                console.log(list)
                setStudentList(list)
            })
    }

    const getTAs = (courseURL) => {
        database()
            .ref('InternalDb/Student/')
            .orderByChild("tacourses")
            .on('value', snapshot => {
                const list = []
                snapshot.forEach( (data) => {
                    const url = Object(data.key)
                    const keys = Object(data.val())
                    if ("tacourses" in keys){
                        const arr = data.val()["tacourses"]
                        if (arr.includes(courseURL)){
                            const dict = {}
                            dict["url"]=url
                            dict["name"] = keys["name"]
                            dict["email"] = keys["email"]
                            dict["photo"] = keys["photo"]
                            dict["verified"] = 0

                            if ("verified" in keys){
                                const arr = data.val()["verified"]
                                if (arr.includes(courseURL)){
                                    dict["verified"] = 1
                                }
                            }
                            list.push(dict)
                        }
                    }
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
                console.log(list)
                setTaList(list)
            })
    }

    useFocusEffect(
    useCallback(() => {
        const onLoad = async () =>{
            const courseObj = new Courses()
            const url = await courseObj.getCourse(course.passCode)
            setCourseURL(url)
            getStudents(url)
            getTAs(url)
        }
        onLoad()
    }, []))

    return(
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView>
                <View style={styles.grid}>
                    <Text style={styles.text}>
                        {taList.length===0
                        ?"No TA"
                        :"Total TA : "+taList.length}
                    </Text>
                    {taList.map((student,i)=> (
                        <TACard      
                            student={student}
                            key={i}
                            type={type}
                            course={course}
                            courseURL={courseURL}
                        />
                    ))}
                </View>
                <View style={styles.grid}>
                    <Text style={styles.text}>
                        {studentList.length===0
                        ?"No Students"
                        :"Total Students : "+studentList.length}
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
        paddingTop : 10,
        paddingBottom : 25,
        fontWeight : "bold"
    },
    grid: {
        marginTop : 10,
        paddingBottom : 10,
        alignItems: 'center',
    },
})
