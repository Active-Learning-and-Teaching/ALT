import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import FeedbackStudentPage from './FeedbackStudentPage';
import FeedbackFacultyPage from './FeedbackFacultyPage';

export default class FeedbackHomePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
        };
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                {this.state.type === "faculty" ?
                    <FeedbackFacultyPage
                        user = {this.state.user}
                        course = {this.state.course}
                    />
                    :
                    <FeedbackStudentPage
                        user = {this.state.user}
                        course = {this.state.course}
                    />
                }
            </SafeAreaView>

        )
    }

}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },

})

