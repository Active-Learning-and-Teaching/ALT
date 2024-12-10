import React from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View, TextInput, Animated} from 'react-native';
import {Slider, Text, Button,Icon} from 'react-native-elements';
import Quiz from '../database/quiz';
import moment from 'moment';
import Options from './options';
import CountDown from 'react-native-countdown-component';
import QuizResultGraph from './quizResultGraph';
import Toast from 'react-native-simple-toast';
import Dimensions from '../utils/Dimentions';
import database from "@react-native-firebase/database";
import MultiCorrectOptions from './multicorrect';
import {firebase} from '@react-native-firebase/functions';
import { useState, useEffect, useCallback } from 'react';
import SwitchSelector from "react-native-switch-selector";


interface QuizFacultyPageProps {
    isTA: boolean | null;
    course: {
        passCode: string;
        defaultEmailOption: boolean;
    };
    user: {url: string, name: string, email: string};
    quizType: "mcq" | "numeric" | "alphaNumerical" | "multicorrect";
    currentQuiz: boolean;
    currentDuration: number;
    questionNumber: string;
    setQuizState: () => void;
}

interface QuizFacultyPageState {
    isTA: boolean | null;
    course: {
        passCode: string;
    };
    user: {url: string, name: string, email: string};
    time: number;
    option: string;
    icon: string;
    correctAnswer: string;
    resultPage: boolean;
    emailStatus: boolean;
    error: string | null;
    date: string;
    results: string;
    typeofQuiz: string;
    loading: boolean;
    quizNumber: string;
    errorRate: string;
}

