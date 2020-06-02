import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from 'react-native';
import Courses from '../Databases/Courses';

export default class StudentAddCourseForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passCode: '',
            error: null,
        };
    }

    joinCourse = async () => {

        const {passCode, error} = this.state;

        if (passCode === '') {
            this.setState({
                error: "Please Enter Course Pass Code."
            })
        } else {
            const courses = new Courses()
            await courses.getCourse(passCode)
                .then(async value => {
                    if (value){
                        await this.props.student.addCourseStudent(value).then(r => console.log("Added Course to Student"))
                        this.props.toggle()
                    }
                    else {
                        this.setState({
                            error:"Incorrect Code"
                        })
                    }
                })

            this.setState({
                passCode: '',
            })

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
                    placeholder="Pass Code"
                    onChangeText={passCode => this.setState({ passCode })}
                    value={this.state.passCode}
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

