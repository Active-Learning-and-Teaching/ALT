import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, SafeAreaView} from 'react-native';
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
            buttonEnabled : true
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
                    error : message,
                    buttonEnabled :true,
                })
            })
    }

    RegisterTypeOfUser = async ()=>{
        const { selected} = this.state;

        this.setState({
            buttonEnabled :false
        })

        if (selected==='')
        {
            this.setState({
                error : "Select the type of user.",
                buttonEnabled :true,
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
            <SafeAreaView style = {styles.container}>
                <ScrollView>
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
                            containerStyle={[styles.avatarContainer,{borderWidth: this.state.selected==='faculty'?5:0}]}
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
                            containerStyle={[styles.avatarContainer,{borderWidth: this.state.selected==='student'?5:0}]}
                        />
                        <Text style={styles.text}>Student</Text>

                    </View>
                    { this.state.error ?
                        <Text style={styles.errorMessage}>
                            {this.state.error}
                        </Text> : <Text/>}
                    <View >
                        <Button
                            buttonStyle={styles.mybutton}
                            style={styles.buttonMessage}
                            title="Register"
                            onPress={()=>{
                                if(this.state.buttonEnabled)
                                    this.RegisterTypeOfUser().then(r => console.log())
                            }} />
                    </View>
                </ScrollView>
            </SafeAreaView>
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
        marginTop :20,
        backgroundColor: 'white'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.23,
        shadowRadius: 5.00,
        elevation: 14,
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
        marginTop: 10,
        fontSize:20,
        fontWeight:'bold'
    },
    buttonMessage: {
        marginTop: 15,
        padding : 35,
    },
    avatarContainer:{
        marginTop: 30,
        shadowColor: "black",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10.00,
        elevation: 15,

        borderColor: 'tomato',
        borderRadius: 80,
    },
    mybutton:{
        backgroundColor: 'tomato', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:30,
        marginBottom:30
    },

});
