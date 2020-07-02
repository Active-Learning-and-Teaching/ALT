import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Slider, Text, Button} from 'react-native-elements';
import KBC from '../Databases/KBC';
import moment from 'moment';
import Options from './Options';
import CountDown from 'react-native-countdown-component';
import QuizResultGraph from './QuizResultGraph';

export default class KbcFacultyPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
            time : 2,
            option : "",
            icona : 'alpha-a',
            iconb : 'alpha-b',
            iconc : 'alpha-c',
            icond : 'alpha-d',
            correctAnswer : "",
            emailPage : false,
            error : null,
        };
        this.setOption = this.setOption.bind(this);
    }

    checkEmailSent = async () =>{
        const Kbc = new KBC()
        Kbc.getTiming(this.state.course.passCode).then(value => {
            this.setState({
                emailPage : !value["emailResponse"],
                correctAnswer : value["correctAnswer"]
            })
        })
    }

    componentDidMount() {
        this.checkEmailSent().then(r=>{console.log("")})
    }

    setOption(value,a,b,c,d){
        this.setState({
            option : value,
            icona : a,
            iconb : b,
            iconc : c,
            icond : d,
        })
    }

    dbUpdateEmailStatus = async () =>{
        const Kbc = new KBC()
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
                            url,
                            true
                        )
                    })
            })
    }

    mailQuizResult = () =>{
        this.setState({
            emailPage : false
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
            const kbc = new KBC()
            const startTime = moment().format("DD/MM/YYYY HH:mm:ss")
            const endTime = moment().add(time, 'minutes').format("DD/MM/YYYY HH:mm:ss")

            await kbc.getQuestion(this.state.course.passCode)
                .then((url)=>{
                    if (url===null){
                        kbc.createQuestion(this.state.course.passCode, startTime, endTime, time, option, this.state.user.email)
                            .then(r => {
                                console.log("create")
                            })
                    }
                    else{
                        kbc.setQuestion(this.state.course.passCode, startTime, endTime, time, option, this.state.user.email, url, false)
                            .then(r => {
                                console.log("update")
                            })

                    }
                    this.setState({
                        time: 2,
                        option: "",
                        icona: 'alpha-a',
                        iconb: 'alpha-b',
                        iconc: 'alpha-c',
                        icond: 'alpha-d',
                        error: null
                    })

                })

        }

    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>

                { this.props.currentQuiz === false
                ?
                    this.state.emailPage === false
                    ?
                <ScrollView>
                    <Text style={styles.heading}> In-Class Quiz!</Text>

                    <Options optionValue={this.setOption} icona={this.state.icona} iconb={this.state.iconb}
                             iconc={this.state.iconc} icond={this.state.icond}/>

                    <View style={styles.container}>
                        <View style={styles.slider}>

                            <Text> Timer: {this.state.time} min</Text>

                            <Slider
                                value={this.state.time}
                                minimumValue={2}
                                step={2}
                                maximumValue={20}
                                // thumbTouchSize={{width: 100, height: 100}}
                                thumbTintColor='#2697BF'
                                minimumTrackTintColor="#2697BF"
                                maximumTrackTintColor="#000000"
                                onValueChange={(value) => this.setState({time: value})}
                            />
                        </View>

                        {this.state.error ?
                            <Text style={styles.errorMessage}>
                                {this.state.error}
                            </Text> : <Text/>}

                        <Button style={styles.buttonMessage} title="BEGIN" onPress={this.startKBC}/>
                    </View>
                </ScrollView>
                        :
                        <ScrollView>
                            <QuizResultGraph passCode={this.state.course.passCode} correctAnswer={this.state.correctAnswer}/>
                            <View style={styles.buttonContainer}>
                                <Button style={styles.buttonMessage}
                                        title="Email Results"
                                        onPress={()=>{
                                            this.mailQuizResult()
                                        }}/>
                                <Button style={styles.buttonMessage}
                                        title="Start Another Quiz"
                                        onPress={()=>{
                                            this.setState({
                                                emailPage : false
                                            })
                                        }}/>
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
                        digitTxtStyle={{color: '#2697BF'}}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: 'Min', s: 'Sec'}}
                    />
                </ScrollView>
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
        paddingLeft : 30,
        paddingRight : 30
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
    }

})