const QuizFacultyPage: React.FC<QuizFacultyPageProps> = (props) => {
    
    const [state, setState] = useState<QuizFacultyPageState>({
        isTA: props.isTA,
        course: props.course,
        user: props.user,
        time: 2,
        option: '*',
        icon: '',
        correctAnswer: '*',
        resultPage: false,
        emailStatus: false,
        error: null,
        date: '',
        results: '',
        typeofQuiz: 'mcq',
        loading: true,
        quizNumber: '',
        errorRate: '*'
    });

    const quizresultData = useCallback((resultData: string, quizNumber: string) => {
        setState(prevState => ({
            ...prevState,
            results: resultData,
            quizNumber: quizNumber
        }));
    }, []);

    const checkEmailSent = useCallback(async () =>{
        const Kbc = new Quiz()
        await Kbc.getTiming(state.course.passCode).then( async value => {
            console.log("gettting called in loop")
            if(value!=null){
                setState (prevState => ({
                    ...prevState,
                    emailStatus : !value["emailResponse"],
                    resultPage: true,
                    correctAnswer : value["correctAnswer"],
                    date : value["startTime"]

                }))
               
            }
            if (state.correctAnswer===''){
                setState(prevState => ({
                    ...prevState,
                    resultPage : false
                }))
            }
        })

        console.log("let's see",state.correctAnswer) 
    },[])

    useEffect(() => {
        checkEmailSent().then(r=>{if (state.correctAnswer===''){
            setState(prevState => ({
                ...prevState,
                resultPage : false
            }))
            }})  
    },[])

    const setOption = useCallback((value: string) => {
        if(value==="")
            value="*"
         setState(prevState => ({
            ...prevState,
            option : value,
            icon : value,
        }))

    },[])

    

    const dbUpdateEmailStatus = async () =>{
        const Kbc = new Quiz()
        Kbc.getTiming(state.course.passCode)
            .then(value => {
                Kbc.getQuestion(state.course.passCode)
                    .then(values => {
                        if (values===null || value===null){
                            return;
                        }
                        const url = values.id;
                        Kbc.setQuestion(
                            state.course.passCode,
                            value["startTime"],
                            value["endTime"],
                            value["duration"],
                            value["correctAnswer"],
                            String(value["errorRate"]), // Provide a default value of 0 if errorRate is undefined
                            value["instructor"],
                            value["quizType"],
                            url || '',
                            true,
                            value["questionCount"] || 0,
                        )
                    })
            })
    }

    const startKBC = async (action = "start") => {
        if (action==="stop")
        {
            console.log("Created stop Quiz"); 
            console.log(state.correctAnswer);
            setState (prevState => ({
                ...prevState,
                time : 2,
                option : "*",
                icon : "",
                correctAnswer : "-",
                resultPage : false,
                emailStatus : false,
                error : null,
                date : "",
                results :"",
                typeofQuiz : "mcq",

            }))
        
            props.setQuizState()
            const kbc = new Quiz()
            await kbc.getQuestion(state.course.passCode)
            .then((values)=>{
                if (values===null){
                    return;
                }
                const url = values.id;
                const questionCount = values.questionCount;
                if (questionCount === undefined) {
                    return;
                }
                kbc.setQuestion(
                    state.course.passCode,
                    '',
                    '',
                    '',
                    '',
                    '',
                    state.user.email,
                    '',
                    url,
                    false,
                    questionCount-1
                ).then(r => {console.log("update")})})
        }

        else
        {

        const {option, time, errorRate} = state;

        if (option === '') {
            setState(prevState => ({
                ...prevState,
                error: "Please select correct answer."

            }))

        }
        else {
            const kbc = new Quiz()
            const curr = database().getServerTime()
            const startTime = moment.utc(curr).format("DD/MM/YYYY HH:mm:ss")
            const endTime = moment.utc(curr).add(time, 'minutes').format("DD/MM/YYYY HH:mm:ss")

            await kbc.getQuestion(state.course.passCode)
                .then((values)=>{
                    if (values===null){
                        kbc.createQuestion(
                            state.course.passCode,
                            startTime,
                            endTime,
                            time,
                            option,
                            errorRate,
                            state.user.email,
                            state.typeofQuiz
                        ).then(r => {
                                console.log("create")
                            })
                    }
                    else{
                        const url = values.id;
                        const questionCount = values.questionCount
                        kbc.setQuestion(
                            state.course.passCode,
                            startTime,
                            endTime,
                            String(time),
                            option,
                            errorRate,
                            state.user.email,
                            state.typeofQuiz,
                            url,
                            false,
                            (questionCount || 0) + 1
                        ).then(r => {
                            console.log("update")
                        })

                    }
                    setState(prevState => ({
                        ...prevState,
                        time: 2,
                        option: "*",
                        icon: "",
                        error: null

                    }))
                })

        }}

    }

    const dbUpdateCorrectAnswer = async () => {
        const option = state.option
        const error= state.errorRate
        
        if (option === "" || option === "*") {
            setState(prevState => ({
                ...prevState,
                error: "Please type correct answer."

            }))
           
        }
        else if(state.typeofQuiz ==="numeric" && (isNaN(parseFloat(option.toString())) || isNaN(parseFloat(error.toString()))) )
        {
            setState(prevState => ({
                ...prevState,
                error: "Please type Numerical Response"

            }))
            
        }
        else{
            setState(prevState => ({
                ...prevState,
                error: null

            }))
            
            const Kbc = new Quiz()
            Kbc.getTiming(state.course.passCode)
                .then(value => {
                    Kbc.getQuestion(state.course.passCode)
                        .then(values => {
                            if (values===null || value===null){
                                return;
                            }
                            const url = values.id;
                            Kbc.setQuestion(
                                state.course.passCode,
                                value["startTime"],
                                value["endTime"],
                                value["duration"],
                                state.option,
                                state.errorRate,
                                value["instructor"],
                                value["quizType"],
                                url,
                                value["emailResponse"] || false,
                                value["questionCount"]
                            )
                            Toast.show('Correct Answer has been recorded!', Toast.LONG);
                        })
                })
        }
    }

    const QuizMailer = useCallback(async () => {
        console.log('triggering mail for passCode:' + state.course.passCode)
        Toast.show('Sending Email...', Toast.LONG);
        const data = firebase
                    .functions()
                    .httpsCallable('mailingSystem')({
                        passCode:state.course.passCode, 
                        type:"Quiz"
                    })
                    .catch(function(error) {
                        console.log('There has been a problem with your mail operation: ' + error);
                    })
        await dbUpdateEmailStatus().then(() => {
            setState(prevState => ({
                ...prevState,
                emailStatus: false,
            }))
            })
        console.log("Email Status Updated",data)
    },[])


    if(!state.loading){
        return(
            <SafeAreaView style={styles.safeContainer}>

                { props.currentQuiz === false
                ?
                    state.resultPage === false
                    ?
                <ScrollView>
                    <View style={{padding:20}}>
                    <Text style={styles.heading}>Quiz {props.questionNumber + 1} </Text>
                    <View style={styles.selector}>
                        <SwitchSelector
                            initial={0}
                            onPress={value => {
                                console.log(value)
                                if(value===0){
                                    setState(prevState => ({
                                        ...prevState,
                                        typeofQuiz : "mcq"
                                    }))
                                }
                                else if(value===1){
                                    setState(prevState => ({
                                        ...prevState,
                                        typeofQuiz : "multicorrect"
                                    }))
                                }
                                else if(value===2){
                                    setState(prevState => ({
                                        ...prevState,
                                        typeofQuiz : "numeric"
                                    }))
                                }
                                else if(value===3){
                                    setState(prevState => ({
                                        ...prevState,
                                        typeofQuiz : "alphaNumerical"
                                    }))
                                }
                            }}
                            textStyle={{fontSize:12}}
                            textColor={'black'}
                            selectedColor={'black'}
                            selectedTextStyle={{fontSize:12}}
                            buttonColor={'tomato'}
                            options={[
                                { label: "MCQ", value: 0},
                                { label: "Multi-Choice", value: 1},
                                { label: "Numeric", value: 2},
                                { label: "Text", value: 3},
                            ]}
                        />
                    </View>
                    {
                    state.typeofQuiz === "mcq"
                    ?
                        <View>
                            <Options optionValue={setOption} icon={state.icon}/>
                        </View>
                    :
                    state.typeofQuiz ==="alphaNumerical"
                    ?
                        <Text/>
                    :
                    state.typeofQuiz ==="numeric"
                    ?
                        <Text/>
                    :
                    state.typeofQuiz ==="multicorrect"
                    ?
                    <View>
                        <MultiCorrectOptions optionValue={setOption}/>
                    </View>
                    :
                    <Text/>
                    }

                    <View style={styles.container}>
                        <View style={styles.slider}>

                            <Text style={styles.sliderText}> Timer: {state.time} min</Text>

                            <Slider
                                value={state.time}
                                minimumValue={1}
                                step={1}
                                maximumValue={15}
                                // thumbTouchSize={{width: 100, height: 100}}
                                // thumbTintColor='#2697BF'
                                minimumTrackTintColor="tomato"
                                // maximumTrackTintColor="#000000"
                                trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                thumbStyle={{ height: 35, width: 35, backgroundColor: 'transparent' }}
                                thumbProps={{
                                    Component: Animated.Image,
                                    source: {
                                        uri: 'https://i.ibb.co/Qn6nGyx/Clock.png',
                                    },
                                }}
                                onValueChange={(value) => 
                                    setState(prevState => ({
                                        ...prevState,
                                        time: value,
    
                                    }))
                                    }
                            />


                            <View>
                                <View style={{paddingTop:10, marginTop:10}}>
                                    <Button buttonStyle={styles.mybutton} titleStyle={{color:'white',fontWeight:'normal'}} title="Begin" onPress={() => startKBC()} />
                                </View>
                            </View>
                        </View>
                    </View>
                    </View>
                </ScrollView>
                        :
                        <ScrollView>
                            <View style = {[{paddingRight:10,paddingLeft:10}]}>
                            <QuizResultGraph passCode={state.course.passCode}
                                             course={props.course}
                                             correctAnswer={state.correctAnswer}
                                             date={state.date}
                                             quizType={props.quizType}
                                             emailStatus={state.emailStatus}
                                             quizresultData={quizresultData}
                                             QuizMailer = {QuizMailer}
                            />
                            <View style={[
                                styles.buttonContainer,
                                { width: props.quizType==="alphaNumerical"
                                        ? Dimensions.window.width-50
                                        :"100%"
                                }]}>
                            <View style={[
                                styles.buttonContainer,
                                { width: props.quizType==="numeric"
                                        ? Dimensions.window.width-50
                                        :"100%"
                                }]}>
                                <Button buttonStyle={styles.mybutton}
                                        titleStyle={{color:'white',fontWeight:'normal'}}
                                        style={styles.buttonMessage}
                                        title={"Start Another Quiz"}
                                        onPress={()=>{
                                            setState(prevState => ({
                                                ...prevState,
                                                time : 2,
                                                option : "*",
                                                icon : "",
                                                correctAnswer : "*",
                                                resultPage : false,
                                                emailStatus : false,
                                                error : null,
                                                date : "",
                                                results :"",
                                                typeofQuiz : "mcq",
                                                quizNumber : "",
                                                
            
                                            }))
                                           
                                        }}/>
                            </View>
                            </View>
                            </View>
                        </ScrollView>
                :
                <ScrollView>
                    <Text style={styles.subheading}> Quiz {props.questionNumber} in Progress</Text>
                    <CountDown
                        until={props.currentDuration}
                        size={30}
                        onFinish={() =>  {
                            setState(prevState => ({
                                ...prevState,
                               resultPage: true,
                                

                            }))
                           
                            checkEmailSent().then(r=>{QuizMailer()})
                            props.setQuizState()
                        }}
                        digitStyle={{backgroundColor: '#FFF'}}
                        digitTxtStyle={{color: 'tomato'}}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: 'Min', s: 'Sec'}}
                    />
                    <View>
                        <Button buttonStyle={styles.mybutton} titleStyle={{color:'white',fontWeight:'normal'}} title='Cancel' onPress={()=>{
                             startKBC("stop").then(r => "")}} />
                    </View>
                    {props.quizType==="alphaNumerical"
                        ?
                        <View>
                            <Text style={[styles.heading,{fontSize : 20, }]}>
                                Provide Answer for Auto-grading
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                maxLength={30}
                                textAlign={'center'}
                                onChangeText={text => {
                                    setState(prevState => ({
                                        ...prevState,
                                       option: text
                                    }))
                                   }}
                                value={state.option==="*"?"":state.option}
                            />
                            {state.error ? <Text style={styles.errorMessage}>{state.error}</Text> : <Text/>}

                            <Button style={styles.buttonMessage}
                                buttonStyle={styles.mybutton}
                                titleStyle={{color:'white',fontWeight:'normal'}}
                                title="Submit"
                                onPress={()=>{
                                    dbUpdateCorrectAnswer()
                                        .then(r => console.log("Answer Updated"))
                                }}
                            />
                        </View>
                        :
                        <Text/>
                    }
                    {props.quizType==="numeric"
                        ?
                        <View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{width: Dimensions.window.width/2, alignItems: "center"}}>    
                                    <Text style={[styles.heading,{fontSize : 20, }]}>
                                        Provide Answer for Auto-grading
                                    </Text>
                                    <TextInput
                                        style={[styles.textInput, {width:'90%'}]}
                                        maxLength={30}
                                        textAlign={'center'}
                                        onChangeText={text => {
                                            setState(prevState => ({
                                                ...prevState,
                                                option: text
                                            }))
                                           }}
                                        value={state.option==="*"?"":state.option}
                                    />
                                </View>
                                <View style={{width: Dimensions.window.width/2}}>
                                    <Text style={[styles.heading,{fontSize : 20, }]}>
                                        Provide Acceptable Absolute Error Amount
                                    </Text>
                                    <TextInput
                                        style={[styles.textInput, {width:'90%'}]}
                                        maxLength={30}
                                        textAlign={'center'}
                                        onChangeText={text => {
                                            setState(prevState => ({
                                                ...prevState,
                                               errorRate: text
            
                                            }))
                                           }}
                                        value={state.errorRate==="*"?"":state.errorRate}
                                    />
                                </View>
                            </View>
                            {state.error ? <Text style={styles.errorMessage}>{state.error}</Text> : <Text/>}

                            <Button style={styles.buttonMessage}
                                buttonStyle={styles.mybutton}
                                titleStyle={{color:'white',fontWeight:'normal'}}
                                title="Submit"
                                onPress={()=>{
                                    dbUpdateCorrectAnswer()
                                        .then(r => console.log("Answer Updated"))
                                }}
                            />
                        </View>
                        :
                        <Text/>
                    }
                </ScrollView>
                }
            </SafeAreaView>
        )}
        else{

            
            //console.log(state.loading);
            setTimeout(function(){
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                }) )
                }, 1000);
            return(
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
}


