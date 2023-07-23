import React, {useState, useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import ErrorMessages from "../../Utils/ErrorMessages"
import {Button, Text} from 'react-native-elements';
import { View, TextInput, Image, ScrollView, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { GoogleSignin,GoogleSigninButton} from '@react-native-community/google-signin';
import Faculty from '../../Databases/Faculty';
import Student from '../../Databases/Student';
import Dimensions from '../../Utils/Dimensions';

function LogIn({navigation}) {
    route = useRoute()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)

	useEffect(()=>{
		const unsubscribe = navigation.addListener('focus', () => {
			setLoading(true);
			setTimeout(() => {
				setLoading(false);
			}, 2000);
		});
		return unsubscribe;
	},[navigation])

    const LoginUser = async ()=>{
        if (email==='' || password==='')
            setError('Enter details.')

        else{
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(async(res)=> {
                    console.log(res)
                    await route.params.getUserType(res.user.displayName, res.user.email)                    
                    setEmail('')
                    setPassword('')
                    setError(null)
                })
                .catch( err => {
                    var errorMessages = new ErrorMessages()
                    var message = errorMessages.getErrorMessage(err.code)
                    setError(message)
                })
        }
    }

    const signInWithGoogle = async () => {
        try{   
            console.log("Signing in with Google")
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

            return auth()
                .signInWithCredential(googleCredential)
                .then(async ()=>{
                    const faculty = new Faculty()
                    await faculty.getUser(userInfo.user.email)
                    .then(async val => {
                        if (val){
                            navigation.navigate('Faculty DashBoard')
                        }
                        else{
                            const student = new Student();
                            await student.getUser(userInfo.user.email)
                            .then(async val => {
                                if (val){
                                    navigation.navigate('Student DashBoard')
                                }
                                else{
                                    navigation.navigate(
                                        'User Type', {
                                            email : userInfo.user.email,
                                            name : userInfo.user.name,
                                            google : true
                                        }
                                    )
                                }
                            })
                        }
                    })
                });
        }
        catch (error){
            var errorMessages = new ErrorMessages()
            var message = errorMessages.getGoogleSignInError(error.code)
            setError(message)
            console.log("Error",error)
        }
    };

    if(loading){
		return(
			<View className="absolute inset-0 flex items-center justify-center w-screen h-screen bg-white">
				<ActivityIndicator size="large" color="#9E9E9E"/>
			</View>
		)
	}

    return(
        <SafeAreaView className="flex-1 bg-[white]">
            <ScrollView 
                contentContainerStyle={{ 
                    flexGrow: 1, 
                    justifyContent: 'center' 
                }}>
                <View className="flex flex-col justify-center p-10 bg-white flex-1">
                    <View className="items-center pb-5">
                        <Image 
                            style={{
                                width : Dimensions.window.width/2.5,
                                height: Dimensions.window.width/2.5
                            }} 
                            source={require('../../Assets/Logo.png')} 
                        />
                    </View>
                    <View className='pt-10'>
                        <TextInput
                            className="w-full mb-5 pb-2 self-center border-b border-gray-300 text-black"
                            autoCapitalize="none"
                            placeholder="Email"
                            placeholderTextColor = "grey"
                            onChangeText={emailText => setEmail(emailText)}
                            value={email}
                        />
                        <TextInput
                            secureTextEntry
                            className="w-full mb-5 pb-2 self-center border-b border-gray-300 text-black"
                            autoCapitalize="none"
                            placeholder="Password"
                            placeholderTextColor = "grey"
                            onChangeText={passwordText => setPassword(passwordText)}
                            value={password}
                        />

                    { error ?
                        <Text 
                            className='text-red-500 mb-5 py-2'>
                            {error}
                        </Text> : <Text/>}
                        <View >
                            <Button 
                                className='mt-5'
                                titleStyle={{
                                    color:'white',
                                    fontWeight:'normal'
                                }} 
                                buttonStyle= {{ 
                                    backgroundColor: 'tomato', 
                                    borderRadius:20,
                                    marginVertical:20
                                }} 
                                title="Login" 
                                onPress={LoginUser}
                            />
                            <Button
                                titleStyle={{
                                    color:'white',
                                    fontWeight:'normal'
                                }}
                                buttonStyle= {{
                                    backgroundColor: '#333', 
                                    borderColor : 'black', 
                                    borderRadius:20,
                                }}
                                title="Create Account"
                                onPress={() => navigation.navigate('Register User')}
                            />
                            <Text 
                                className='text-black my-2 py-5 self-center'> 
                            </Text>
                            {Platform.OS==='ios'
                                ?
                                <GoogleSigninButton
                                    style={{
                                        borderRadius:20, 
                                        width:192, 
                                        alignSelf: "center", 
                                        borderWidth:2
                                    }}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Light}
                                    onPress={signInWithGoogle}/>
                                    :
                                <GoogleSigninButton
                                    style={{alignSelf:'center'}}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Light}
                                    onPress={signInWithGoogle}/>
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default LogIn