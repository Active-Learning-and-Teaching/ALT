import React, {Component, useEffect} from 'react';
import {Alert} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/MaterialIcons';
import MainNavigator from './Components/Navigation/MainNavigator';
import messaging from '@react-native-firebase/messaging';

IconF.loadFont();
IconM.loadFont();
IconI.loadFont();

console.disableYellowBox = true;

function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(unsubscribe);
      Alert.alert(
        'A new FCM message has arrived!',
        JSON.stringify(remoteMessage),
      );
    });
    //console.log(unsubscribe);
    return unsubscribe;
  }, []);

  GoogleSignin.configure({
    // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: config.webClientId,
    offlineAccess: true,
  });

  return <MainNavigator />;
}

export default App;
