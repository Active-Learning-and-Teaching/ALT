import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Feedback from '../Databases/Feedback';
import {Text} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';

export default class FeedbackStudentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course,
            user: this.props.user,
            topics : [],
            responded : false,
            gender : ''
        }
    }

    getTopics = async () =>{
        const feedback = new Feedback()
        feedback.getFeedbackDetails(this.state.course.passCode).then(value => {
            this.setState({
                topics : value["topics"]
            })
        })
    }

    componentDidMount() {
        this.getTopics().then(r=>{console.log(this.state.topics)})
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                {this.props.currentFeedback===false
                    ?
                    <ScrollView>
                        <Text style={styles.or}> No current minute paper!</Text>
                    </ScrollView>
                    : this.state.responded === true
                    ?
                        <ScrollView>
                            <Text style={styles.or}> No current minute paper!</Text>
                        </ScrollView>
                        :

                        <ScrollView>
                            <View style={styles.container}>
                                <Text style={styles.heading}> Minute Paper</Text>

                                <CountDown
                                    until={this.props.currentDuration}
                                    size={26}
                                    onFinish={() => {
                                        this.setState({

                                        })
                                    }}
                                    digitStyle={{backgroundColor: '#FFF'}}
                                    digitTxtStyle={{color: '#2697BF'}}
                                    timeToShow={['M', 'S']}
                                    timeLabels={{m: 'Min', s: 'Sec'}}
                                />
                                <Text>{this.state.gender}</Text>
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
        paddingTop : 25,
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
    or: {
        marginTop: 200,
        color: 'grey',
        alignSelf: "center",
        fontSize: 22,
        paddingBottom: 20,
        fontWeight : "bold"
    },
})
