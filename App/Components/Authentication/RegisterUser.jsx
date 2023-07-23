import React, {useState,useEffect} from 'react';
import {Button} from 'react-native-elements';
import {Text, View, Image, TextInput, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Dimensions from '../../Utils/Dimensions';

function RegisterUser({navigation}) {
  
	const [name,setName] = useState('')
	const [email,setEmail] = useState('')
	const [password,setPassword] = useState('')
	const [confirmPassword,setConfirmPassword] = useState('')
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

	const resetStates = () =>{
		setName('')
		setEmail('')
		setPassword('')
		setConfirmPassword('')
		setError(null)
	}

	const RegisterUserToFirebase = async() => {
		const newName = name.replace(/[^A-Za-z" "]/ig, '').replace(/\s+/g,' ').trim();
		if (email==='' || password==='' || newName==='')
			setError("Enter details.")

		else if(password!==confirmPassword)
			setError("Passwords Don't Match")

		else if (password.length<6)
			setError("Password must be 6 or more characters long.")

		else{
			const newName = name.charAt(0).toUpperCase() + name.slice(1);
			setError(null)
			navigation.navigate(
				'User Type', {
					email : email,
					name : newName,
					password : password,
					resetStates : resetStates
				}
			)
		}
	}

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
				</View>
				<View className="flex flex-col justify-center p-10 bg-white flex-1">
					<TextInput
						className="w-full mb-5 pb-2 self-center border-b border-gray-300 text-black"
						autoCapitalize="words"
						placeholder="Name"
						placeholderTextColor = "grey"
						onChangeText={nameText => setName(nameText)}
						value={name}
					/>
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
					<TextInput
						secureTextEntry
						className="w-full mb-5 pb-2 self-center border-b border-gray-300 text-black"
						autoCapitalize="none"
						placeholder="Confirm Password"
						placeholderTextColor = "grey"
						onChangeText={confirmPasswordText => setConfirmPassword(confirmPasswordText)}
						value={confirmPassword}
					/>

					{ error ?
						<Text 
							className='text-red-500 mb-5 py-2'>
							{error}
						</Text> : <Text/>}
					<View>
						<Button 
							className='mt-10'
							buttonStyle= {{ 
								backgroundColor: 'tomato', 
								borderRadius:20,
								marginVertical:20
							}} 
							title="Continue" 
							titleStyle={{
								color:'white',
								fontWeight:'normal'
							}} 
							onPress={RegisterUserToFirebase} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default RegisterUser

