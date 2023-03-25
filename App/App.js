import React, {FC,useEffect} from 'react';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/MaterialIcons';
import MainNavigator from './Components/Navigation/MainNavigator';
import NotifiactionCentre from './NotificationCenter';
import {BackHandler} from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

IconF.loadFont();
IconM.loadFont();
IconI.loadFont();

console.disableYellowBox = true;

const App: FC = () => {
  GoogleSignin.configure({
    // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: config['webClientId'],
    offlineAccess: false,
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  return (
    <>
      <ActionSheetProvider>
        <MainNavigator />
      </ActionSheetProvider>
      <NotifiactionCentre />
    </>
  );
};

export default App;
