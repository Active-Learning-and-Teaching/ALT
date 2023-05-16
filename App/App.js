import React, {FC,useEffect} from 'react';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as config from './config';
import MainNavigator from './Components/Navigation/MainNavigator';
import NotifiactionCentre from './NotificationCenter';
import {BackHandler} from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(['Non-serializable values were found in the navigation state']);

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
