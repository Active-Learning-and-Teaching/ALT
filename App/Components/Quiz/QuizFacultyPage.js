import React, {Component} from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Slider, Text, Button} from 'react-native-elements';
import Quiz from '../../Databases/Quiz';
import moment from 'moment';
import Options from './Options';
import CountDown from 'react-native-countdown-component';
import QuizResultGraph from './QuizResultGraph';
import {Mailer} from '../../Utils/Mailer';
import Toast from 'react-native-simple-toast';
import SwitchSelector from "react-native-switch-selector";
import Dimensions from '../../Utils/Dimensions';

export default class QuizFacultyPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
            time : 2,
            option : "0",
            icon : "",
            correctAnswer : "0",
            emailPage : false,
            error : null,
            date : "",
            results :"",
            typeofQuiz : "mcq",
            loading : true
        };
        this.setOption = this.setOption.bind(this);
        this.quizresultData = this.quizresultData.bind(this);
    }

    quizresultData(resultData){
        this.setState({
            results: resultData
        })
    }
    checkEmailSent = async () =>{
        const Kbc = new Quiz()
        Kbc.getTiming(this.state.course.passCode).then(value => {
            this.setState({
                emailPage : !value["emailResponse"],
                correctAnswer : value["correctAnswer"],
                date : value["startTime"]
            })
        })
    }

    componentDidMount() {
        this.checkEmailSent().then(r=>{console.log("")})
    }

    setOption(value){
        this.setState({
            option : value,
            icon : value,
        })
    }

    dbUpdateEmailStatus = async () =>{
        const Kbc = new Quiz()
        Kbc.getTiming(this.state.course.passCode)
            .then(value => {
                Kbc.getQuestion(this.state.course.passCode)
                    .then(url => {
                        Kbc.setQuestion(
                            this.state.course.passCode,
                            value["startTime"],
                            value["endTime"],
                            value["duration"],
                            value["correctAnswer"],
                            value["instructor"],
                            value["quizType"],
                            url,
                            true
                        )
                    })
            })
    }

    mailQuizResult = () =>{
        this.setState({
            time : 2,
            option : "0",
            icon : "",
            correctAnswer : "0",
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
            const startTime = moment().format("DD/MM/YYYY HH:mm:ss")
            const endTime = moment().add(time, 'minutes').format("DD/MM/YYYY HH:mm:ss")

            await kbc.getQuestion(this.state.course.passCode)
                .then((url)=>{
                    if (url===null){
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
                        kbc.setQuestion(
                            this.state.course.passCode,
                            startTime,
                            endTime,
                            time,
                            option,
                            this.state.user.email,
                            this.state.typeofQuiz,
                            url,
                            false
                        ).then(r => {
                                console.log("update")
                            })

                    }
                    this.setState({
                        time: 2,
                        option: "",
                        icon: "",
                        error: null
                    })

                })

        }

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
                    <Text style={styles.heading}> In-Class Quiz!</Text>
                    <View style={styles.selector}>
                        <SwitchSelector
                            initial={0}
                            onPress={value => {
                                this.setState({
                                    typeofQuiz : value,
                                    option : "0",
                                    icon : "",
                                    correctAnswer : "0",
                                })
                            }}
                            textStyle={{fontFamily:"arial"}}
                            textColor={'#383030'}
                            selectedColor={'white'}
                            borderColor={'#383030'}
                            // hasPadding
                            options={[
                                { label: "MCQ", value: "mcq", activeColor: '#60CA24'},
                                { label: "Numerical", value: "numerical" ,activeColor: '#60CA24'},
                            ]}
                        />
                    </View>
                    {this.state.typeofQuiz === "mcq"
                    ?
                    <View>
                        <Options optionValue={this.setOption} icon={this.state.icon}/>
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
                                thumbTintColor='#2697BF'
                                minimumTrackTintColor="#2697BF"
                                maximumTrackTintColor="#000000"
                                onValueChange={(value) => this.setState({time: value})}
                            />


                        {this.state.error ?
                            <Text style={styles.errorMessage}>
                                {this.state.error}
                            </Text> : <Text/>}
                            <View style = {styles.shadow}>
                                <Button title="BEGIN" onPress={this.startKBC}/>
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
                                        title="Email Results"
                                        onPress={()=>{
                                            let type = ""
                                            if(this.props.quizType==='mcq'){
                                                type = "In-Class MCQ Quiz"
                                            }
                                            else if(this.props.quizType==='numerical'){
                                                type = "In-Class Quiz"
                                            }
                                            if(type!=""){
                                                Mailer(
                                                    this.state.course.courseName,
                                                    this.state.user.email,
                                                    this.state.user.name,
                                                    this.state.date,
                                                    "",
                                                    this.state.results,
                                                    type
                                                )
                                                this.mailQuizResult()
                                                Toast.show('Sending Email...');
                                            }
                                        }}/>
                                <Button style={styles.buttonMessage}
                                        title="Start Another Quiz"
                                        onPress={()=>{
                                            this.setState({
                                                time : 2,
                                                option : "0",
                                                icon : "",
                                                correctAnswer : "0",
                                                emailPage : false,
                                                error : null,
                                                date : "",
                                                results :"",
                                                typeofQuiz : "mcq",
                                            })
                                            // this.dbUpdateEmailStatus()
                                            //     .then(()=>{console.log("Updated email")})
                                        }}/>
                            </View>
                            </View>
                        </ScrollView>
                :
                <ScrollView>
                    <Text style={styles.or}> Quiz in Progress</Text>
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
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.50,
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
        marginBottom: 15,
        paddingTop : 20,
        paddingBottom: 10,
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

