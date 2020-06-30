import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Slider, Text, Button} from 'react-native-elements';
import KBC from '../Databases/KBC';
import moment from 'moment';
import Options from './Options';
import CountDown from 'react-native-countdown-component';

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
                { this.props.currentQuiz === false
                ?
                <ScrollView>
                    <Text h2 style={styles.heading}> In-Class Quiz!</Text>

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
                    <CountDown
                        until={this.props.currentDuration}
                        size={30}
                        onFinish={() => alert('Quiz Over!')}
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
    slider: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'stretch',
    }

})

