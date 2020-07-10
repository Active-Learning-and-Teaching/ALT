import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Avatar} from 'react-native-elements';

export default class StudentOrFaculty extends Component {
    constructor() {
        super();
        this.state = {
            selected: '',
        };
    }
    stylesForFaculty = ()=>{
        return {
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
            borderWidth: this.state.selected==='faculty'?8:0,
            borderRadius: 80,
        }
    }
    stylesForStudent = ()=>{
        return {
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
            borderWidth: this.state.selected==='student'?8:0,
            borderRadius: 80,
        }
    }
    render(){

        return(
            <View style = {styles.container}>

                <Avatar
                    size="xlarge"
                    rounded
                    // icon={{name: this.state.icon, color: 'orange', type: 'font-awesome'}}
                    source = {require('../Assets/Faculty.png')}
                    overlayContainerStyle={{backgroundColor: 'white'}}
                    onPress={() => this.setState({
                        selected: 'faculty'
                    })}
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={this.stylesForFaculty()}
                />
                <Text style={styles.text}>Faculty</Text>
                <Avatar
                    size="xlarge"
                    rounded
                    // icon={{name: this.state.icon, color: 'orange', type: 'font-awesome'}}
                    source = {require('../Assets/Student.png')}
                    overlayContainerStyle={{backgroundColor: 'white'}}
                    onPress={() => this.setState({
                        selected: 'student'
                    })}
                    activeOpacity={0.7}
                    avatarStyle={styles.avatarStyle}
                    containerStyle={this.stylesForStudent()}
                />
                <Text style={styles.text}>Student</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
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
    text:{
        marginTop: 10
    }



});
