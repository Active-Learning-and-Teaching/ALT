import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import moment from 'moment';
import database from '@react-native-firebase/database';
import * as config from '../config';
import KbcFacultyPage from './KbcFacultyPage';
import KbcStudentPage from './KbcStudentPage';

export default class KbcHomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            currentQuiz : false,
            currentDuration : 0
        };
    }

    ifCurrentQuiz = ()=>{
        database()
            .ref(config['internalDb']+'/KBC/')
            .orderByChild('passCode')
            .equalTo(this.state.course.passCode)
            .on('value', snapshot => {
                if (snapshot.val()){
                    const values = Object.values(snapshot.val())[0]
                    const starttime = values['startTime']
                    const endtime = values['endTime']
                    const curr = moment().format("DD/MM/YYYY HH:mm:ss")
                    const temp = moment(endtime, "DD/MM/YYYY HH:mm:ss")

                    const duration = Math.abs(moment().diff(temp, "seconds"))
                    if (curr >= starttime && curr <= endtime){
                        console.log(true)
                        this.setState({
                            currentQuiz : true,
                            currentDuration : duration
                        })
                    }
                    else{
                        this.setState({
                            currentQuiz : false,
                            currentDuration : 0
                        })
                    }
                }
            })
    }

    componentDidMount(){
        this.ifCurrentQuiz()
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                {this.state.type === "faculty" ?
                    <KbcFacultyPage
                        currentQuiz = {this.state.currentQuiz}
                        currentDuration = {this.state.currentDuration}
                        user = {this.state.user}
                        course = {this.state.course}
                    />
                :
                    <KbcStudentPage
                        currentQuiz = {this.state.currentQuiz}
                        currentDuration = {this.state.currentDuration}
                        user = {this.state.user}
                        course = {this.state.course}
                    />
                }
            </SafeAreaView>

        )
    }

}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },

})
