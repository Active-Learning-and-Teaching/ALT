import React, {Component} from 'react';
import FeedbackForm from './FeedbackForm';
import database from '@react-native-firebase/database';
import {SafeAreaView, ScrollView, StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import Feedback from '../../Databases/Feedback';
import CountDown from 'react-native-countdown-component';
import {Button, ListItem} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import moment from 'moment';
import FeedbackResultsList from './FeedbackResultsList';
import Toast from 'react-native-simple-toast';
import {Mailer} from '../../Utils/Mailer';

export default class FeedbackFacultyPage extends Component {

    // TODO change duration at deployment
    duration=5;

    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
            resultPage : false,
            emailStatus : false,
            topics : [],
            duration : this.duration,
            date :"",
            results : "",
            loading : true,
            feedbackNumber :"",
            kind : null,
        }
        this.setTopics = this.setTopics.bind(this);
        this.setKind = this.setKind.bind(this);
        this.feedbackresultData = this.feedbackresultData.bind(this);
        this.studentsResponseMailer = this.studentsResponseMailer.bind(this);
    }

    feedbackresultData(resultData,feedbackNumber){
        this.setState({
            results: resultData,
            feedbackNumber: feedbackNumber
        })
    }

    setTopics(topics){
        this.setState({
            topics : topics
        })
    }

    setKind(kind){
        this.setState({
            kind : kind
        })
    }

    checkEmailSent = async () =>{
        const feedback = new Feedback()
        feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
            if(value!=null){
                this.setState({
                    emailStatus : !value["emailResponse"],
                    resultPage : false,
                    topics : value["topics"],
                    kind : value["kind"],
                    date: value["startTime"]
                })
            }

        })
        if (!(this.state.topics.length===0)){
            this.setState ({
                resultPage : true
            })
        }
    }

    dbUpdateEmailStatus = async () =>{
        const feedback = new Feedback()
        feedback.getFeedbackDetails(this.state.course.passCode)
            .then(value => {
                feedback.getFeedback(this.state.course.passCode)
                    .then(values => {
                        const url = Object.keys(values)[0];
                        feedback.setFeedback(
                            this.state.course.passCode,
                            value["startTime"],
                            value["endTime"],
                            value["topics"],
                            value["kind"],
                            value["instructor"],
                            url,
                            true,
                            value["feedbackCount"]
                        )
                    })
            })
    }

    startFeedback = async(action)=>{
        const feedback = new Feedback()
        let curr = database().getServerTime()
        let startTime = moment(curr).format("DD/MM/YYYY HH:mm:ss")
        let endTime = moment(curr).add(this.state.duration, 'minutes').format("DD/MM/YYYY HH:mm:ss")

        if(action==="stop")
        {
            startTime = ''
            endTime = ''
            this.setState({
                resultPage : false,
                emailStatus : false,
                topics : [],
                duration : this.duration,
                date :"",
                results : ""
            })

            this.props.beforeFeedback = false
            this.props.currentFeedback = false


            feedback.getFeedbackDetails(this.state.course.passCode)
            .then(value => {
                feedback.getFeedback(this.state.course.passCode)
                    .then(values => {
                        const url = Object.keys(values)[0];
                        feedback.setFeedback(
                            this.state.course.passCode,
                            '',
                            '',
                            '',
                            '',
                            '',
                            url,
                            false,
                            value["feedbackCount"]-1
                        )
                    })
            })
        }

        else if(action==="delay")
        {
            startTime = moment(this.props.startTime, "DD/MM/YYYY HH:mm:ss")
                .add(10, 'minutes')
                .format("DD/MM/YYYY HH:mm:ss")
            endTime = moment(this.props.startTime, "DD/MM/YYYY HH:mm:ss")
                .add(10+this.state.duration, 'minutes')
                .format("DD/MM/YYYY HH:mm:ss")
        }

        else
        {
        feedback.getFeedbackDetails(this.state.course.passCode)
            .then(value => {
                feedback.getFeedback(this.state.course.passCode)
                    .then(values => {
                        const url = Object.keys(values)[0];
                        feedback.setFeedback(
                            this.state.course.passCode,
                            startTime,
                            endTime,
                            value["topics"],
                            value["kind"],
                            value["instructor"],
                            url,
                            false,
                            value["feedbackCount"]
                        )
                    })
            })}

    }

    async studentsResponseMailer(){
            await Mailer(
                this.state.course.courseName,
                this.state.course.courseCode,
                this.state.course.feedbackEmail,
                this.state.user.name,
                this.state.feedbackNumber,
                this.state.date,
                this.state.topics,
                this.state.results,
                "Feedback"+this.state.kind)

            Toast.show('Sending Email...');
            await this.dbUpdateEmailStatus().then(()=>{
                    this.setState({
                        emailStatus : false,
                    })
            })
    }

    componentDidMount() {
        this.checkEmailSent().then(r=>{console.log("")})
        console.log(this.state.resultPage)
    }


    render() {
        if(!this.state.loading){
        return (
            <SafeAreaView style={styles.safeContainer}>

                {this.props.currentFeedback === false
                    ? this.props.beforeFeedback === false
                        ? this.state.resultPage === false
                            ?
                            <FeedbackForm
                                feedbackCount = {this.props.feedbackCount}
                                course={this.state.course}
                                user={this.state.user}
                                setTopics={this.setTopics}
                                setKind={this.setKind}
                            />
                            :
                            <ScrollView>
                                <View style={styles.result}>
                                    <FeedbackResultsList
                                        course = {this.state.course}
                                        topics = {this.state.topics}
                                        date={this.state.date}
                                        emailStatus={this.state.emailStatus}
                                        feedbackresultData={this.feedbackresultData}
                                        studentsResponseMailer={this.studentsResponseMailer}/>
                                </View>
                                <View style={[styles.buttonRowContainer,styles.shadow]}>
                                    <Button style={styles.feedbackButtonMessage}
                                            title={"Start New Feedback"}
                                            onPress={()=>{
                                                this.setState({
                                                    resultPage : false,
                                                    emailStatus : false,
                                                    topics : [],
                                                    duration : this.duration,
                                                    date :"",
                                                    results : ""
                                                })
                                            }}/>
                                </View>
                            </ScrollView>
                        :
                        <ScrollView>
                            <View style={styles.container}>
                                <Text style={styles.heading}>
                                    Feedback {this.props.feedbackCount}
                                </Text>
                                <View style={[styles.shadow]}>
                                {this.state.topics.map((value, i) => (
                                    <ListItem
                                        key = {i}
                                        containerStyle={styles.listContainer}
                                    >
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.title}>
                                                {(i+1)+". " +value}
                                            </ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                ))}
                                </View>
                                <View style={styles.container}>
                                    <Text style={styles.text1}>
                                        Scheduled to go live in
                                    </Text>
                                    <CountDown
                                        until={this.props.beforeDuration + 5}
                                        size={24}
                                        onFinish={() =>  {
                                            this.checkEmailSent().then(r=>{console.log("")})
                                            this.props.setFeedbackState()
                                        }}
                                        digitStyle={{backgroundColor: '#FFF'}}
                                        digitTxtStyle={{fontFamily: 'arial',color: '#2697BF'}}
                                        timeToShow={['D','H','M', 'S']}
                                        timeLabels={{d:'Day',h:'Hour',m: 'Min', s: 'Sec'}}
                                    />
                                </View>
                                <Text style={styles.text}> Or </Text>
                                <View style={[styles.buttonContainer,styles.shadow]}>
                                    <Button style={styles.buttonMessage} title=' START NOW? ' onPress={()=>{
                                        this.startFeedback("start").then(r => "")}} />
                                </View>
                                <Text style={styles.text}> Or </Text>
                                <View style={[styles.buttonContainer,styles.shadow]}>
                                    <Button style={styles.buttonMessage} title='Extend by 10 mins' onPress={()=>{
                                        this.startFeedback("delay").then(r => "")}} />
                                </View>
                            </View>
                        </ScrollView>
                    :
                    <ScrollView>
                        <Text style={styles.or}>
                            Feedback {this.props.feedbackCount} in Progress
                        </Text>
                        <CountDown
                            until={this.props.currentDuration + 5}
                            size={30}
                            onFinish={() =>  {
                                this.setState({
                                    resultPage : true
                                })
                                this.checkEmailSent().then(r=>{console.log("")})
                                this.props.setFeedbackState()
                            }}
                            digitStyle={{backgroundColor: '#FFF'}}
                            digitTxtStyle={{fontFamily: 'arial',color: '#2697BF'}}
                            timeToShow={['M', 'S']}
                            timeLabels={{m: 'Min', s: 'Sec'}}
                        />
                        <View style={[styles.buttonContainer,styles.shadow]}>
                            <Button style={styles.buttonMessage} title='Cancel' onPress={()=>{
                                this.startFeedback("stop").then(r => "")}} />
                        </View>
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
    or: {
        marginTop: 200,
        color: 'grey',
        alignSelf: "center",
        fontSize: 22,
        paddingBottom: 20,
        fontWeight : "bold"
    },
    listContainer: {
        width : Dimensions.window.width-10,
        height : Dimensions.window.height/(11),
        marginTop: 2,
        marginBottom: 2,
        paddingTop : 2,
        paddingBottom : 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.10,
        shadowRadius: 5.00,
        elevation: 4,
        borderRadius: 8,
    },
    heading : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        paddingBottom : 25,
        padding: 15,
        fontSize : 22,
        fontWeight: "bold",
        color: 'grey',
        marginTop: 5,
        textAlign: 'center',
    },
    result: {
        padding: 10,
        paddingLeft :30,
        paddingRight:20
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
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding : 10
    },
    topic : {
        flex: 1,
        display: "flex",
        padding: 10,
        fontSize : 18,
        color: 'grey',
        marginTop: 5,
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        fontSize: 16,
        color:'black',
        marginTop: 1,
        paddingTop : 1,
        marginBottom: 2,
        paddingBottom : 2,
    },
    text : {
        flex: 1,
        display: "flex",
        paddingBottom: 10,
        fontSize : 16,
        color: 'grey',
        marginTop: 25,
        alignSelf: "center",
    },
    text1 : {
        flex: 1,
        display: "flex",
        padding: 8,
        fontSize : 18,
        fontWeight : 'bold',
        color: 'grey',
        marginTop: 5,
        alignSelf: "center",
    },
    buttonMessage: {
        marginTop: 15,
        paddingTop : 15
    },
    displayRow :{
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom:20,
        paddingLeft : 10,
        paddingRight : 10
    },
    buttonContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 5,
        paddingLeft : 30,
        paddingRight : 30
    },
    feedbackButtonMessage: {
        marginTop : 30,
        paddingTop : 20,
        marginBottom: 30,
        paddingBottom : 20
    },
    buttonRowContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom:20,
        paddingLeft : 40,
        paddingRight : 40
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
