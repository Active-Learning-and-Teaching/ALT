/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {typography} from './Utils/typography';

typography();

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  console.log(authStatus);
}

requestUserPermission();

// messaging()
//   .hasPermission()
//   .then(enabled => {
//     if (enabled) {
//       messaging()
//         .getToken()
//         .then(token => {
//           console.log('getting Token');
//           console.log(token);
//         })
//         .catch(error => {
//           /* handle error */
//           console.log(error);
//         });
//     }
//   })
//   .catch(error => {
//     /* handle error */
//     console.log(error);
//   });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('----------');
  console.log('In Back Ground');
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
