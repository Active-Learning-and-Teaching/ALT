import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from 'react-native';
import Courses from '../../Databases/Courses';


export default class StudentAddCourseForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passCode: '',
            error: null,
        };
    }

    joinCourse = async () => {

        let {passCode, error} = this.state;
        passCode = passCode.replace(/\s+/g,' ').trim()

        if (passCode === '') {
            this.setState({
                error: "Please Enter Course Pass Code."
            })
        } else {
            const courses = new Courses()
            await courses.getCourse(passCode)
                .then(async value => {
                    console.log(courses.getCourse(passCode))
                    if (value){
                        await this.props.student.addCourseStudent(value)
                            .then(r => console.log("Added Course to Student")

                            )
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
                    placeholderTextColor = "grey"
                    onChangeText={passCode => this.setState({ passCode })}
                    value={this.state.passCode}
                />
                { this.state.error ?
                    <Text style={styles.errorMessage}>
                        {this.state.error}
                    </Text> : <Text/>}

                <Button style={styles.buttonMessage} buttonStyle={{backgroundColor: 'black'}} title="Join" onPress={this.joinCourse} />

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
        color: 'black',
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

