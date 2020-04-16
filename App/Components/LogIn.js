import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button
} from 'react-native';

export default class LogIn extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: null,
        };
    }

    LoginUser = ()=>{
        const { email, password } = this.state;

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(()=> {
                this.setState({
                    email: '',
                    password: '',
                    error: null,
                })
                this.props.navigation.navigate('DashBoard')
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

                <Button title="Login" onPress={this.LoginUser} />

                <Text
                    style = {styles.signupText}
                    onPress={() => this.props.navigation.navigate('Register User')}
                >
                    Don't have an account? Register Now
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
    signupText: {
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    }

});

