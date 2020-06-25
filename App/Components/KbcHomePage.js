import React, {Component} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Slider, Text} from 'react-native-elements';
import KBC from '../Databases/KBC';
import moment from 'moment';
import Options from './Options';

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
            error : null
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

    startKBC = () => {

        const { option, time } = this.state;

        if (option==='')
        {
            this.setState({
                error : "Please select correct answer."
            })
        }
        // else if already running kbc - error - please wait for answers to correct question
        else
        {
            const kbc = new KBC()
            const startTime= moment().format("DD/MM/YYYY HH:mm:ss")
            const endTime= moment().add(time, 'minutes').format("DD/MM/YYYY HH:mm:ss")

            kbc.createQuestion(this.state.course.passCode, startTime, endTime, time, option, this.state.user.email)
                .then(r =>{
                    this.setState({
                        time : 2,
                        option : "",
                        icona : 'alpha-a',
                        iconb : 'alpha-b',
                        iconc : 'alpha-c',
                        icond : 'alpha-d',
                        error : null
                    })
                } )
        }

    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text h2 style = {styles.heading}> Quick KBC</Text>

                    <Options optionValue = {this.setOption} icona = {this.state.icona} iconb = {this.state.iconb} iconc = {this.state.iconc} icond = {this.state.icond}/>

                    <View style={styles.container}>
                        <View style={styles.slider}>

                            <Text> Timer: {this.state.time} min</Text>

                            <Slider
                                value={this.state.time}
                                minimumValue = {2}
                                step = {2}
                                maximumValue = {20}
                                // thumbTouchSize={{width: 100, height: 100}}
                                thumbTintColor ='#2697BF'
                                minimumTrackTintColor="#2697BF"
                                maximumTrackTintColor="#000000"
                                onValueChange={(value) => this.setState({ time : value })}
                            />
                        </View>

                        { this.state.error ?
                            <Text style={styles.errorMessage}>
                                {this.state.error}
                            </Text> : <Text/>}

                        <Button style={styles.buttonMessage} title="BEGIN" onPress={this.startKBC} />
                    </View>


                </ScrollView>
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

    slider: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'stretch',
}

})
