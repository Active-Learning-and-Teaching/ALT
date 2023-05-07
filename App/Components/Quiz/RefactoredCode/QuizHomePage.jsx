//Possible bug in line 81 because function is passed prop - useCallback

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import moment from 'moment';
import database from '@react-native-firebase/database';
import QuizFacultyPage from './QuizFacultyPage';
import QuizStudentPage from './QuizStudentPage';
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';



 const QuizHomePage = (props) => {
   
    const [state,setState] = useState({
            isTA: null,
            type : props.route.params.type,
            course : props.route.params.course,
            user : props.route.params.user,
            currentQuiz : false,
            currentDuration : 0,
            quizType:"",
            questionCount : 0
    })

    const setQuizState = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            currentQuiz:false
        }))
    },[])

    

    ifCurrentQuiz = ()=>{
        database()
            .ref('InternalDb/KBC/')
            .orderByChild('passCode')
            .equalTo(state.course.passCode)
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
                        setState (prevState => ({
                            ...prevState,
                            currentQuiz : true,
                            currentDuration : duration,
                            quizType: values['quizType'],
                            questionCount : values['questionCount']

                        }))
                       
                    }
                    else{

                        setState(prevState => ({
                            ...prevState,
                            currentQuiz : false,
                            currentDuration : 0,
                            quizType: values['quizType'],
                            questionCount : values['questionCount']

                        }))
    
                    }
                }
            })
    }


    const setIsTA = async () => {
        const AllTAs = Object.keys(state.course.TAs)
        AllTAs.forEach(element => {

            isTA=false||element.includes(state.user.url)
        });

         setState(prevState => ({
            ...prevState,
            isTA:isTA,
        }))
        
        console.log(state.isTA)
    }
    useEffect(()=>{
        ifCurrentQuiz()
        setIsTA()
    },[])

    
    
        return(
            <SafeAreaView style={styles.safeContainer}>
                {state.type === "faculty" ||state.isTA ?
                    <QuizFacultyPage
                        currentQuiz = {state.currentQuiz}
                        currentDuration = {state.currentDuration}
                        user = {state.user}
                        course = {state.course}
                        setQuizState = {setQuizState}
                        quizType = {state.quizType}
                        questionCount = {state.questionCount}
                    />
                :
                    <QuizStudentPage
                        currentQuiz = {state.currentQuiz}
                        currentDuration = {state.currentDuration}
                        user = {state.user}
                        isTA = {state.isTA}
                        course = {state.course}
                        setQuizState = {setQuizState}
                        quizType = {state.quizType}
                    />
                }
            </SafeAreaView>

        )
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

export default QuizHomePage;
