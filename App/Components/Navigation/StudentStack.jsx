import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import StudentList from '../StudentList/StudentList';
import {Icon} from 'react-native-elements';
import {Alert, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {firebase} from '@react-native-firebase/functions';
import { useRoute } from '@react-navigation/native';
const Stack = createStackNavigator();

function StudentStack() {
    const routes = useRoute()
    const {type,user,course} = routes.params

    const showAlert = () => {
        Alert.alert(
            'Email list of students?',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => {console.log('Cancel Pressed')},
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        console.log('triggering mail for passCode:' + course.passCode)
                        Toast.show('Sending Email...');
                        const { data } = firebase.functions().httpsCallable('mailingSystem')({passCode:course.passCode, type:"StudentList"})
                        .catch(function(error) {console.log('There has been a problem with your mail operation: ' + error);})
                    }
                },
            ]
        );
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name='StudentList'
                   component={StudentList}
                   options={{
                       headerShown : true,
                       headerTitle : course.courseName,
                       headerBackTitle: '',
                       headerRight : ()=>(
                           type==='faculty'
                               ?
                               Platform.OS==="android"
                                   ?
                                   <View style={{padding: 10}}>
                                       <Icon
                                           name='envelope-o'
                                           type='font-awesome'
                                           onPress={showAlert}
                                       />
                                   </View>
                                   :
                                   <Icon
                                       name='envelope-o'
                                       type='font-awesome'
                                       style={{borderRadius:1,paddingRight:10}}
                                       onPress={showAlert}
                                   />
                               :
                               null
                       )
                   }}
                   initialParams={{
                       type : type,
                       user: user,
                       course: course,
                   }}
            />
        </Stack.Navigator>
    )
}

export default StudentStack