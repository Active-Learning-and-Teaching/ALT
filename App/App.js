import React, {FC, useState} from 'react';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/MaterialIcons';
import MainNavigator from './Components/Navigation/MainNavigator';
import NotifiactionCentre from './NotificationCenter';
import AccessTokenContext from './AuthContext';

IconF.loadFont();
IconM.loadFont();
IconI.loadFont();

console.disableYellowBox = true;

const App: FC = () => {
  const [accessToken, setAccessToken] = useState(null);
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly','https://www.googleapis.com/auth/spreadsheets'],
    webClientId: config['webClientId'],
    offlineAccess: true,
  });

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      <MainNavigator />
      <NotifiactionCentre />
    </AccessTokenContext.Provider>
  );
};

export default App;
