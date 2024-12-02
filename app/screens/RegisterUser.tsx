import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import { Text, View, Image, TextInput, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Dimensions from '../utils/Dimentions';

const RegisterUser: React.FC = () => {
  // Access the navigation and route hooks directly
  const navigation = useNavigation<any>();
  const route = useRoute();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });

    return unsubscribe;
  }, [navigation]);

  const resetStates = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const RegisterUserToFirebase = async () => {
    const newName = name.replace(/[^A-Za-z" "]/g, '').replace(/\s+/g, ' ').trim();
    if (email === '' || password === '' || newName === '') {
      setError('Enter details.');
    } else if (password !== confirmPassword) {
      setError("Passwords Don't Match");
    } else if (password.length < 6) {
      setError('Password must be 6 or more characters long.');
    } else {
      const formattedName = newName.charAt(0).toUpperCase() + newName.slice(1);
      setError(null);
      navigation.navigate('User Type', {
        email: email,
        name: formattedName,
        password: password,
        resetStates: resetStates,
      });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: 'white' }}>
          <View style={{ alignItems: 'center', paddingBottom: 5 }}>
            <Image
              style={{
                width: Dimensions.window.width / 2.5,
                height: Dimensions.window.width / 2.5,
              }}
              source={require('../../assets/Logo.png')}
            />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: 'white' }}>
          <TextInput
            style={{ width: '100%', marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: 'gray', color: 'black' }}
            autoCapitalize="words"
            placeholder="Name"
            placeholderTextColor="grey"
            onChangeText={(nameText) => setName(nameText)}
            value={name}
          />
          <TextInput
            style={{ width: '100%', marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: 'gray', color: 'black' }}
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor="grey"
            onChangeText={(emailText) => setEmail(emailText)}
            value={email}
          />
          <TextInput
            secureTextEntry
            style={{ width: '100%', marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: 'gray', color: 'black' }}
            autoCapitalize="none"
            placeholder="Password"
            placeholderTextColor="grey"
            onChangeText={(passwordText) => setPassword(passwordText)}
            value={password}
          />
          <TextInput
            secureTextEntry
            style={{ width: '100%', marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: 'gray', color: 'black' }}
            autoCapitalize="none"
            placeholder="Confirm Password"
            placeholderTextColor="grey"
            onChangeText={(confirmPasswordText) => setConfirmPassword(confirmPasswordText)}
            value={confirmPassword}
          />

          {error ? (
            <Text style={{ color: 'red', marginBottom: 5, paddingVertical: 2 }}>{error}</Text>
          ) : (
            <Text />
          )}
          <View>
            <Button
              buttonStyle={{
                backgroundColor: 'tomato',
                borderRadius: 20,
                marginVertical: 20,
              }}
              title="Continue"
              titleStyle={{
                color: 'white',
                fontWeight: 'normal',
              }}
              onPress={RegisterUserToFirebase}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterUser;
