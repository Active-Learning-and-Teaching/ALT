import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import Faculty from '../../Databases/Faculty';
import Student from '../../Databases/Student';


export default class CheckUserLoggedIn extends Component {

    constructor() {
        super();
        this.isGoogleUser = this.isGoogleUser.bind(this)
        this.getUserType = this.getUserType.bind(this)
    }

    async getUserType (name, email) {

        console.log(name, email)

        const faculty = new Faculty()
        await faculty.getUser(email)
            .then(async val => {
                if (val){
                    this.props.navigation.navigate(
                        'Faculty DashBoard', {
                            name : name,
                            email : email
                        })
                }
                else{
                    const student = new Student();
                    await student.getUser(email)
                        .then(async val => {
                            if (val){
                                this.props.navigation.navigate(
                                    'Student DashBoard', {
                                        name : name,
                                        email : email
                                    })
                            }
                            else{
                                this.props.navigation.navigate(
                                    'Login', {
                                        getUserType : this.getUserType
                                    })
                            }
                        })
                }
            })
    }

    isGoogleUser = async(name, email)=>{

        try{
            const userInfo = await GoogleSignin.signInSilently();
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
            return auth()
                .signInWithCredential(googleCredential)
                .then(async ()=>{
                    await this.getUserType(userInfo.user.name, userInfo.user.email)
                        .then(r=>console.log(userInfo.user.email))
                });
        }

        catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                await this.getUserType(name, email)
                    .then(r=>console.log(email))
            }
            else if (error.code !== 'ASYNC_OP_IN_PROGRESS') {
                this.props.navigation.navigate(
                    'Login', {
                        getUserType: this.getUserType,
                    })
            }
        }
    }

    logInUser = async () => {
        auth().onAuthStateChanged(async user => {
            if (user) {
                await this.isGoogleUser(user.displayName, user.email)
                    .then(async r=> {
                        console.log(user.displayName)
                })
            }
            else {
                this.props.navigation.navigate(
                    'Login', {
                        getUserType : this.getUserType
                    })
            }
        })
    }

    componentDidMount() {
        this.logInUser().then(r => console.log())
    }

    render(){
        return(
            <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});

