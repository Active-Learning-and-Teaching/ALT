import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import StudentList from '../StudentList/StudentList';
import {Icon} from 'react-native-elements';
import {Alert, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {firebase} from '@react-native-firebase/functions';
const Stack = createStackNavigator();

export default class StudentStack extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.route.params.type,
            user: this.props.route.params.user,
            course: this.props.route.params.course,
            studentList : [],
        }
        this.getStudentListData = this.getStudentListData.bind(this);
    }

    getStudentListData(studentData){
        this.setState({
            studentList : studentData
        })
    }

    showAlert() {
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
                        console.log('triggering mail for passCode:' + this.state.course.passCode)
                        Toast.show('Sending Email...');
                        const { data } = firebase.functions().httpsCallable('mailingSystem')({passCode:this.state.course.passCode, type:"StudentList"})
                        .catch(function(error) {console.log('There has been a problem with your mail operation: ' + error);})
                    }
                },
            ]
        );
    }

    render() {

        return (
            <Stack.Navigator>
                <Stack.Screen name='StudentList'
                       component={StudentList}
                       options={{
                           headerShown : true,
                           headerTitle : this.state.course.courseName,
                           headerBackTitle: '',
                           headerRight : ()=>(
                               this.state.type==='faculty'
                                   ?
                                   Platform.OS==="android"
                                       ?
                                       <View style={{padding: 10}}>
                                           <Icon
                                               name='envelope-o'
                                               type='font-awesome'
                                               onPress={()=>{this.showAlert()}}
                                           />
                                       </View>
                                       :
                                       <Icon
                                           name='envelope-o'
                                           type='font-awesome'
                                           style={{borderRadius:1,paddingRight:10}}
                                           onPress={()=>{this.showAlert()}}
                                       />
                                   :
                                   null
                           )
                       }}
                       initialParams={{
                           type : this.state.type,
                           user: this.state.user,
                           course: this.state.course,
                           getStudentListData : this.getStudentListData,
                       }}
                />
            </Stack.Navigator>
        )
    }
}
