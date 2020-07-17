import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';
import {
    Button,
    StyleSheet,
    View,
    Alert, ScrollView, SafeAreaView,
} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import CourseCard from './CourseCard';
import {Icon} from 'react-native-elements';
import Student from '../../Databases/Student';
import CourseAdd from './CourseAdd';
import * as config from '../../config.json';
import Courses from '../../Databases/Courses';

export default class StudentDashBoard extends Component {
    constructor() {
        super();
        this.state = {
            currentUser : null,
            courseList: []
        };
    }

    getCurrentUser = async () => {
        const currentUser = await auth().currentUser;
        const student = new Student()
        await student.setID(currentUser.uid)
        await student.setName(currentUser.displayName)
        await student.setEmail(currentUser.email)
        await student.setUrl().then(()=>{console.log()})

        await this.setState({
            currentUser : student
        })
    };

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut()
            this.props.navigation.navigate('Login')
        }
        catch (error) {
            auth()
                .signOut()
                .then(
                    this.props.navigation.navigate('Login')
                )
                .catch(err => {
                    Alert.alert(err.message)
                })
        }
    }

    getAllCourses = ()=>{
        database()
            .ref(config['internalDb']+'/Student/'+this.state.currentUser.url)
            .on('value', snapshot => {
                if (snapshot.val()){
                    const keys = Object(snapshot.val());
                    if ("courses" in keys) {
                        const arr = snapshot.val()["courses"].filter(n=>n)
                        const course = new Courses()
                        const courses = []

                        for(var i=0; i<arr.length; i++){
                            course.getCourseByUrl(arr[i])
                                .then(r => {
                                    courses.push(r)
                                    this.setState({
                                        courseList : courses
                                    })
                                })
                        }
                    }
                }
            })
    }


    componentDidMount(){
        this.getCurrentUser().then(() =>{
            if(this.state.currentUser.url==""){
                this.componentDidMount()

            }
            this.getAllCourses()
            this.props.route.params.setUser(this.state.currentUser).then(()=>console.log())
        })
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>

                    <View style={styles.grid}>
                        {this.state.courseList.map((item,i)=> (
                            <CourseCard course = {item} type = {"student"}  user = {this.state.currentUser} navigation ={this.props.navigation}  key={i}/>
                        ))}
                    </View>

                    <Button style={styles.buttonMessage} title="SignOut" onPress={this.signOut} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    grid: {
        marginTop: 10,
        marginBottom: 10,
        paddingTop : 10,
        paddingBottom : 10,
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 20
    },
    buttonMessage: {
        paddingTop : 10,
        marginTop: 15
    },
});

