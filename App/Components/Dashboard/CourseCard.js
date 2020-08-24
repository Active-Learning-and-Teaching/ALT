import React, {Component} from 'react';
import {StyleSheet, ImageBackground, Text, Alert} from 'react-native';
import {Avatar} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import {CoursePics} from '../../Utils/CoursePics';
import ActionSheet from 'react-native-actionsheet';
import Courses from '../../Databases/Courses';

export default class  CourseCard extends Component{
    constructor() {
        super();
        this.state = {
            image : ""
        };
    }
    showActionSheet = () => {
        this.ActionSheet.show();
    };

    getImage = () =>{
        this.setState({
            image : CoursePics(this.props.course.imageURL)
        })
    }

    showAlert() {

        if (this.props.type==="faculty"){
            Alert.alert(
                'Are you sure you want to remove course '+this.props.course.courseName + " ?",
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
                            await courses.getCourse(this.props.course.passCode)
                                .then(async value => {
                                    await this.props.user.deleteCourse(value)
                                        .then(r => console.log("Deleted Course"))
                                })
                            // TODO Email course details
                        }
                    },
                ]
            )
        }
        else{
            Alert.alert(
                'Are you sure you want to leave course '+this.props.course.courseName + " ?",
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
                            await courses.getCourse(this.props.course.passCode)
                                .then(async value => {
                                    await this.props.user.deleteCourse(value)
                                        .then(r => console.log("Deleted Course"))
                                })
                        }
                    },
                ]
            )
        }
    }

    componentDidMount() {
        this.getImage()
    }

    render(){
        return(
            <ImageBackground
                source={this.state.image}
                borderRadius={20}
                style={styles.container}
            >
                <Avatar
                    onPress={()=>{
                        this.props.navigation.navigate('Course', {
                            type : this.props.type,
                            user : this.props.user,
                            course : this.props.course
                    })}}
                    onLongPress={()=>{this.showActionSheet()}}
                    title = {this.props.course.courseCode + " "+ this.props.course.courseName}
                    titleStyle={styles.title}
                    containerStyle={styles.container}
                    activeOpacity={0.2}
                />
                <Text style={styles.name}>{this.props.course.instructor}</Text>
                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    title={
                        this.props.type==="faculty" ?
                            'Do you want to remove this course ?' :
                            'Do you want to leave this course ?'
                    }
                    options={
                        this.props.type==="faculty" ?
                            ['Remove Course', 'Cancel'] :
                            ['Leave Course', 'Cancel']
                    }
                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={index => {
                        if(index==0)
                            this.showAlert();
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
