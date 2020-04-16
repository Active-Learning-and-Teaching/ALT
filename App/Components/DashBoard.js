import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default class DashBoard extends Component {
    constructor() {
        super();
        this.state = {
            username : ''
        };
    }

    componentDidMount(){
        const {username} = auth().currentUser.displayName
        this.setState({username})
    }

    render(){
        return(
            <View style= {styles.container}>
                <Text > WELCOME {this.state.username}</Text>
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
    }


});

