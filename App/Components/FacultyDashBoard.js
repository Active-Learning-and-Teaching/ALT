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
import CourseAdd from './CourseAdd';
import Faculty from '../Databases/Faculty';

export default class FacultyDashBoard extends Component {
    constructor() {
        super();
        this.state = {
            currentUser : null
        };
    }

    getCurrentUser = async () => {
        const currentUser = await auth().currentUser;
        const faculty = new Faculty()
        faculty.setID(currentUser.uid)
        faculty.setName(currentUser.displayName)
        faculty.setEmail(currentUser.email)
        await faculty.setUrl()

        await this.setState({
            currentUser : faculty
        })
    };

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

    getAllCourses = async ()=>{
        // console.log(this.state.currentUser.getID())
        // console.log(this.state.currentUser)

    }


    componentDidMount(){
        this.getCurrentUser().then(() =>{
            this.getAllCourses().then(r => console.log("H"))
        })
    }

    render(){
        return(
            <View style= {styles.container}>
                <Text > WELCOME Faculty</Text>
                <Button style={styles.buttonMessage} title="SignOut" onPress={this.signOut} />

                <CourseAdd instructor = {this.state.currentUser} type = {"faculty"} />

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

