import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Slider, Text, Button} from 'react-native-elements';
import moment from 'moment';
import Options from './Options';
import KBCResponses from '../Databases/KBCResponses';
import CountDown from 'react-native-countdown-component';



export default class KbcStudentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course : this.props.course,
            user : this.props.user,
            option : "",
            icona : 'alpha-a',
            iconb : 'alpha-b',
            iconc : 'alpha-c',
            icond : 'alpha-d',
            error : null,
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

    render() {
        return(
            <SafeAreaView style={styles.safeContainer}>
            {   this.props.currentQuiz === false
                    ?
                    <ScrollView>
                        <Text style={styles.or}> Wohoo! No current quiz!</Text>
                    </ScrollView>
                    :
                    <ScrollView>

                        <Text h2 style={styles.heading}> In-Class Quiz</Text>

                        <CountDown
                            until={this.props.currentDuration}
                            size={30}
                            onFinish={() => alert('Quiz Over!')}
                            digitStyle={{backgroundColor: '#FFF'}}
                            digitTxtStyle={{color: '#2697BF'}}
                            timeToShow={['M', 'S']}
                            timeLabels={{m: 'Min', s: 'Sec'}}
                        />

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
        fontSize : 16,
        color: 'black',
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
        fontSize: 22,
        paddingBottom: 20,
        fontWeight : "bold"
    },
})


