import React, {Component} from 'react';
import {StyleSheet, ImageBackground, Text, Alert} from 'react-native';
import {Avatar} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import {CoursePics} from '../../Utils/CoursePics';
import ActionSheet from 'react-native-actionsheet';
import Courses from '../../Databases/Courses';
import Announcement from '../../Databases/Announcement';
import Feedback from '../../Databases/Feedback';
import Quiz from '../../Databases/Quiz';
import Toast from 'react-native-simple-toast';
import Student from '../../Databases/Student';
import {DeleteCourseMailer} from '../../Utils/DeleteCourseMailer';

export default class  CourseCard extends Component{
    constructor() {
        super();
        this.state = {
            image : "",
            course : []
        };
        this.setCourse = this.setCourse.bind(this);
    }

    async setCourse(courseData){
        await this.setState({
            course : courseData
        })
    }

    showActionSheet = () => {
        this.ActionSheet.show();
    };

    getImage = () =>{
        this.setState({
            image : CoursePics(this.state.course.imageURL)
        })
    }

    emailCourseDetails = async (type)=>{
        const announcement =  new Announcement()
        const feedback =  new Feedback()
        const quiz = new Quiz()
        const student = new Student()
        const passCode = this.state.course.passCode
        announcement.getAllAnnouncement(passCode).then(ann=>{
            feedback.getFeedbackDetails(passCode).then(feed=>{
                quiz.getTiming(passCode).then(quiz=>{
                    student.getAllStudents(passCode).then(async studentList=>{
                        let announcements = ann===""?[]:ann;
                        let courseName = this.state.course.courseName
                        let courseCode = this.state.course.courseCode
                        let feedbackCount = feed===null ? "0" : feed["feedbackCount"]
                        let quizCount = quiz===null ? "0" : quiz["questionCount"]
                        let students = studentList

                        const reactFile = require('react-native-fs');

                        const announcementFilePath = reactFile.DocumentDirectoryPath + `/${courseCode+"_"+"Announcement"}.csv`;
                        const announcementHeadingString = 'Announcement Date, Announcement Heading, Announcement Description\n';
                        const announcementRowString = await announcements.map((announcement,i) => `${announcement.date},${announcement.heading},${announcement.description}\n`).join('');
                        const announcementString = `${announcementHeadingString}${announcementRowString}`;


                        const studentFilePath = reactFile.DocumentDirectoryPath + `/${courseCode+"_"+"StudentList"}.csv`;
                        const studentHeaderString = 'Student Name, EmailID\n';
                        const studentRowString = await students.map((student,i) => `${student.name},${student.email}\n`).join('');
                        const studentString = `${studentHeaderString}${studentRowString}`;

                        await reactFile.writeFile(announcementFilePath, announcementString, 'utf8')
                            .then(async (success) => {
                                await reactFile.writeFile(studentFilePath, studentString, 'utf8')
                                    .then((success)=>{
                                        console.log("Files Written")
                                        Toast.show('Sending Email...');
                                        DeleteCourseMailer(
                                            courseName,
                                            courseCode,
                                            this.props.user.email,
                                            this.props.user.name,
                                            feedbackCount,
                                            quizCount,
                                            passCode,
                                            type
                                        )
                                    }).catch((err) => {
                                        console.log(err.message);
                                        });
                            })
                            .catch((err) => {
                                console.log(err.message);
                            });
                    })
                })
            })
        })
    }

    showAlert() {

        if (this.props.type==="faculty"){
            Alert.alert(
                'Are you sure you want to remove course '+this.state.course.courseName + " ?",
                'This action is irreversible!',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {console.log('Cancel Pressed')},
                        style: 'cancel',
                    },
                    {
                        text: 'Confirm',
                        //@Vishwesh
                        onPress: async () => {
                            const courses = new Courses()
                            await courses.getCourse(this.state.course.passCode)
                                .then(async value => {
                                    await this.props.user.deleteCourse(value)
                                        .then(r => console.log("Deleted Course"))
                                })
                            await this.emailCourseDetails("Delete").then(r=>
                                Toast.show('Course Successfully Deleted')
                            )
                        }
                    },
                ]
            )
        }
        else{
            Alert.alert(
                'Are you sure you want to leave course '+this.state.course.courseName + " ?",
                '',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {console.log('Cancel Pressed')},
                        style: 'cancel',
                    },
                    {
                        text: 'Confirm',
                        //@Vishwesh
                        onPress: async () => {
                            const courses = new Courses()
                            await courses.getCourse(this.state.course.passCode)
                                .then(async value => {
                                    await this.props.user.deleteCourse(value)
                                        .then(r => Toast.show('Course Successfully Deleted'))
                                })
                        }
                    },
                ]
            )
        }
    }

    componentDidMount() {
        this.setCourse(this.props.course).then(r=>{
            this.getImage()
        })
    }

    render(){
        return(
            <ImageBackground
                source={this.state.image}
                loadingIndicatorSource={require('../../Assets/LoadingImage.jpg')}
                borderRadius={20}
                style={styles.container}
            >
                <Avatar
                    onPress={()=>{
                        this.props.navigation.navigate('Course', {
                            type : this.props.type,
                            user : this.props.user,
                            course : this.state.course,
                            setCourse : this.setCourse,
                    })}}
                    onLongPress={()=>{this.showActionSheet()}}
                    title = {this.state.course.courseCode + " "+ this.state.course.courseName}
                    titleStyle={styles.title}
                    containerStyle={styles.container}
                    activeOpacity={0.2}
                />
                <Text style={styles.name}>{this.state.course.instructor}</Text>
                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    title={
                        this.props.type==="faculty" ?
                            'Do you want to remove this course ?' :
                            'Do you want to leave this course ?'
                    }
                    options={
                        this.props.type==="faculty" ?
                            ['Email Course Details','Remove Course', 'Cancel'] :
                            ['Leave Course', 'Cancel']
                    }

                    cancelButtonIndex={this.props.type==="faculty"?2:1}
                    destructiveButtonIndex={this.props.type==="faculty"?1:0}
                    onPress={index => {
                        if(this.props.type==="faculty"){
                            if(index===0) {
                                this.emailCourseDetails("Details").then(r=>
                                    console.log(r)
                                )
                            }
                            else if(index===1)
                                this.showAlert();
                        }
                        else{
                            if(index===0)
                                this.showAlert();
                        }
                    }}
                />
            </ImageBackground>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(3.5),
        marginTop: 10,
        marginBottom: 10,
        paddingTop : 10,
        paddingBottom : 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.20,
        shadowRadius: 2.00,
        elevation: 24,
    },
    imageContainer: {
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(3.5),
        borderRadius: 20,
        overflow: 'hidden',
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        position: 'absolute',
        left: 15,
        right: 15,
        fontSize: 20,
        top: 0,
        color:'white',
        fontWeight : "bold"
    },
    name: {
        position: 'absolute',
        left: 15,
        bottom: 25,
        fontSize: 18,
        color:'white',
    },
})
