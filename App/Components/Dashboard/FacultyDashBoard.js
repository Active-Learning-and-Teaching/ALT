import React, {Component} from 'react';
import auth from '@react-native-firebase/auth'
import {StyleSheet,View,Alert, ScrollView, SafeAreaView} from 'react-native';
import {Button} from 'react-native-elements';
import {GoogleSignin} from '@react-native-community/google-signin';
import Faculty from '../../Databases/Faculty';
import database from '@react-native-firebase/database';
import Courses from '../../Databases/Courses';
import CourseCard from './CourseCard';
import {CommonActions} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/functions';
export default class FacultyDashBoard extends Component {
    constructor() {
        super();
        this.state = {
            currentUser : null,
            courseList: []
        };
    }

    getCurrentUser = async () => {
        const curr = await auth().currentUser
        const faculty = new Faculty()
        await faculty.setName(curr.displayName)
        await faculty.setEmail(curr.email)
        await faculty.setUrl().then(()=>{console.log()})

        await this.setState({
            currentUser : faculty
        })
    };

    //@Vishwesh

    deleteAccount = async (url,uid) => {
        const { data } = firebase.functions().httpsCallable('deleteFaculty')({
          key: url,
          uid: uid,
        }).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error);})

        console.log(this.state.currentUser.url);
        console.log('Deleted Account')

    };
    showAlert() {

        Alert.alert(
                'Are you sure you want to delete account?',
                'This will delete all the data associated with the account',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {console.log('Cancel Pressed')},
                        style: 'cancel',
                    },
                    {
                        text: 'Confirm',
                        onPress:  ()=>{
                            const currProfUrl = this.state.currentUser.url
                            const uid = auth().currentUser.uid;
                            console.log(auth().currentUser)
                            this.deleteAccount(currProfUrl,uid)

                            this.props.navigation.dispatch(
                                        CommonActions.reset({
                                            index: 1,
                                            routes: [
                                                { name: 'Login' },
                                            ]
                                        })
                                    )


                        }
                    },
                ]
            );
        }



    signOut = async () => {
        auth()
            .signOut()
            .then(async r=>{
                await this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Login' },
                        ]
                    })
                )

                try{
                    await GoogleSignin.revokeAccess()
                    await GoogleSignin.signOut()
                }
                catch (err) {
                    console.log(err)
                }

            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getAllCourses = ()=>{
        database()
            .ref('InternalDb/Faculty/'+this.state.currentUser.url)
            .on('value', snapshot => {
                if (snapshot.val()){
                    const keys = Object(snapshot.val());

                    this.setState({
                        courseList : []
                    })
                    if ("courses" in keys) {
                        const arr = snapshot.val()["courses"].filter(n=>n)
                        const course = new Courses()
                        const courses = []

                        for(var i=0; i<arr.length; i++){
                            course.getCourseByUrl(arr[i])
                                .then(r => {
                                    if(!("quizEmail" in r))
                                        r.quizEmail = this.state.currentUser.email

                                    if(!("feedbackEmail" in r))
                                        r.feedbackEmail = this.state.currentUser.email

                                    if(!("defaultEmailOption" in r))
                                        r.defaultEmailOption = true

                                    courses.push(r)
                                    this.setState({
                                        courseList : courses
                                    })
                                })
                        }
                    }
                }
            })
    }


    componentDidMount(){
        this.getCurrentUser().then(() =>{
            if(this.state.currentUser.url==""){
                this.componentDidMount()

            }
            this.getAllCourses()
            this.props.route.params.setUser(this.state.currentUser).then(()=>console.log())
        })
        console.log("Faculty Dashboard")
    }

    render(){
        return(
            <SafeAreaView className='flex-1 bg-transparent '>
                <ScrollView>
                    <View className='mt-2 mb-2 pb-2 pt-2 items-center'>
                        {this.state.courseList.map((item,i)=> (
                            <CourseCard
                                course = {item}
                                type = {"faculty"}
                                user = {this.state.currentUser}
                                navigation ={this.props.navigation}
                                key={i}
                            />
                        ))}
                    </View>
                    <Button buttonStyle={styles.signout} title="Sign Out" titleStyle={{color:'white',fontWeight:'normal'}} onPress={this.signOut} />
                    <Button  buttonStyle={styles.account} title="Delete Account" titleStyle={{color:'white',fontWeight:'normal'}} onPress={()=>{this.showAlert()}} />
                </ScrollView>
            </SafeAreaView>
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
    },
    signout:{
        backgroundColor: 'tomato', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:20,
        marginBottom:20,
        marginLeft:100,
        marginRight:100
    },
    account:{
        backgroundColor: '#333', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:30,
        marginBottom:20,
        marginLeft:100,
        marginRight:100
    },
    create:{
        backgroundColor: 'tomato', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:20,
        marginBottom:20,
        marginLeft:100,
        marginRight:100
    },
});
