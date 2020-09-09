import React, {Component} from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View, TextInput, Animated} from 'react-native';
import {Slider, Text, Button,Icon} from 'react-native-elements';
import Quiz from '../../Databases/Quiz';
import moment from 'moment';
import Options from './Options';
import CountDown from 'react-native-countdown-component';
import QuizResultGraph from './QuizResultGraph';
import {Mailer} from '../../Utils/Mailer';
import Toast from 'react-native-simple-toast';
import SwitchSelector from "react-native-switch-selector";
import Dimensions from '../../Utils/Dimensions';
import database from "@react-native-firebase/database";
import QuizResponses from '../../Databases/QuizResponses';
import MultiCorrectOptions from './MultiCorrectOptions';

export default class QuizFacultyPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
            time : 2,
            option : "*",
            icon : "",
            correctAnswer : "*",
            emailPage : false,
            error : null,
            date : "",
            results :"",
            typeofQuiz : "mcq",
            loading : true,
            quizNumber : "",
        };
        this.setOption = this.setOption.bind(this);
        this.quizresultData = this.quizresultData.bind(this);
    }

    quizresultData(resultData, quizNumber){
        this.setState({
            results: resultData,
            quizNumber: quizNumber
        })
    }
    checkEmailSent = async () =>{
        const Kbc = new Quiz()
        Kbc.getTiming(this.state.course.passCode).then(value => {
            if(value!=null){
                this.setState({
                    emailPage : !value["emailResponse"],
                    correctAnswer : value["correctAnswer"],
                    date : value["startTime"]
                })
            }
        })
    }

    componentDidMount() {
        this.checkEmailSent().then(r=>{console.log("")})
    }

    async setOption(value){
        if(value==="")
            value="*"
        await this.setState({
            option : value,
            icon : value,
        })
        console.log(this.state.option)
    }

    dbUpdateEmailStatus = async () =>{
        const Kbc = new Quiz()
        Kbc.getTiming(this.state.course.passCode)
            .then(value => {
                Kbc.getQuestion(this.state.course.passCode)
                    .then(values => {
                        const url = Object.keys(values)[0];
                        Kbc.setQuestion(
                            this.state.course.passCode,
                            value["startTime"],
                            value["endTime"],
                            value["duration"],
                            value["correctAnswer"],
                            value["instructor"],
                            value["quizType"],
                            url,
                            true,
                            value["questionCount"]
                        )
                    })
            })
    }

    mailQuizResult = () =>{
        this.setState({
            time : 2,
            option : "*",
            icon : "",
            correctAnswer : "*",
            emailPage : false,
            error : null,
            date : "",
            results :"",
            typeofQuiz : "mcq",
        })


        this.dbUpdateEmailStatus()
            .then(()=>{console.log("Updated email")})

    }

    startKBC = async () => {

        const {option, time} = this.state;

        if (option === '') {
            this.setState({
                error: "Please select correct answer."
            })
        }
        else {
            const kbc = new Quiz()
            const curr = database().getServerTime()
            const startTime = moment(curr).format("DD/MM/YYYY HH:mm:ss")
            const endTime = moment(curr).add(time, 'minutes').format("DD/MM/YYYY HH:mm:ss")

            await kbc.getQuestion(this.state.course.passCode)
                .then((values)=>{
                    if (values===null){
                        kbc.createQuestion(
                            this.state.course.passCode,
                            startTime,
                            endTime,
                            time,
                            option,
                            this.state.user.email,
                            this.state.typeofQuiz
                        ).then(r => {
                                console.log("create")
                            })
                    }
                    else{
                        const url = Object.keys(values)[0];
                        const questionCount = Object.values(values)[0].questionCount
                        kbc.setQuestion(
                            this.state.course.passCode,
                            startTime,
                            endTime,
                            time,
                            option,
                            this.state.user.email,
                            this.state.typeofQuiz,
                            url,
                            false,
                            questionCount+1
                        ).then(r => {
                                console.log("update")
                            })

                    }
                    this.setState({
                        time: 2,
                        option: "*",
                        icon: "",
                        error: null
                    })

                })

        }

    }

    dbUpdateCorrectAnswer = async () => {
        const option = this.state.option

        if (option === "" || option === "*") {
            this.setState({
                error : "Please type Correct Answer"
            })
        }
        else{
            this.setState({
                error: null,
            })
            const Kbc = new Quiz()
            Kbc.getTiming(this.state.course.passCode)
                .then(value => {
                    Kbc.getQuestion(this.state.course.passCode)
                        .then(values => {
                            const url = Object.keys(values)[0];
                            Kbc.setQuestion(
                                this.state.course.passCode,
                                value["startTime"],
                                value["endTime"],
                                value["duration"],
                                this.state.option,
                                value["instructor"],
                                value["quizType"],
                                url,
                                value["emailResponse"],
                                value["questionCount"]
                            )
                            Toast.show('Correct Answer has been recorded!');
                        })
                })
        }
    }

    autoGrader(studentAnswer, correctAnswer){
        studentAnswer = studentAnswer.replace(/,/g,"")
        if(studentAnswer===correctAnswer)
            return 1;
        else
            return 0;
    }

    async studentsResponseCsv(list, answer,type){
        const correctAnswer = answer === "*" ? 'N/A' : answer.trim().toUpperCase().replace(/,/g,"");
        const date = this.state.date.replace(/\//g,"-").split(" ")[0]
        const quizNumber = this.state.quizNumber
        const fileName = this.state.course.courseCode+"_"+date+"_"+"Quiz-"+quizNumber

        await list.sort((a,b) =>
            a.Email > b.Email
            ? 1
            : b.Email > a.Email
                ? -1
                : 0
        );

        const reactFile = require('react-native-fs');
        const path = reactFile.DocumentDirectoryPath + `/${fileName}.csv`;

        const headerString = 'Student Name, EmailID, Response, Auto-grade Marks\n';

        const aboutQuiz =  `"QUIZ",${"#"+quizNumber+"@"+date},${"Correct Ans- "+correctAnswer},${answer==="*"?'N/A':1}\n\n`

        const rowString = await list.map((student,i) =>
            `${student.Name},${student.Email},${student.Answer.replace(/,/g,"")},${answer === "*" 
                ? 'N/A': this.autoGrader(student.Answer,correctAnswer)}\n`).join('');

        const csvString = `${headerString}${aboutQuiz}${rowString}`;

        return await reactFile.writeFile(path, csvString, 'utf8')
            .then(async (success) => {
                console.log("File Written")
                await Mailer(
                    this.state.course.courseName,
                    this.state.course.courseCode,
                    this.state.user.email,
                    this.state.user.name,
                    quizNumber,
                    this.state.date,
                    "",
                    this.state.results,
                    type
                )
                this.mailQuizResult()
                await Toast.show('Sending Email...');
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    render(){
        if(!this.state.loading){
        return(
            <SafeAreaView style={styles.safeContainer}>

                { this.props.currentQuiz === false
                ?
                    this.state.emailPage === false
                    ?
                <ScrollView>
                    <View style={{padding:20}}>
                    <Text style={styles.heading}> In-Class Quiz {this.props.questionCount + 1} </Text>
                    <View style={styles.selector}>
                        <SwitchSelector
                            initial={0}
                            onPress={value => {
                                this.setState({
                                    typeofQuiz : value,
                                    option : "*",
                                    icon : "",
                                    correctAnswer : "*",
                                })
                            }}
                            textStyle={{fontFamily:"arial"}}
                            textColor={'#383030'}
                            selectedColor={'white'}
                            borderColor={'#383030'}
                            // hasPadding
                            options={[
                                { label: "Single Correct", value: "mcq", activeColor: '#60CA24'},
                                { label: "AlphaNumeric", value: "numerical" ,activeColor: '#60CA24'},
                                { label: "Multi Correct", value: "multicorrect" ,activeColor: '#60CA24'},
                            ]}
                        />
                    </View>
                    {this.state.typeofQuiz === "mcq"
                    ?
                        <View>
                            <Options optionValue={this.setOption} icon={this.state.icon}/>
                        </View>
                    :
                        this.state.typeofQuiz ==="numerical"
                        ?
                        <Text/>
                        :
                            this.state.typeofQuiz ==="multicorrect"
                            ?
                            <View>
                                <MultiCorrectOptions optionValue={this.setOption}/>
                            </View>
                            :
                            <Text/>
                    }

                    <View style={styles.container}>
                        <View style={styles.slider}>

                            <Text style={styles.sliderText}> Timer: {this.state.time} min</Text>

                            <Slider
                                value={this.state.time}
                                minimumValue={1}
                                step={1}
                                maximumValue={15}
                                // thumbTouchSize={{width: 100, height: 100}}
                                // thumbTintColor='#2697BF'
                                minimumTrackTintColor="#2697BF"
                                // maximumTrackTintColor="#000000"
                                trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                thumbStyle={{ height: 35, width: 35, backgroundColor: 'transparent' }}
                                thumbProps={{
                                    Component: Animated.Image,
                                    source: {
                                        uri: 'https://i.ibb.co/Qn6nGyx/Clock.png',
                                    },
                                }}
                                onValueChange={(value) => this.setState({time: value})}
                            />


                            <View style = {styles.shadow}>
                                <Button style={{paddingTop:10}} title="BEGIN" onPress={this.startKBC}/>
                            </View>
                        </View>
                    </View>
                    </View>
                </ScrollView>
                        :
                        <ScrollView>
                            <View style = {styles.shadow}>
                            <QuizResultGraph passCode={this.state.course.passCode}
                                             correctAnswer={this.state.correctAnswer}
                                             date={this.state.date}
                                             quizType={this.props.quizType}
                                             quizresultData={this.quizresultData} />
                            <View style={[
                                styles.buttonContainer,
                                { width: this.props.quizType==="numerical"
                                        ? Dimensions.window.width-50
                                        :"100%"
                                }]}>
                                <Button style={styles.buttonMessage}
                                        title="Don't Email Results"
                                        onPress={()=>{
                                            this.setState({
                                                time : 2,
                                                option : "*",
                                                icon : "",
                                                correctAnswer : "*",
                                                emailPage : false,
                                                error : null,
                                                date : "",
                                                results :"",
                                                typeofQuiz : "mcq",
                                            })
                                            // this.dbUpdateEmailStatus()
                                            //     .then(()=>{console.log("Updated email")})
                                        }}/>
                                <Button style={styles.buttonMessage}
                                        title="Start Another Quiz"
                                        onPress={async ()=>{
                                            let type = ""
                                            if(this.props.quizType==='mcq'){
                                                type = "In-Class MCQ Quiz"
                                            }
                                            else if(this.props.quizType==='numerical' || this.props.quizType=="multicorrect"){
                                                type = "In-Class Quiz"
                                            }
                                            if(type!=""){
                                                const kbcResponse = new QuizResponses()
                                                const Kbc = new Quiz()

                                                await Kbc.getTiming(this.state.course.passCode).then(r =>{
                                                    kbcResponse.getAllStudentsforMail(this.state.course.passCode, r["startTime"], r["endTime"]).then(list=>{
                                                        this.studentsResponseCsv(list,r["correctAnswer"],type).then(()=>{
                                                            console.log("Email Sent")
                                                        })
                                                    })
                                                })
                                            }
                                        }}/>
                            </View>
                            </View>
                        </ScrollView>
                :
                <ScrollView>
                    <Text style={styles.or}> Quiz {this.props.questionCount} in Progress</Text>
                    <CountDown
                        until={this.props.currentDuration}
                        size={30}
                        onFinish={() =>  {
                            this.setState({
                                emailPage : true
                            })
                            this.checkEmailSent().then(r=>{console.log("")})
                            this.props.setQuizState()
                        }}
                        digitStyle={{backgroundColor: '#FFF'}}
                        digitTxtStyle={{fontFamily: 'arial',color: '#2697BF'}}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: 'Min', s: 'Sec'}}
                    />
                    {this.props.quizType==="numerical"
                        ?
                        <View>
                            <Text style={[styles.heading,{fontSize : 19, marginTop:25}]}>
                                Provide Answer for Auto-grading
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                maxLength={24}
                                textAlign={'center'}
                                onChangeText={text => {this.setState({
                                    option : text
                                })}}
                                value={this.state.option==="*"?"":this.state.option}
                            />
                            {this.state.error ? <Text style={styles.errorMessage}>{this.state.error}</Text> : <Text/>}

                            <Button style={styles.buttonMessage}
                                title="Submit"
                                onPress={()=>{
                                    this.dbUpdateCorrectAnswer()
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
            let that = this;
            setTimeout(function(){that.setState({loading: false})}, 1000);
            return(
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
    }

}
const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    sliderText : {
        flex: 1,
        display: "flex",
        padding: 10,
        fontSize : 18,
        color: 'grey',
        marginTop: 5,
    },
    selector:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 15,
        marginTop: 5,
        textAlign: 'center',
    },
    textInput: {
        width: '100%',
        paddingTop: 55,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
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
        color: 'grey',
        marginTop: 5,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
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
        marginTop : 30,
        paddingTop : 20,
        marginBottom: 30,
        paddingBottom : 20
    },
    buttonContainer: {
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom:20,
        paddingLeft : 20,
        paddingRight : 20
    },
    or: {
        marginTop: 200,
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

