import React, {useState,useEffect} from 'react';
import auth from '@react-native-firebase/auth'
import {StyleSheet,View,Alert, ScrollView, SafeAreaView} from 'react-native';
import {Button} from 'react-native-elements';
import {GoogleSignin} from '@react-native-community/google-signin';
import Faculty from '../../Databases/Faculty';
import database from '@react-native-firebase/database';
import Courses from '../../Databases/Courses';
import CourseCard from './CourseCard';
import {CommonActions, useRoute} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/functions';

function FacultyDashBoard({navigation:{navigate}}) {

    const route = useRoute()
    const {setUser} = route.params
    const [currentUser, setCurrentUser] = useState(null)
    const [courseList, setCourseList] = useState([])

    //@Vishwesh
    const deleteAccount = async (url,uid) => {
        const { data } = firebase.functions().httpsCallable('deleteFaculty')({
          key: url,
          uid: uid,
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error)
        })

        console.log(currentUser.url);
        console.log('Deleted Account')
    }

    const showAlert = () => {
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
                            const currProfUrl = currentUser.url
                            const uid = auth().currentUser.uid;
                            console.log(auth().currentUser)
                            deleteAccount(currProfUrl,uid)

                            navigate.dispatch(
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



    const signOut = async () => {
        auth()
        .signOut()
        .then(async r=>{
            await navigate.dispatch(
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

    const getAllCourses = (currentUser) =>{
        database()
            .ref('InternalDb/Faculty/'+currentUser.url)
            .on('value', snapshot => {
                if (snapshot.val()){
                    const keys = Object(snapshot.val());
                    if ("courses" in keys) {
                        const arr = snapshot.val()["courses"].filter(n=>n)
                        const course = new Courses()
                        console.log(arr)
                        // setCourseList([])
                        for(var i=0; i<arr.length; i++){
                            course.getCourseByUrl(arr[i])
                            .then(r => {
                                if(!("quizEmail" in r))
                                    r.quizEmail = currentUser.email

                                if(!("feedbackEmail" in r))
                                    r.feedbackEmail = currentUser.email

                                if(!("defaultEmailOption" in r))
                                    r.defaultEmailOption = true

                                setCourseList(prev=>[...prev,r]);
                            })
                        }
                    }
                }
            })
    }
    
    useEffect(() => {	
		const onLoad = async() =>{
			const curr = await auth().currentUser      
            const faculty = new Faculty()
            await faculty.setName(curr.displayName)
            await faculty.setEmail(curr.email)
            await faculty.setUrl()
            setCurrentUser(faculty)
			getAllCourses(faculty);
			setUser(faculty)
		}

        onLoad()
	},[])

    return(
        <SafeAreaView className='flex-1 bg-transparent '>
            <ScrollView>
                <View className='mt-2 mb-2 pb-2 pt-2 items-center'>
                    {courseList.map((item,i)=> (
                        <CourseCard
                            course = {item}
                            type = {"faculty"}
                            user = {currentUser}
                            navigation ={navigate}
                            key={i}
                        />
                    ))}
                </View>
                <Button 
                    buttonStyle={styles.signout} 
                    title="Sign Out" 
                    titleStyle={{color:'white',fontWeight:'normal'}}
                    onPress={signOut} 
                />
                <Button  
                    buttonStyle={styles.account} 
                    title="Delete Account" 
                    titleStyle={{color:'white',fontWeight:'normal'}} 
                    onPress={showAlert} 
                />
            </ScrollView>
        </SafeAreaView>
    );
}

export default FacultyDashBoard

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
