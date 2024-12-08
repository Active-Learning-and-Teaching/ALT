import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Faculty from '../database/faculty';
import Student from '../database/student';
import { CommonActions, NavigationProp } from '@react-navigation/native';

type CheckUserLoggedInProps = {
    navigation: NavigationProp<any, any>; // Replace `any` with your actual navigation type if available
};

function CheckUserLoggedIn({ navigation }: CheckUserLoggedInProps) {
    const signOut = async (): Promise<void> => {
        try {
            await auth().signOut();
            navigation.navigate('Login');

            try {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            } catch (err) {
                console.log(err);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const getUserType = async (name: string, email: string): Promise<void> => {
        console.log(name, email);
        const faculty = new Faculty();
        try {
            const val = await faculty.getUser(email);
            if (val) {
                navigation.navigate('Faculty DashBoard');
            } else {
                const student = new Student();
                const studentVal = await student.getUser(email);
                console.log(studentVal);
                if (studentVal) {
                    navigation.navigate('Student DashBoard');
                } else {
                    console.log('User not found');
                    navigation.navigate('Login', {
                        getUserType: getUserType,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching user type:', error);
        }
    };

    const logInUser = async (): Promise<void> => {
        auth().onAuthStateChanged(async user => {
            if (user) {
                console.log('User is signed in');
                const name = user.displayName || '';
                const email = user.email || '';
                getUserType(name, email);
            } else {
                navigation.navigate('Login', {
                    getUserType: getUserType,
                });
            }
        });
    };

    useEffect(() => {
        logInUser().then(() => console.log());
    }, []);

    return (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'white' }}>
            <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
    );
}

export default CheckUserLoggedIn;
