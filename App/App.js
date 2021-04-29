import React, {Component, useEffect, FC} from 'react';
import {Alert} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/MaterialIcons';
import MainNavigator from './Components/Navigation/MainNavigator';
import messaging from '@react-native-firebase/messaging';
import NotifiactionCentre from './NotificationCenter';

IconF.loadFont();
IconM.loadFont();
IconI.loadFont();

console.disableYellowBox = true;

const App: FC = () => {
  GoogleSignin.configure({
    // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: config['webClientId'],
    offlineAccess: true,
  });

  return (
    <>
      <MainNavigator />
      <NotifiactionCentre />
    </>
  );
};

export default App;
