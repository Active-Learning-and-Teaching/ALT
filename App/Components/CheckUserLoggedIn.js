import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';



export default class CheckUserLoggedIn extends Component {

    constructor() {
        super();
        this.isGoogleUser = this.isGoogleUser.bind(this)
    }

    isGoogleUser = async ()=>{
        try{

            const { idToken } = await GoogleSignin.signInSilently();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            return auth()
                .signInWithCredential(googleCredential)
                .then(this.props.navigation.navigate('DashBoard'));

        }
        catch (error) {
            this.props.navigation.navigate('Login')
        }
    }

    componentDidMount() {
        auth().onAuthStateChanged(user => {
            if (user)
                this.props.navigation.navigate('DashBoard')
            else {
                this.isGoogleUser()
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

