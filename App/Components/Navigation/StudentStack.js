import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import StudentList from '../StudentList/StudentList';
import {Icon} from 'react-native-elements';

const Stack = createStackNavigator();

export default class StudentStack extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.route.params.type,
            user: this.props.route.params.user,
            course: this.props.route.params.course
        }
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
                                       <Icon
                                           name='ellipsis-v'
                                           type='font-awesome'
                                           style={{borderRadius:1, padding:20}}
                                           // onPress={alert("Mail Student list?")}
                                       />
                                       :
                                       <Icon
                                           name='ellipsis-v'
                                           type='font-awesome'
                                           style={{borderRadius:1,paddingRight:10}}
                                           // onPress={alert("Mail Student list?")}
                                       />
                                   :
                                   null
                           )
                       }}
                       initialParams={{
                           type : this.state.type,
                           user: this.state.user,
                           course: this.state.course
                       }}
                />
            </Stack.Navigator>
        )
    }
}
