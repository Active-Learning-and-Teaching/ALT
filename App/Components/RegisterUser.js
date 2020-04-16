import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
} from 'react-native';

export default class RegisterUser extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            error: null,
        };
    }

    RegisterUserToFirebase = () => {
        auth()
            .createUserWithEmailAndPassword( this.state.email, this.state.password)
            .then((res) =>{
                res.user.updateProfile({
                    displayName : this.state.name
                })
                this.setState({
                    name: '',
                    email: '',
                    password: '',
                    error: null,
                })
                this.props.navigation.navigate('Login')
            })
            .catch(err => this.setState({
                error : err.message
            }))
    }

    render(){
        return(
            <View style = {styles.container}>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Name"
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                { this.state.error ?
                    <Text style={{ color: 'red'}}>
                        {this.state.error}
                    </Text> : <Text/>}

                <Button title="Register" onPress={this.RegisterUserToFirebase} />

                <Text
                    style = {styles.loginText}
                    onPress={() => this.props.navigation.navigate('Login')}
                >
                    Already have an account? Login
                </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    textInput: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    loginText: {
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    }
});

