# Active Learning and Teaching App :iphone:
An open-source mobile application to facilitate teaching and learning in courses, including taking quizzes and feedbacks efficiently in classes.

<img width="731" alt="Screenshot 2021-04-30 at 18 16 51" src="https://user-images.githubusercontent.com/42066451/116697230-8e4b4c80-a9e0-11eb-860d-6fca12a876f5.png">

## Folder Structure 📁

```
├── App
│   ├── App.js
│   ├── Assets
│   ├── Components
│   ├── Databases
│   ├── NotificationCenter.tsx
│   ├── Utils
│   ├── __tests__
│   ├── android
│   ├── app.json
│   ├── babel.config.js
│   ├── config.json
│   ├── firebase.json
│   ├── functions
│   ├── index.js
│   ├── ios
│   ├── metro.config.js
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   └── patches
├── Architecture.jpeg
├── README.md
└── SRS.MD
```

## Setup 📥

1. Clone the repository to local machine
```sh
git clone https://github.com/SDOS-Winter2021/Team_1_ALT.git
```
2. Install Node Modules
```sh
cd App
npm install --legacy-peer-deps
```
3. Install CocoaPods
```sh
cd ios
pod install
```
6. Place `config.json` in App/
7. Place `google-services.json` in App/android/app/
8. Place `GoogleService-Info.plist` in App/ios/

## Build ⚙️

### iOS   
`react-native run-ios`  
### Android       
`react-native run-android`

## Release ⬇️
You can install the latest stable version of the app from Releases. The Android app is available as APK and iOS app is available through TestFlight.

## Team ⭐

``` Anuneet Anand | Divyam Gupta | Vishwesh Kumar | Yashdeep Prasad ```
