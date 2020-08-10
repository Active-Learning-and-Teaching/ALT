import React, {Component} from 'react'
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config'
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/MaterialIcons';
import MainNavigator from './Components/Navigation/MainNavigator';

IconF.loadFont();
IconM.loadFont();
IconI.loadFont();

console.disableYellowBox = true;

export default class App extends Component{

    componentDidMount(): void {
        GoogleSignin.configure({
            // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: config.webClientId,
            offlineAccess: true
        })
    }

    render() {

        return (
            <MainNavigator/>
        );
    }

}
