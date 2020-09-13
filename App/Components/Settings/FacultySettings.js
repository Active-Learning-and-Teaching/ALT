import React, {Component} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';


export default class FacultySettings extends Component{

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
                <ScrollView>
                    <View>
                        <Text>Settings {this.state.type} {this.state.course.courseName} {this.state.user.name}</Text>
                    </View>
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
})
