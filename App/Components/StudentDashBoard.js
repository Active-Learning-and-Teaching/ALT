import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
    Button,
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';

export default class StudentDashBoard extends Component {
    constructor() {
        super();
        this.state = {
            username : ''
        };
    }

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut()
            this.props.navigation.navigate('Login')
        }
        catch (error) {
            auth()
                .signOut()
                .then(
                    this.props.navigation.navigate('Login')
                )
                .catch(err => {
                    Alert.alert(err.message)
                })
        }
    }


    // componentDidMount(){
    //     // const {username} = auth().currentUser.displayName
    //     // this.setState({username})
    // }

    render(){
        return(
            <View style= {styles.container}>
                <Text > WELCOME Student</Text>
                <Button style={styles.buttonMessage} title="SignOut" onPress={this.signOut} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 35,
        backgroundColor: '#fff'
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 20
    },
    buttonMessage: {
        paddingTop : 10,
        marginTop: 15
    }
});