const styles = StyleSheet.create({
    mybutton:{
        backgroundColor: 'tomato', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:30,
        marginBottom:30
    },
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    sliderText : {
        flex: 1,
        display: "flex",
        padding: 10,
        fontSize : 18,
        color: 'black',
        marginTop: 5,
    },
    selector:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 2,
        marginTop: 5,
        textAlign: 'center',
    },
    textInput: {
        color:'black',
        width: '100%',
        paddingTop: 25,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1,
        fontSize:20
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1.50,
        elevation: 10,
    },
    heading : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 15,
        fontSize : 25,
        fontWeight: "bold",
        color: 'black',
        marginTop: 5,
        textAlign: 'center',
    },
    subheading : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 15,
        fontSize : 25,
        fontWeight: "bold",
        color: 'black',
        marginTop: 50,
        marginBottom :25,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 15,
        alignItems: 'center',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 5,
        paddingTop : 5,
        paddingBottom: 5,
        marginTop: 5
    },
    buttonMessage: {
        marginTop : 20,
        paddingTop : 20,
        marginBottom: 30,
        paddingBottom : 20,
        textAlign: 'center',

    },
    buttonContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "center",
        paddingTop: 20,
        paddingBottom:20,
        paddingLeft : 20,
        paddingRight : 20
    },
    or: {
        marginTop: 130,
        color: 'grey',
        alignSelf: "center",
        fontSize: 22,
        paddingBottom: 20,
        fontWeight : "bold"
    },
    slider: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'stretch',
        width : Dimensions.window.width-60
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }

})

export default QuizFacultyPage;

