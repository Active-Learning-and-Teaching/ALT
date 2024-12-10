import React, { useState, useEffect } from 'react';
import { Button, Text } from 'react-native-elements';
import { View, TextInput, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Dimensions from '../utils/Dimentions'; // Assume you have this utils file
import auth from '@react-native-firebase/auth';
import ErrorMessages from '../utils/errormessages';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import Faculty from '../database/faculty';
import Student from '../database/student';

// Define the type for your route parameters
type RootStackParamList = {
  LogIn: {
    getUserType: (displayName: string, email: string) => Promise<string>; // Returns userType as a string
  };
  RegisterUser: undefined;
  StudentDashboard: undefined;
  AdminDashboard: undefined;
};

type LogInProps = {
  navigation: any;
};

function LogIn({ navigation }: LogInProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRoute<RouteProp<RootStackParamList, 'LogIn'>>();
  const nav = useNavigation<any>();

  GoogleSignin.configure({
    webClientId: "50954815215-nmndogittp58jvj65qk7vntqk53430oq.apps.googleusercontent.com"
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
    return unsubscribe;
  }, [navigation]);

  const LoginUser = async () => {
    if (email === '' || password === '') {
      setError('Enter details.');
    } else {
      try {
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(async(res)=> {
                    console.log(res)
                    if (res.user) {
                        const name = res.user.displayName || '';
                        const email = res.user.email || '';
                        const userType = await route.params.getUserType(name, email);
                    }
                    setEmail('')
                    setPassword('')
                    setError(null)
                })
                .catch( err => {
                    var errorMessages = new ErrorMessages()
                    var message = errorMessages.getErrorMessage(err.code)
                    setError(message)
                })
      } catch (err: any) {
        const errorMessages = new ErrorMessages();
        const message = errorMessages.getErrorMessage(err.code);
        setError(message);
      }
    }
  };

  const signInWithGoogle = async () => {
    try{   
        console.log("Signing in with Google")
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        if (userInfo.type === 'success') {

            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data.idToken);
    
            return auth()
                .signInWithCredential(googleCredential)
                .then(async ()=>{
                    const faculty = new Faculty()
                    await faculty.getUser(userInfo.data.user.email)
                    .then(async val => {
                        if (val){
                            navigation.navigate('Faculty DashBoard')
                        }
                        else{
                            const student = new Student();
                            await student.getUser(userInfo.data.user.email)
                            .then(async val => {
                                if (val){
                                    navigation.navigate('Student DashBoard')
                                }
                                else{
                                    navigation.navigate(
                                        'User Type', {
                                            email : userInfo.data.user.email,
                                            name : userInfo.data.user.name,
                                            google : true
                                        }
                                    )
                                }
                            })
                        }
                    })
                });
            }
            
      }
      catch (error: any){
        var errorMessages = new ErrorMessages()
        var message = errorMessages.getGoogleSignInError(error.code)
        setError(message)
        console.log("Error",error)
    }
};


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ padding: 10, backgroundColor: 'white' }}>
          <View style={{ alignItems: 'center', paddingBottom: 5 }}>
            <Image
              style={{
                width: Dimensions.window.width / 2.5,
                height: Dimensions.window.width / 2.5,
              }}
              source={require('../../assets/Logo.png')}
            />
          </View>
          <View style={{ paddingTop: 10 }}>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: 'gray',
                paddingBottom: 10,
                marginBottom: 15,
                color: 'black',
              }}
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor="grey"
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              secureTextEntry
              style={{
                borderBottomWidth: 1,
                borderColor: 'gray',
                paddingBottom: 10,
                marginBottom: 15,
                color: 'black',
              }}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor="grey"
              onChangeText={setPassword}
              value={password}
            />

            {error ? (
              <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
            ) : null}
            <Button
              title="Login"
              buttonStyle={{
                backgroundColor: 'tomato',
                borderRadius: 20,
                marginVertical: 20,
              }}
              onPress={LoginUser}
            />
            <Button
              title="Create Account"
              buttonStyle={{
                backgroundColor: '#333',
                borderRadius: 20,
              }}
              onPress={() => navigation.navigate('Register User')}
            />
            <Text 
                style={{ color: 'black', marginTop: 2, marginBottom: 5, paddingVertical: 5, alignSelf: 'center' }}> 
            </Text>
            {<GoogleSigninButton
              style={{
                  borderRadius:20, 
                  width:192, 
                  alignSelf: "center", 
                  borderWidth:2
              }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={signInWithGoogle}
            />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LogIn;
