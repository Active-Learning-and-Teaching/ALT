import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import ErrorMessages from "../../Utils/ErrorMessages"
import {Button, Text} from 'react-native-elements';
import {
    StyleSheet,
    View,
    TextInput,
    Image,
    ScrollView,
    SafeAreaView, Platform
} from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-community/google-signin';
import Faculty from '../../Databases/Faculty';
import Student from '../../Databases/Student';
import Dimensions from '../../Utils/Dimensions';

export default class LogIn extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: null,
        };
    }

    LoginUser = async ()=>{
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
                .then(async(res)=> {
                    console.log(res)

                    await this.props.route.params.getUserType(res.user.displayName, res.user.email)
                        .then(r=>console.log())

                    await this.setState({
                        email: '',
                        password: '',
                        error: null,
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

    }

    signInWithGoogle = async () => {
        try
        {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
            return auth()
                .signInWithCredential(googleCredential)
                .then(async ()=>{

                    const faculty = new Faculty()
                    await faculty.getUser(userInfo.user.email)
                        .then(async val => {
                            if (val){
                                this.props.navigation.navigate('Faculty DashBoard')
                            }
                            else{
                                const student = new Student();
                                await student.getUser(userInfo.user.email)
                                    .then(async val => {
                                        if (val){
                                            this.props.navigation.navigate('Student DashBoard')
                                        }
                                        else{
                                            this.props.navigation.navigate(
                                                'User Type', {
                                                    email : userInfo.user.email,
                                                    name : userInfo.user.name,
                                                    google : true
                                                }
                                            )
                                        }
                                    })
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
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style = {styles.container}>
                        <View style={styles.logo}>
                            <Image style={[styles.image,styles.shadow]} source={require('../../Assets/Logo.png')} />
                        </View>
                        <View style = {styles.styleContainer}>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholder="Email"
                                placeholderTextColor = "grey"
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                            />
                            <TextInput
                                secureTextEntry
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholder="Password"
                                placeholderTextColor = "grey"
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password}
                            />

                        { this.state.error ?
                            <Text style={styles.errorMessage}>
                                {this.state.error}
                            </Text> : <Text/>}
                            <View style={styles.shadow}>
                                <Button  style={styles.buttonMessage} buttonStyle={{backgroundColor: 'black'}} title="Login" onPress={this.LoginUser}/>

                                <Button
                                    buttonStyle= {{borderColor: 'white'}}
                                    type="clear"
                                    title="Don't have an account? Register Now"
                                    titleStyle={styles.loginText}
                                    onPress={() => this.props.navigation.navigate('Register User')}
                                />

                                <Text style={styles.or}> Or
                                </Text>
                                {Platform.OS==='ios'
                                    ?
                                    <GoogleSigninButton
                                        style={styles.googleSigninButton}
                                        size={GoogleSigninButton.Size.Wide}
                                        color={GoogleSigninButton.Color.Light}
                                        onPress={this.signInWithGoogle}/>
                                        :
                                    <GoogleSigninButton
                                        style={{alignSelf:'center'}}
                                        size={GoogleSigninButton.Size.Wide}
                                        color={GoogleSigninButton.Color.Light}
                                        onPress={this.signInWithGoogle}/>
                                }
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 5.00,
        elevation: 14,
    },
    styleContainer:{
        paddingTop:25,
    },
    image : {
        width : Dimensions.window.width/2.5,
        height: Dimensions.window.width/2.5
    },
    logo: {
        alignItems : "center",
        paddingBottom : 5,
    },
    textInput: {
        color : 'black',
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    loginText: {
        fontSize : 14,
        color: 'blue',
        marginTop: 15,
        textAlign: 'center'
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 10,
        paddingBottom: 10,
    },
    buttonMessage: {
        marginTop: 15,
    },
    or: {
        color: 'black',
        marginTop: 10,
        marginBottom: 10,
        paddingTop : 10,
        paddingBottom: 10,
        alignSelf: "center",
    },
    googleSigninButton: {
        width: 192,
        height: 48,
        alignSelf: "center",
    }

});

