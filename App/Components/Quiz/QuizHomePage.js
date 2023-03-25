import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import moment from 'moment';
import database from '@react-native-firebase/database';
import QuizFacultyPage from './QuizFacultyPage';
import QuizStudentPage from './QuizStudentPage';

export default class QuizHomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isTA: null,
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            currentQuiz : false,
            currentDuration : 0,
            quizType:"",
            questionCount : 0
        };
        this.setQuizState = this.setQuizState.bind(this);
    }

    setQuizState(){
        this.setState({
          currentQuiz : false,
        })
    }

    ifCurrentQuiz = ()=>{
        database()
            .ref('InternalDb/KBC/')
            .orderByChild('passCode')
            .equalTo(this.state.course.passCode)
            .on('value', snapshot => {
                if (snapshot.val()){
                    const values = Object.values(snapshot.val())[0]
                    console.log("serverTime: "+database().getServerTime())
                    const curr = moment.utc(database().getServerTime())
                    const startTime = moment.utc(values['startTime'], "DD/MM/YYYY HH:mm:ss")
                    const endTime = moment.utc(values['endTime'], "DD/MM/YYYY HH:mm:ss")
                    const duration = Math.abs(moment.utc(curr).diff(endTime, "seconds"))
                    console.log(curr)
                    console.log(startTime)
                    console.log(endTime)
                    if (curr >= startTime && curr <= endTime){
                        this.setState({
                            currentQuiz : true,
                            currentDuration : duration,
                            quizType: values['quizType'],
                            questionCount : values['questionCount']
                        })
                    }
                    else{
                        this.setState({
                            currentQuiz : false,
                            currentDuration : 0,
                            quizType: values['quizType'],
                            questionCount : values['questionCount']
                        })
                    }
                }
            })
    }
    async setIsTA() {
        const AllTAs = Object.keys(this.state.course.TAs)
        AllTAs.forEach(element => {
            isTA=false||element.includes(this.state.user.url)
        });
        await this.setState({
            isTA: isTA,
        })
        console.log(this.state.isTA)
    }

    componentDidMount(){
        this.ifCurrentQuiz()
        this.setIsTA()
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                {this.state.type === "faculty" ||this.state.isTA ?
                    <QuizFacultyPage
                        currentQuiz = {this.state.currentQuiz}
                        currentDuration = {this.state.currentDuration}
                        user = {this.state.user}
                        course = {this.state.course}
                        setQuizState = {this.setQuizState}
                        quizType = {this.state.quizType}
                        questionCount = {this.state.questionCount}
                    />
                :
                    <QuizStudentPage
                        currentQuiz = {this.state.currentQuiz}
                        currentDuration = {this.state.currentDuration}
                        user = {this.state.user}
                        isTA = {this.state.isTA}
                        course = {this.state.course}
                        setQuizState = {this.setQuizState}
                        quizType = {this.state.quizType}
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "center",
    },

})
