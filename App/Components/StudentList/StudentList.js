import React, {Component} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import database from '@react-native-firebase/database';
import Courses from '../../Databases/Courses';
import StudentCard from './StudentCard';
import TACard from './TACard';

export default class StudentList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            studentList : [],
            taList : [],
            courseURL : ''
        };
    }

    getCourseURL = async () => {
        const course = new Courses()
        await course.getCourse(this.state.course.passCode)
            .then(async url=>{
                this.setState({
                    courseURL : url  
                })
            })
    }

    getStudents = () => {
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
                        if (arr.includes(this.state.courseURL)){
                            const dict = {}
                            dict["url"]=url
                            dict["name"] = keys["name"]
                            dict["email"] = keys["email"]
                            dict["photo"] = keys["photo"]
                            dict["verified"] = 0

                            if ("verified" in keys){
                                const arr = data.val()["verified"]
                                if (arr.includes(this.state.courseURL)){
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

                this.setState({
                    studentList : list,
                })
                this.props.route.params.getStudentListData(list)
            })
    }

    getTAs = () => {
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
                        if (arr.includes(this.state.courseURL)){
                            const dict = {}
                            dict["url"]=url
                            dict["name"] = keys["name"]
                            dict["email"] = keys["email"]
                            dict["photo"] = keys["photo"]
                            dict["verified"] = 0

                            if ("verified" in keys){
                                const arr = data.val()["verified"]
                                if (arr.includes(this.state.courseURL)){
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

                this.setState({
                    taList : list,
                })
                this.props.route.params.getTAStudentListData(list)
            })
    }

    componentDidMount() {
        this.getCourseURL().then(()=>{
            this.getStudents()
            this.getTAs()
        })
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <View style={styles.grid}>
                        <Text style={styles.text}>
                            {this.state.taList.length===0
                            ?"No TA"
                            :"Total TA : "+this.state.taList.length}
                        </Text>
                        {this.state.taList.map((student,i)=> (
                            <TACard      student={student}
                                         key={i}
                                         type={this.state.type}
                                         course={this.state.course}
                                         courseURL={this.state.courseURL}
                            />
                        ))}
                    </View>
                    <View style={styles.grid}>
                        <Text style={styles.text}>
                            {this.state.studentList.length===0
                            ?""
                            :"Total Students : "+this.state.studentList.length}
                        </Text>
                        {this.state.studentList.map((student,i)=> (
                            <StudentCard student={student}
                                         key={i}
                                         type={this.state.type}
                                         course={this.state.course}
                                         courseURL={this.state.courseURL}
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

        )
    }

}

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
