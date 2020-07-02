import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

export default class FeedbackStudentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course,
            user: this.props.user,
        }
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>

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
