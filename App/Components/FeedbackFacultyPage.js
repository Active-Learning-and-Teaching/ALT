import React, {Component} from 'react';
import FeedbackForm from './FeedbackForm';
import {SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native';
import Feedback from '../Databases/Feedback';
import CountDown from 'react-native-countdown-component';
import {Button, ListItem} from 'react-native-elements';
import Dimensions from '../Utils/Dimensions';
import moment from 'moment';

export default class FeedbackFacultyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
            emailPage : false,
            topics : [],
            duration : 1
        }
    }

    checkEmailSent = async () =>{
        const feedback = new Feedback()
        feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
            this.setState({
                emailPage : !value["emailResponse"],
                topics : value["topics"]
            })
        })
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
                            <FeedbackForm course={this.state.course} user={this.state.user}/>
                            :
                            <Text> Results </Text>
                        :
                        <ScrollView>
                            <View style={styles.container}>
                                <Text style={styles.heading}> Topics</Text>
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
                                        until={this.props.beforeDuration}
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
                            until={this.props.currentDuration}
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
})
