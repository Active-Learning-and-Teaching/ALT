import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';

export default class FeedbackHomePage extends Component{

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text>Feedback Home Page</Text>
                </ScrollView>
            </SafeAreaView>

        )
    }

}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    }
})
