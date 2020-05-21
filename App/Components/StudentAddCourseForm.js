import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Courses from '../Databases/Courses';

export default class StudentAddCourseForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseCode: '',
            error: null,
        };
    }

    joinCourse = async () => {

        const {courseCode, error} = this.state;

        if (courseCode === '') {
            this.setState({
                error: "Please Enter Course Code."
            })
        } else {
            // const courses = new Courses()
            console.log(this.props.student)
            console.log(courseCode)

            // await courses.getCourse()
            //     .then(courseExists => {
            //         if (courseExists)
            //             courses.createCourse()
            //     })
            this.setState({
                courseCode: '',
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
                    placeholder="Course Code"
                    onChangeText={courseCode => this.setState({ courseCode })}
                    value={this.state.courseCode}
                />
                { this.state.error ?
                    <Text style={styles.errorMessage}>
                        {this.state.error}
                    </Text> : <Text/>}

                <Button style={styles.buttonMessage} title="Join" onPress={this.joinCourse} />

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
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    textCreate: {
        width: '100%',
        fontWeight: "bold",
        justifyContent: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        color : "grey",
        fontSize : 18,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 10,
        paddingBottom: 10,
    },
    buttonMessage: {
        marginTop: 15
    }
});

