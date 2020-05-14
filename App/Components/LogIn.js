import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import ErrorMessages from "../Utils/ErrorMessages"
import database from '@react-native-firebase/database';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button
} from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-community/google-signin';
import * as config from '../config'

export default class LogIn extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: null,
        };
    }

    LoginUser = ()=>{
        const { email, password } = this.state;

        if (email==='' || password==='')
        {
            this.setState({
                error : "Enter details."
            })
        }
        else
        {
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(()=> {
                    this.setState({
                        email: '',
                        password: '',
                        error: null,
                    })
                    this.props.navigation.navigate('Student DashBoard')
                })
                .catch( err => {
                    var errorMessages = new ErrorMessages()
                    var message = errorMessages.getErrorMessage(err.code)
                    this.setState({
                        error : message
                    })
                })
        }

    }

    signInWithGoogle = async () => {
        try
        {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
            return auth()
                .signInWithCredential(googleCredential)
                .then(()=>{

                    database()
                        .ref(config['sheetFaculty'])
                        .orderByChild("Email")
                        .equalTo(userInfo.user.email)
                        .once("value")
                        .then(snapshot => {

                            if (snapshot.val()) {
                                this.props.navigation.navigate('Faculty DashBoard')
                            }
                            else{
                                this.props.navigation.navigate('Student DashBoard')
                            }
                        })
                });
        }
        catch (error)
        {
            var errorMessages = new ErrorMessages()
            var message = errorMessages.getGoogleSignInError(error.code)
            this.setState({
                error : message
            })
        }
    };

    render(){
        return(
            <View style = {styles.container}>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                { this.state.error ?
                <Text style={styles.errorMessage}>
                    {this.state.error}
                </Text> : <Text/>}

                <Button style={styles.buttonMessage} title="Login" onPress={this.LoginUser} />

                <Text
                    style = {styles.signupText}
                    onPress={() => this.props.navigation.navigate('Register User')}
                >
                    Don't have an account? Register Now
                </Text>

                <Text style = {styles.or}> Or
                </Text>

                <GoogleSigninButton
                    style={styles.googleSigninButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.signInWithGoogle}/>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    textInput: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    signupText: {
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 10,
        paddingBottom: 10,
    },
    buttonMessage: {
        marginTop: 15
    },
    or: {
        color: 'grey',
        marginBottom: 15,
        paddingTop : 13,
        paddingBottom: 13,
        alignSelf: "center",
    },
    googleSigninButton: {
        width: '80%',
        height: '10%',
        alignSelf: "center",
    }

});

