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
// import courses from '../Databases/Courses';

export default class FormAddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseName: '',
            courseCode: '',
            room: '',
            days : [],
            day1 : '',
            day2 : '',
            day3 : '',
            weekdays : ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
            error: null,
        };
    }

    addDays = async (day1, day2, day3) => {
        const days = []
        if (day1!='' && day1 != 'Select')
            days.push(day1)

        if (day2!='' && day2 != 'Select')
            days.push(day2)

        if (day3!='' && day3 != 'Select')
            days.push(day3)

        this.setState({
            days : days
        })

    }

    CreateCourse = async () => {

        const {courseName, courseCode, room, error, day1, day2, day3} = this.state;

        if (courseName === '' || courseCode === '') {
            this.setState({
                error: "Please Enter details."
            })
        } else {
            await this.addDays(day1, day2, day3)
            const courses = new Courses()
            courses.setcourseName(courseName)
            courses.setcourseCode(courseCode)
            courses.setRoom(room)
            courses.setDays(this.state.days)
            courses.setInstructor(this.props.instructor)

            await courses.getCourse()
                .then(courseExists => {
                    if (!courseExists)
                        courses.createCourse()
            })
            this.setState({
                courseName: '',
                courseCode: '',
                room: '',
                days : [],
                day1 : '',
                day2 : '',
                day3 : '',
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
                <Text style={styles.textTime}>
                    Timings
                </Text>
                <Picker
                    selectedValue={this.state.day1}
                    mode="dialog"
                    itemStyle={styles.textPicker}
                    onValueChange={(itemValue, itemIndex)=>this.setState({day1 : itemValue})}>
                    <Picker.Item color='grey' label={"Select"} value={"Select"}/>
                    {this.state.weekdays.map((day, i) => <Picker.Item color='grey' key= {i} label={day} value={day} />)}
                </Picker>
                <Picker
                    selectedValue={this.state.day2}
                    mode="dialog"
                    itemStyle={styles.textPicker}
                    onValueChange={(itemValue, itemIndex)=>this.setState({day2 : itemValue})}>
                    <Picker.Item color='grey' label={"Select"} value={"Select"}/>
                    {this.state.weekdays.map((day, i) => <Picker.Item color='grey' key= {i} label={day} value={day} />)}
                </Picker>
                <Picker
                    selectedValue={this.state.day3}
                    mode="dialog"
                    itemStyle={styles.textPicker}
                    onValueChange={(itemValue, itemIndex)=>this.setState({day3 : itemValue})}>
                    <Picker.Item color='grey' label={"Select"} value={"Select"}/>
                    {this.state.weekdays.map((day, i) => <Picker.Item color='grey' key= {i} label={day} value={day} />)}
                </Picker>

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
    textPicker : {
        color : "grey",
        fontSize : 14,
    },
    textTime: {
        width: '100%',
        justifyContent: 'center',
        fontWeight: "bold",
        marginTop: 5,
        paddingTop: 5,
        marginBottom: 5,
        paddingBottom: 5,
        alignSelf: "center",
        color : "grey",
        fontSize : 16,
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

