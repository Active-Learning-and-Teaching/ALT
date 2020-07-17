import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {Avatar, Button} from 'react-native-elements';

export default class StudentOrFaculty extends Component {
    constructor() {
        super();
        this.state = {
            selected: '',
            error: null,
        };
    }
    RegisterTypeOfUser = ()=>{
        const { selected} = this.state;

        if (selected==='')
        {
            this.setState({
                error : "Select the type of user."
            })
        }
        else {
            console.log(this.state.selected)
            //firebasewrite
            //navigate
        }
    }
    render(){

        return(
            <ScrollView style = {styles.container}>
                <View style = {styles.viewContainer}>

                    <Avatar
                        size="xlarge"
                        rounded
                        source = {require('../../Assets/Faculty.png')}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                        onPress={() => this.setState({
                            selected: 'faculty',
                            error :null
                        })}
                        activeOpacity={0.7}
                        avatarStyle={styles.avatarStyle}
                        containerStyle={[styles.avatarContainer,{borderWidth: this.state.selected==='faculty'?8:0}]}
                    />
                    <Text style={styles.text}>Faculty</Text>
                    <Avatar
                        size="xlarge"
                        rounded
                        source = {require('../../Assets/Student.png')}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                        onPress={() => this.setState({
                            selected: 'student',
                            error :null
                        })}
                        activeOpacity={0.7}
                        avatarStyle={styles.avatarStyle}
                        containerStyle={[styles.avatarContainer,{borderWidth: this.state.selected==='student'?8:0}]}
                    />
                    <Text style={styles.text}>Student</Text>

                </View>
                { this.state.error ?
                    <Text style={styles.errorMessage}>
                        {this.state.error}
                    </Text> : <Text/>}

                <Button style={styles.buttonMessage} title="Register" onPress={this.RegisterTypeOfUser} />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 35,
        backgroundColor: '#fff'
    },
    viewContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    avatarStyle : {
        flex: 2,
        borderTopLeftRadius: 1,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 10,
        paddingBottom: 10,
    },
    text:{
        marginTop: 10
    },
    buttonMessage: {
        marginTop: 15
    },
    avatarContainer:{
        marginTop: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.38,
        shadowRadius: 10.00,
        elevation: 24,

        borderColor: '#2697BF',

        borderRadius: 80,
    }

});
