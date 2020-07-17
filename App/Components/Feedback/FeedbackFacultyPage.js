import React, {Component} from 'react';
import FeedbackForm from './FeedbackForm';
import {SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native';
import Feedback from '../../Databases/Feedback';
import CountDown from 'react-native-countdown-component';
import {Button, ListItem} from 'react-native-elements';
import Dimensions from '../../Utils/Dimensions';
import moment from 'moment';
import FeedbackResultsList from './FeedbackResultsList';
import Toast from 'react-native-simple-toast';
import {Mailer} from '../../Utils/Mailer';

export default class FeedbackFacultyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
            emailPage : false,
            topics : [],
            duration : 1,
            date :"",
            results : ""
        }
        this.setTopics = this.setTopics.bind(this);
        this.feedbackresultData = this.feedbackresultData.bind(this);
    }

    feedbackresultData(resultData){
        this.setState({
            results: resultData
        })
    }

    setTopics(topics){
        this.setState({
            topics : topics
        })
    }

    checkEmailSent = async () =>{
        const feedback = new Feedback()
        feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
            this.setState({
                emailPage : !value["emailResponse"],
                topics : value["topics"],
                date: value["startTime"]
            })
        })
    }

    dbUpdateEmailStatus = async () =>{
        const feedback = new Feedback()
        feedback.getFeedbackDetails(this.state.course.passCode)
            .then(value => {
                feedback.getFeedback(this.state.course.passCode)
                    .then(url => {
                        feedback.setFeedback(
                            this.state.course.passCode,
                            value["startTime"],
                            value["endTime"],
                            value["topics"],
                            value["instructor"],
                            url,
                            true
                        )
                    })
            })
    }

    mailFeedbackResponses = () =>{
        this.setState({
            emailPage : false,
            topics : [],
            duration : 1,
            date :"",
            results : ""
        })

        this.dbUpdateEmailStatus()
            .then(()=>{console.log("Updated email")})
    }

    startFeedback = async()=>{
        const feedback = new Feedback()
        const startTime = moment().format("DD/MM/YYYY HH:mm:ss")
        const endTime = moment().add(this.state.duration, 'minutes').format("DD/MM/YYYY HH:mm:ss")

        feedback.getFeedbackDetails(this.state.course.passCode)
            .then(value => {
                feedback.getFeedback(this.state.course.passCode)
                    .then(url => {
                        feedback.setFeedback(
                            this.state.course.passCode,
                            startTime,
                            endTime,
                            value["topics"],
                            value["instructor"],
                            url,
                            false
                        )
                    })
            })
    }

    componentDidMount() {
        this.checkEmailSent().then(r=>{console.log("")})
    }


    render() {
        return (
            <SafeAreaView style={styles.safeContainer}>

                {this.props.currentFeedback === false
                    ? this.props.beforeFeedback === false
                        ? this.state.emailPage === false
                            ?
                            <FeedbackForm course={this.state.course} user={this.state.user} setTopics={this.setTopics}/>
                            :
                            <ScrollView>
                                <FeedbackResultsList
                                    course = {this.state.course}
                                    topics = {this.state.topics}
                                    date={this.state.date}
                                    feedbackresultData={this.feedbackresultData}/>

                                <View style={styles.buttonRowContainer}>
                                    <Button style={styles.buttonMessage}
                                            title={'Email \n Responses'}
                                            onPress={()=>{
                                                Mailer(this.state.course.courseName,this.state.user.email,this.state.user.name,this.state.date,this.state.topics,this.state.results,"Minute paper")
                                                this.mailFeedbackResponses()
                                                Toast.show('Sending Email...');
                                            }}/>
                                    <Button style={styles.buttonMessage}
                                            title={'Start New \n Minute Paper'}
                                            onPress={()=>{
                                                this.setState({
                                                    emailPage : false,
                                                    topics : [],
                                                    duration : 1,
                                                    date :"",
                                                    results : ""
                                                })
                                                // this.dbUpdateEmailStatus()
                                                //     .then(()=>{console.log("Updated email")})
                                            }}/>
                                </View>
                            </ScrollView>
                        :
                        <ScrollView>
                            <View style={styles.container}>
                                <Text style={styles.heading}> Upcoming minute paper</Text>
                                {this.state.topics.map((value, i) => (
                                    <ListItem
                                        key = {i}
                                        title={(i+1)+". " +value}
                                        titleStyle={styles.title}
                                        containerStyle={styles.listContainer}
                                        bottomDivider
                                    />
                                ))}
                                <View style={styles.container}>
                                    <Text style={styles.text1}> Minute paper to go live in</Text>
                                    <CountDown
                                        until={this.props.beforeDuration + 5}
                                        size={24}
                                        onFinish={() =>  {
                                            this.checkEmailSent().then(r=>{console.log("")})
                                            this.props.setFeedbackState()
                                        }}
                                        digitStyle={{backgroundColor: '#FFF'}}
                                        digitTxtStyle={{color: '#2697BF'}}
                                        timeToShow={['D','H','M', 'S']}
                                        timeLabels={{d:'Day',h:'Hour',m: 'Min', s: 'Sec'}}
                                    />
                                </View>
                                <Text style={styles.text}> Or </Text>
                                <View style={styles.buttonContainer}>
                                    <Button style={styles.buttonMessage} title='START NOW!' onPress={this.startFeedback} />
                                </View>
                            </View>
                        </ScrollView>
                    :
                    <ScrollView>
                        <Text style={styles.or}> Minute Paper in Progress</Text>
                        <CountDown
                            until={this.props.currentDuration + 5}
                            size={30}
                            onFinish={() =>  {
                                this.setState({
                                    emailPage : true
                                })
                                this.checkEmailSent().then(r=>{console.log("")})
                                this.props.setFeedbackState()
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
        height : Dimensions.window.height/(10),
        marginTop: 2,
        marginBottom: 2,
        paddingTop : 2,
        paddingBottom : 2,
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
        marginTop: 5,
        alignSelf: "center",
    },
    text1 : {
        flex: 1,
        display: "flex",
        padding: 8,
        fontSize : 16,
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
        paddingTop : 15,
        paddingLeft : 30,
        paddingRight : 30
    },
    buttonRowContainer: {
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom:20,
        paddingLeft : 40,
        paddingRight : 40
    },
})
