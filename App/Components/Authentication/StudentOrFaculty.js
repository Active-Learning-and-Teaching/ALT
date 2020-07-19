import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import ErrorMessages from '../../Utils/ErrorMessages';
import Faculty from '../../Databases/Faculty';
import Student from '../../Databases/Student';

export default class StudentOrFaculty extends Component {
    constructor() {
        super();
        this.state = {
            selected: '',
            error: null,
        };
    }

    updateDatabase = async(email, name) => {

        if (this.state.selected==='faculty'){
            const faculty = new Faculty();
            await faculty.getUser(email)
                .then(async val => {
                    if (!val) {
                        await faculty.createUser(name, email)
                            .then(r => {
                                this.props.navigation.navigate('Faculty DashBoard')
                                if (!this.props.route.params.google)
                                    this.props.route.params.resetStates()
                            })
                    }
                })
        }
        else if (this.state.selected==='student'){
            const student = new Student();
            await student.getUser(email)
                .then(async val => {
                    if (!val){
                        await student.createUser(name, email)
                            .then(r=>{
                                this.props.navigation.navigate('Student DashBoard')
                                if (!this.props.route.params.google)
                                    this.props.route.params.resetStates()
                            })
                    }
                })
        }

    }

    CreateUserAccount = async () => {

        const {email, password, name} = this.props.route.params

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (res) =>{
                await res.user.updateProfile({
                    displayName: name
                })
                    .then(async r => {
                        await this.updateDatabase(email, name)
                            .then(r=> console.log())
                    })
            })
            .catch( err => {
                var errorMessages = new ErrorMessages()
                var message = errorMessages.getErrorMessage(err.code)
                this.setState({
                    error : message
                })
            })
    }

    RegisterTypeOfUser = async ()=>{
        const { selected} = this.state;

        if (selected==='')
        {
            this.setState({
                error : "Select the type of user."
            })
        }
        else {
            const {email, google, name} = this.props.route.params
            if (google===true){
                await this.updateDatabase(email, name)
                    .then(r=> console.log())
            }
            else {
                await this.CreateUserAccount().then(r=>console.log())
            }
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
        marginTop: 30,
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
