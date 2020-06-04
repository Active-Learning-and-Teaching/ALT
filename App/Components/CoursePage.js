import React, {Component} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';

export default class  CoursePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.route.params.course,
            type: this.props.route.params.type,
            user: this.props.route.params.user,
        };
    }
    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text style={styles.textInput}> {this.state.course.courseCode} : {this.state.course.courseName}</Text>
                    <Text style={styles.textInput} > Instructor : {this.state.course.instructor}</Text>
                    <Text style={styles.textInput} > PassCode : {this.state.course.passCode}</Text>
                    <Text style={styles.textInput} > Room : {this.state.course.room}</Text>

                    <Text style={styles.textInput} >{this.state.type} : {this.state.user.name}</Text>
                    <Button title={"Yo"} onPress={()=>{this.props.navigation.navigate(
                        "Kbc DashBoard"
                    )}}/>
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
    textInput: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
})
