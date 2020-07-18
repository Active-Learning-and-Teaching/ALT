import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from 'react-native';
import Courses from '../../Databases/Courses';

export default class FormAddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseName: '',
            courseCode: '',
            room: '',
            error: null,
        };
    }

    CreateCourse = async () => {

        const {courseName, courseCode, room} = this.state;

        if (courseName === '' || courseCode === '') {
            this.setState({
                error: "Please Enter details."
            })
        } else {
            const courses = new Courses()

            courses.setcourseName(courseName)
            courses.setcourseCode(courseCode)
            courses.setRoom(room)
            courses.setPassCode()
            await courses.setImage()
            //Passing Faculty object to add his Url (Signature)
            courses.addInstructors(this.props.instructor)

            //Create course
            courses.createCourse()

            //Adding Course to Faculty
            const pass = courses.getPassCode()
            await courses.getCourse(pass)
                .then(async value => {
                    await this.props.instructor.addCourseFaculty(value).then(r => console.log("Added Course to Faculty"))
                })

            this.setState({
                courseName: '',
                courseCode: '',
                room: '',
                error: null,
            })
            this.props.toggle()
        }

    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style={styles.textCreate}>
                    New Course
                </Text>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Course Name"
                    onChangeText={courseName => this.setState({ courseName })}
                    value={this.state.courseName}
                />
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Course Code"
                    onChangeText={courseCode => this.setState({ courseCode })}
                    value={this.state.courseCode}
                />
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Room"
                    onChangeText={room => this.setState({ room })}
                    value={this.state.room}
                />

                { this.state.error ?
                    <Text style={styles.errorMessage}>
                        {this.state.error}
                    </Text> : <Text/>}

                <Button style={styles.buttonMessage} title="Create" onPress={this.CreateCourse} />

            </View>
        );
    }
}

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
        color : "grey",
        fontSize : 18,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 5,
        paddingTop : 5,
        paddingBottom: 10,
    },
    buttonMessage: {
        marginTop: 5
    }
});

