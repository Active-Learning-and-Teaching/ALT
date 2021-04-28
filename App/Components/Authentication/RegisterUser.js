import React, {Component} from 'react';
import {Button} from 'react-native-elements';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    SafeAreaView
} from 'react-native';

export default class RegisterUser extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword : '',
            error: null,
        };
        this.resetStates = this.resetStates.bind(this)
    }

    resetStates(){
        this.setState({
            name: '',
            email: '',
            password: '',
            confirmPassword : '',
            error: null,
        })
    }

    RegisterUserToFirebase = async() => {

        let { email, password, confirmPassword, name } = this.state;

        name = name.replace(/[^A-Za-z" "]/ig, '').replace(/\s+/g,' ').trim();
        if (email==='' || password==='' || name==='')
        {
            this.setState({
                error : "Enter details."
            })
        }
        else if(password!==confirmPassword)
        {
            this.setState({
                error : "Passwords Don't Match"
            })
        }
        else if (password.length<6){
            this.setState({
                error : "Password must be 6 or more characters long."
            })
        }
        else
        {
            name = name.charAt(0).toUpperCase() + name.slice(1);

            this.setState({
                error : null
            })
            this.props.navigation.navigate(
                'User Type', {
                    email : email,
                    name : name,
                    password : password,
                    resetStates : this.resetStates
                }
            )
        }

    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

                <View style = {styles.container}>

                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="words"
                            placeholder="Name"
                            placeholderTextColor = "grey"
                            onChangeText={name => this.setState({ name })}
                            value={this.state.name}
                        />
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            placeholder="Email"
                            placeholderTextColor = "grey"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                        <TextInput
                            secureTextEntry
                            style={styles.textInput}
                            autoCapitalize="none"
                            placeholder="Password"
                            placeholderTextColor = "grey"
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        />
                        <TextInput
                            secureTextEntry
                            style={styles.textInput}
                            autoCapitalize="none"
                            placeholder="Confirm Password"
                            placeholderTextColor = "grey"
                            onChangeText={confirmPassword => this.setState({ confirmPassword })}
                            value={this.state.confirmPassword}
                        />

                        { this.state.error ?
                            <Text style={styles.errorMessage}>
                                {this.state.error}
                            </Text> : <Text/>}
                        <View>
                            <Button style={styles.buttonMessage} buttonStyle={styles.mybutton} title="Continue" onPress={this.RegisterUserToFirebase} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        marginTop : 35,
        backgroundColor: '#fff',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.23,
        shadowRadius: 5.00,
        elevation: 14,
    },
    textInput: {
        color : 'black',
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    loginText: {
        fontSize : 14,
        color: 'blue',
        marginTop: 15,
        textAlign: 'center'
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 10,
        paddingBottom: 10,
    },
    buttonMessage: {
        marginTop: 15
    },
    mybutton:{
        backgroundColor: 'tomato', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:30,
        marginBottom:30
    },
});
