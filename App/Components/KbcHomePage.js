import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';

export default class KbcHomePage extends Component{

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text>Kbc Home Page</Text>
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
