import React, {Component} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Slider, Text} from 'react-native-elements';
import KBC from '../Databases/KBC';
import moment from 'moment';
import Options from './Options';
import database from '@react-native-firebase/database';
import * as config from '../config';
import Courses from '../Databases/Courses';
import KBCResponses from '../Databases/KBCResponses';

export default class KbcHomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            time : 2,
            option : "",
            icona : 'alpha-a',
            iconb : 'alpha-b',
            iconc : 'alpha-c',
            icond : 'alpha-d',
            error : null,
            currentQuiz : false
        };
        this.setOption = this.setOption.bind(this);
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
                    console.log(starttime)
                    console.log(curr)
                    if (curr >= starttime && curr <= endtime){
                        console.log(true)
                        this.setState({
                            currentQuiz : true
                        })
                    }
                    else{
                        console.log(false)
                        this.setState({
                            currentQuiz : false
                        })
                    }
                }
            })
    }

    componentDidMount(){
        this.ifCurrentQuiz()
    }

    submitResponse = async () => {

        const {option} = this.state;

        if (option === '') {
            this.setState({
                error: "Please select an answer."
            })
        } else {

            const kbcresponse = new KBCResponses()
            const timestamp = moment().format("DD/MM/YYYY HH:mm:ss")

            await kbcresponse.getResponse(this.state.user.url)
                .then((url) => {
                    if (url === null) {
                        kbcresponse.createResponse(this.state.course.passCode,this.state.user.url, this.state.user.email, option, timestamp)
                            .then(r => {
                                console.log("update")
                            })
                    } else {
                        kbcresponse.setResponse(this.state.course.passCode,this.state.user.url, this.state.user.email, option, timestamp, url)
                            .then(r => {
                                console.log("create")
                            })

                    }
                    this.setState({
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
                                console.log("update")
                            })
                    }
                    else{
                         kbc.setQuestion(this.state.course.passCode, startTime, endTime, time, option, this.state.user.email, url)
                            .then(r => {
                                console.log("create")
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
                {this.state.type === "faculty" ?
                    this.state.currentQuiz === false ?
                    <ScrollView>
                        <Text h2 style={styles.heading}> Quick KBC</Text>

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
                            <Text style={styles.or}> Quiz in Progress</Text>
                        </ScrollView>

                :
                    this.state.currentQuiz===false ?
                    <ScrollView>
                        <Text style={styles.or}> Wohoo! No current quiz!</Text>
                    </ScrollView>
                    :
                    <ScrollView>
                        <Text h2 style={styles.heading}> Quick KBC</Text>

                        <Options optionValue={this.setOption} icona={this.state.icona} iconb={this.state.iconb}
                                 iconc={this.state.iconc} icond={this.state.icond}/>

                        <View style={styles.container}>

                            {this.state.error ?
                                <Text style={styles.errorMessage}>
                                    {this.state.error}
                                </Text> : <Text/>}

                            <Button style={styles.buttonMessage} title="SUBMIT" onPress={this.submitResponse}/>
                        </View>
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
        padding: 35,
        fontSize : 25,
        color: '#2697BF',
        marginTop: 5,
        textAlign: 'center'
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
        paddingTop : 20,
        marginTop: 40
    },
    or: {
        marginTop: 200,
        color: 'grey',
        alignSelf: "center",
        fontSize: 18
    },
    slider: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'stretch',
    }

})
