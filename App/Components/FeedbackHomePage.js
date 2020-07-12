import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import FeedbackStudentPage from './FeedbackStudentPage';
import FeedbackFacultyPage from './FeedbackFacultyPage';
import database from '@react-native-firebase/database';
import * as config from '../config.json';
import moment from 'moment';

export default class FeedbackHomePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            beforeFeedback : false,
            currentFeedback : false,
            currentDuration : 0,
            beforeDuration : 0
        }
        this.setFeedbackState = this.setFeedbackState.bind(this);
    }

    setFeedbackState(){
        this.isCurrentFeedback()
    }

    isCurrentFeedback = ()=>{
        database()
            .ref(config['internalDb']+'/Feedback/')
            .orderByChild('passCode')
            .equalTo(this.state.course.passCode)
            .on('value', snapshot => {
                if (snapshot.val()){
                    const values = Object.values(snapshot.val())[0]
                    const starttime = values['startTime']
                    const endtime = values['endTime']
                    const curr = moment()

                    const temp = moment(endtime, "DD/MM/YYYY HH:mm:ss")
                    const duration = Math.abs(moment().diff(temp, "seconds"))

                    const temp2 = moment(starttime, "DD/MM/YYYY HH:mm:ss")
                    const beforeduration = Math.abs(moment().diff(temp2, "seconds"))

                    if (curr >= temp2 && curr <= temp){
                        this.setState({
                            beforeFeedback : false,
                            currentFeedback : true,
                            currentDuration : duration,
                            beforeDuration : 0
                        })
                    }
                    else if (curr<temp2){
                        this.setState({
                            beforeFeedback : true,
                            currentFeedback : false,
                            currentDuration : 0,
                            beforeDuration : beforeduration
                        })
                    }
                    else{
                        this.setState({
                            beforeFeedback : false,
                            currentFeedback : false,
                            currentDuration : 0,
                            beforeDuration : 0
                        })
                    }
                }
            })
    }

    componentDidMount() {
        this.isCurrentFeedback()
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                {this.state.type === "faculty" ?
                    <FeedbackFacultyPage
                        user = {this.state.user}
                        course = {this.state.course}
                        beforeFeedback = {this.state.beforeFeedback}
                        currentFeedback ={this.state.currentFeedback}
                        currentDuration = {this.state.currentDuration}
                        beforeDuration = {this.state.beforeDuration}
                        setFeedbackState = {this.setFeedbackState}
                    />
                    :
                    <FeedbackStudentPage
                        user = {this.state.user}
                        course = {this.state.course}
                        beforeFeedback = {this.state.beforeFeedback}
                        currentFeedback ={this.state.currentFeedback}
                        currentDuration = {this.state.currentDuration}
                        beforeDuration = {this.state.beforeDuration}
                        setFeedbackState = {this.setFeedbackState}
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

