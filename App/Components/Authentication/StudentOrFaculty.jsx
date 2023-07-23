import React, {useState,} from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import ErrorMessages from '../../utils/ErrorMessages';
import Faculty from '../../database/Faculty';
import Student from '../../database/Student';
import { useRoute } from '@react-navigation/native';

function StudentOrFaculty({navigation:{navigate}}) {

    const route = useRoute()
    const [selected, setSelected] = useState('')
    const [error, setError] = useState(null)
    const [buttonEnabled, setButtonEnabled] = useState(true)

    const updateDatabase = async(email, name) => {
        if (selected==='faculty'){
            const faculty = new Faculty();
            await faculty.getUser(email)
            .then(async val => {
                if (!val) {
                    await faculty.createUser(name, email)
                    .then(r => {
                        navigate('Faculty DashBoard')
                        if (!route.params.google)
                            route.params.resetStates()
                    })
                }
            })
        }
        else if (selected==='student'){
            const student = new Student();
            await student.getUser(email)
            .then(async val => {
                if (!val){
                    await student.createUser(name, email)
                    .then(r=>{
                        navigate('Student DashBoard')
                        if (!route.params.google)
                            route.params.resetStates()
                    })
                }
            })
        }

    }

    const CreateUserAccount = async () => {
        const {email, password, name} = route.params
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (res) =>{
                await res.user.updateProfile({
                    displayName: name
                })
                .then(async r => {
                    await updateDatabase(email, name)
                        .then(r=> console.log())
                })
            })
            .catch( err => {
                var errorMessages = new ErrorMessages()
                var message = errorMessages.getErrorMessage(err.code)
                setError(message)
                setButtonEnabled(true)
            })
    }

    const RegisterTypeOfUser = async ()=>{
        setButtonEnabled(false)
        if (selected===''){
            setError("Select the type of user.")
            setButtonEnabled(true)
        }
        else {
            const {email, google, name} = route.params
            if (google===true){
                await updateDatabase(email, name)
                    .then(r=> console.log())
            }
            else {
                await CreateUserAccount().then(r=>console.log())
            }
        }
    }
    return(
        <SafeAreaView className="flex flex-col flex-1 p-20 bg-white">
            <ScrollView>
                <View className='flex-1 flex flex-col justify-center items-center p-5 mt-5 bg-white'>
                    <Avatar
                        size="xlarge"
                        rounded
                        source = {require('../../assets/Faculty.png')}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                        onPress={() => {
                            setSelected('faculty')
                            setError(null)
                        }}
                        activeOpacity={0.7}
                        containerStyle={[{
                            marginTop: 30,
                            shadowColor: "black",
                            shadowOpacity: 0.5,
                            borderColor: 'tomato',
                            borderRadius: 80,},
                            {borderWidth: selected==='faculty'?5:0
                        }]}
                    />
                    <Text 
                        className="mt-10 text-2xl font-bold">
                        Faculty
                    </Text>
                    <Avatar
                        size="xlarge"
                        rounded
                        source = {require('../../assets/Student.png')}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                        onPress={() => {
                            setSelected('student')
                            setError(null)
                        }}
                        activeOpacity={0.7}
                        containerStyle={[{
                            marginTop: 30,
                            shadowColor: "black",
                            shadowOpacity: 0.5,
                            borderColor: 'tomato',
                            borderRadius: 80,},
                            {borderWidth: selected==='student'?5:0
                        }]}
                    />
                    <Text 
                        className="mt-10 text-2xl font-bold">
                        Student
                    </Text>

                </View>
                { error ?
                    <Text 
                        className='text-red-500 mb-5 py-2'>
                        {error}
                    </Text> : <Text/>}
                <View >
                    <Button
                        className='mt-10 items-center'
                        buttonStyle= {{ 
                            backgroundColor: 'tomato', 
                            borderRadius:20,
                            width:200,
                            marginVertical:20
                        }} 
                        titleStyle={{
                            color:'white',
                            fontWeight:'normal'
                        }}
                        title="Register"
                        onPress={()=>{
                            if(buttonEnabled)
                                RegisterTypeOfUser()
                        }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StudentOrFaculty
