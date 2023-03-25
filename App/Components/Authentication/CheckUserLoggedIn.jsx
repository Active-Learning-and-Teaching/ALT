import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth'
import {View,ActivityIndicator} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import Faculty from '../../Databases/Faculty';
import Student from '../../Databases/Student';
import {CommonActions } from '@react-navigation/native';

function CheckUserLoggedIn({ navigation: { navigate } }) {

    const signOut = async () => {
        auth()
            .signOut()
            .then(async r=>{
                await navigate.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Login' },
                        ]
                    })
                )

                try{
                    await GoogleSignin.revokeAccess()
                    await GoogleSignin.signOut()
                }
                catch (err) {
                    console.log(err)
                }

            })
            .catch(err => {
                console.log(err.message)
            })
    }

    const getUserType = async (name, email) => {
        console.log(name, email)
        const faculty = new Faculty()
        await faculty.getUser(email)
            .then(async val => {
                if (val){
                    navigate('Faculty DashBoard')
                }
                else{
                    const student = new Student();
                    await student.getUser(email)
                        .then(async val => {
                            console.log(val)
                            if (val){
                                navigate('Student DashBoard')
                            }
                            else{
                                console.log('User not found')
                                navigate(
                                    'Login', {
                                        getUserType : this.getUserType
                                    })
                            }
                        })
                }
            })
    }

    const isGoogleUser = async(name, email) =>{
        try{
            const userInfo = await GoogleSignin.signInSilently();
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
            return auth()
                .signInWithCredential(googleCredential)
                .then(async ()=>{
                    await getUserType(userInfo.user.name, userInfo.user.email)
                        .then(r=>console.log())
                });
        }

        catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                await getUserType(name, email)
                    .then(r=>console.log())
            }
            else if (error.code !== 'ASYNC_OP_IN_PROGRESS') {
                navigate(
                    'Login', {
                        getUserType: getUserType,
                    })
            }
        }
    }

    const logInUser = async () => {
        auth().onAuthStateChanged(async user => {
            if (user) {
                await isGoogleUser(user.displayName, user.email)
                    .then(async r=> {
                        console.log()
                })
            }
            else {
                navigate(
                    'Login', {
                        getUserType : getUserType
                    })
            }
        })
    }

    useEffect(()=>{
        logInUser().then(r => console.log())
    },[])

    return(
        <View className="absolute inset-0 flex items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
    );
}

export default CheckUserLoggedIn