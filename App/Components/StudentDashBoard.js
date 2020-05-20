import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';
import {
    Button,
    StyleSheet,
    Text,
    View,
    Alert, ScrollView, SafeAreaView,
} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import {CoursePics} from '../Utils/CoursePics';
import CourseCard from './CourseCard';
import {Icon} from 'react-native-elements';

export default class StudentDashBoard extends Component {
    constructor() {
        super();
        this.state = {
            currentUser : null,
            courseList: []
        };
    }

    getCurrentUser = async () => {
        const currentUser = await auth().currentUser;
        await this.setState({
            currentUser : currentUser
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

    getAllCourses = ()=>{
        database()
            .ref('/1bwxqLCmGXZ31-I7_GOCCWltW7dITFuy5eaKs1CZ2bPw/Courses')
            .on('value', snapshot => {
                const arr = snapshot.val().filter(n=>n)
                const pics = CoursePics
                const dup = []

                for(var i=0; i<arr.length; i++)
                {
                    var dictionary = arr[i]
                    dictionary['ImageUrl'] = pics[i]['imageurl']
                    dup.push(dictionary)
                }
                this.setState({
                    courseList : dup
                })
            })
    }

    componentDidMount(){
        this.getCurrentUser().then(() =>{
            this.getAllCourses()
        })

    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Icon name='plus-circle' type='font-awesome' style={{borderRadius:1}}  />
                    {/*<Icon name='plus' type='font-awesome' style={{borderRadius:1}} />*/}
                    <View style={styles.grid}>
                        {this.state.courseList.map(({Name, Instructor, ImageUrl},i)=> (
                            <CourseCard coursename = {Name} instructor = {Instructor} imageurl = {ImageUrl} key={i}/>
                        ))}
                    </View>
                    <Button style={styles.buttonMessage} title="SignOut" onPress={this.signOut} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    grid: {
        marginTop: 10,
        marginBottom: 10,
        paddingTop : 10,
        paddingBottom : 10,
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 20
    },
    buttonMessage: {
        paddingTop : 10,
        marginTop: 15
    },
});

