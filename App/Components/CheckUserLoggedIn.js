import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import database from '@react-native-firebase/database';
import * as config from '../config'


export default class CheckUserLoggedIn extends Component {

    constructor() {
        super();
        this.isGoogleUser = this.isGoogleUser.bind(this)
    }

    isGoogleUser = async ()=>{
        try{

            const userInfo = await GoogleSignin.signInSilently();
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
        catch (error) {
            this.props.navigation.navigate('Login')
        }
    }

    componentDidMount() {
        auth().onAuthStateChanged(user => {
            if (user) {
                this.isGoogleUser()
            }
            else {
                this.props.navigation.navigate('Login')
            }
        })
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

