import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import ErrorMessages from '../utils/errormessages';
import Faculty from '../database/faculty';
import Student from '../database/student';
import { useRoute, RouteProp } from '@react-navigation/native';

interface RouteParams {
    email: string;
    password?: string;
    name: string;
    google: boolean;
    resetStates?: () => void;
}

interface NavigationProps {
    navigation: {
        navigate: (screen: string) => void;
    };
}

const StudentOrFaculty: React.FC<NavigationProps> = ({ navigation: { navigate } }) => {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const [selected, setSelected] = useState<'faculty' | 'student' | ''>('');
    const [error, setError] = useState<string | null>(null);
    const [buttonEnabled, setButtonEnabled] = useState<boolean>(true);

    const updateDatabase = async (email: string, name: string): Promise<void> => {
        if (selected === 'faculty') {
            const faculty = new Faculty();
            await faculty.getUser(email).then(async (val) => {
                if (!val) {
                    await faculty.createUser(name, email).then(() => {
                        navigate('Faculty DashBoard');
                        if (!route.params.google && route.params.resetStates) {
                            route.params.resetStates();
                        }
                    });
                }
            });
        } else if (selected === 'student') {
            const student = new Student();
            await student.getUser(email).then(async (val) => {
                if (!val) {
                    await student.createUser(name, email).then(() => {
                        navigate('StudentDashboard');
                        if (!route.params.google && route.params.resetStates) {
                            route.params.resetStates();
                        }
                    });
                }
            });
        }
    };

    const CreateUserAccount = async (): Promise<void> => {
        const { email, password, name } = route.params;
        if (!password) {
            setError('Password is required for account creation.');
            setButtonEnabled(true);
            return;
        }

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (res) => {
                await res.user.updateProfile({
                    displayName: name,
                });
                await updateDatabase(email, name);
            })
            .catch((err) => {
                const errorMessages = new ErrorMessages();
                const message = errorMessages.getErrorMessage(err.code);
                setError(message);
                setButtonEnabled(true);
            });
    };

    const RegisterTypeOfUser = async (): Promise<void> => {
        setButtonEnabled(false);
        if (!selected) {
            setError('Select the type of user.');
            setButtonEnabled(true);
            return;
        }

        const { email, google, name } = route.params;
        if (google) {
            await updateDatabase(email, name);
        } else {
            await CreateUserAccount();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 6, backgroundColor: 'gray' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: 6, borderRadius: 10, shadowColor: 'black', shadowOpacity: 0.5, marginTop: 4 }}>
                    {/* Faculty Avatar */}
                    <Avatar
                        size="xlarge"
                        rounded
                        source={require('../../assets/Faculty.png')}
                        overlayContainerStyle={{ backgroundColor: 'white' }}
                        onPress={() => {
                            setSelected('faculty');
                            setError(null);
                        }}
                        activeOpacity={0.7}
                        containerStyle={[
                            {
                                marginBottom: 20,
                                shadowColor: 'black',
                                shadowOpacity: 0.5,
                                borderColor: 'rgba(255, 99, 71, 1)',
                                borderRadius: 80,
                                borderWidth: selected === 'faculty' ? 5 : 0,
                            },
                        ]}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>Faculty</Text>

                    {/* Student Avatar */}
                    <Avatar
                        size="xlarge"
                        rounded
                        source={require('../../assets/Student.png')}
                        overlayContainerStyle={{ backgroundColor: 'white' }}
                        onPress={() => {
                            setSelected('student');
                            setError(null);
                        }}
                        activeOpacity={0.7}
                        containerStyle={[
                            {
                                marginBottom: 20,
                                shadowColor: 'black',
                                shadowOpacity: 0.5,
                                borderColor: 'rgba(255, 99, 71, 1)',
                                borderRadius: 80,
                                borderWidth: selected === 'student' ? 5 : 0,
                            },
                        ]}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>Student</Text>

                    {/* Error Message */}
                    {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 4 }}>{error}</Text>}

                    {/* Register Button */}
                    <Button
                        buttonStyle={{
                            backgroundColor: 'rgba(255, 99, 71, 1)',
                            borderRadius: 20,
                            paddingHorizontal: 40,
                        }}
                        titleStyle={{
                            color: 'white',
                            fontWeight: '600',
                        }}
                        title="Register"
                        onPress={() => {
                            if (buttonEnabled) RegisterTypeOfUser();
                        }}
                        disabled={!buttonEnabled}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default StudentOrFaculty;
