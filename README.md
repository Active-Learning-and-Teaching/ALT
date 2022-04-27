# Active Learning and Teaching App :iphone:
[![iOS](https://img.shields.io/badge/-iOS-black?style=flat&logo=apple&link=https://github.com/Active-Learning-and-Teaching/ALT/releases)](https://github.com/Active-Learning-and-Teaching/ALT/releases)
[![Android](https://img.shields.io/badge/-Android-grey?style=flat&logo=android&link=https://github.com/Active-Learning-and-Teaching/ALT/releases)](https://github.com/Active-Learning-and-Teaching/ALT/releases)
[![React Native](https://img.shields.io/badge/-ReactNative-black?style=flat&logo=react)]()
[![Firebase](https://img.shields.io/badge/-Firebase-blue?style=flat&logo=firebase)]()

ALT (Active Learning and Teaching) is a mobile App that allows active learning through instant quizzes and feedback during lectures. The quizzes and feedback questions are given to students as part of the lecture without breaking the flow of the class. The students can respond on the app and the results are summarised by the app for the faculty to understand the state of class and engagement. The app aims to promote data privacy and security by storing minimal user information.

<!-- <img width="731" alt="Screenshot 2021-04-30 at 18 16 51" src="https://user-images.githubusercontent.com/42066451/116697230-8e4b4c80-a9e0-11eb-860d-6fca12a876f5.png"> -->

<img width="1440" alt="Screenshot 2021-08-10 at 04 30 57" src="https://user-images.githubusercontent.com/42066451/128784943-4d3ad9d0-d575-4dfc-9be7-6522114db8ef.png">

## Architecture 🛠

<p align="center">
  <img width="640" alt="logo" src="https://user-images.githubusercontent.com/42066451/137106844-dd12c428-31fc-4895-9a39-85ceb3279428.jpeg">
</p>
                                                                                                                                        
## Setup 📥

1. Clone the repository to local machine
```sh
git clone https://github.com/Active-Learning-and-Teaching/ALT.git
```
2. Install Node Modules
```sh
cd App
npm install --legacy-peer-deps
```
3. Install CocoaPods 
```sh
cd ios
sudo gem install cocoapods
pod install
```
4. Download the following files from the Firebase project and place them in their respective folder.
 - `App/config.json`
 - `App/android/app/google-services.json`
 - `App/ios/GoogleService-Info.plist`

## Build ⚙️

### iOS
 Note : To build on an Macbooks with M1 Chip, open Xcode with Rosetta 2       
 If errors persist, refer this [issue](https://github.com/CocoaPods/CocoaPods/issues/10220)
```
npx react-native run-ios
```

### Android       
```
npx react-native run-android
```

## Release ⬇️
You can install the latest stable version of the app from Releases. The Android app is available on [Google Play Store](https://play.google.com/store/apps/details?id=com.IIITD.ALT) and iOS app is available through [TestFlight](https://testflight.apple.com/join/j232DKdv).
