import React, {Component} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';

export default class  CoursePage extends Component{

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text>Course Page {this.props.route.params.course}</Text>
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
    }
})
