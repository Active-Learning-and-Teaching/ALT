import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';

export default class CheckUserLoggedIn extends Component {

    componentDidMount() {
        auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'DashBoard' : 'Login')
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

