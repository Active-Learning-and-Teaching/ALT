import React, { useState, useEffect } from 'react';
import { Button, Text } from 'react-native-elements';
import { View, TextInput, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Dimensions from '../utils/Dimentions'; // Assume you have this utils file

type LogInProps = {
  navigation: any;
};

function LogIn({ navigation }: LogInProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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

  const LoginUser = () => {
    if (email === '' || password === '') {
      setError('Enter details.');
    } else {
      setError(null);
      // Placeholder for login logic
      console.log('Logging in with:', email, password);
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
              onPress={() => navigation.navigate('SignUp')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LogIn;
