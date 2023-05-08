import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, ScrollView, TextInput} from 'react-native';
import {Icon, Text, Button} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import database from '@react-native-firebase/database';
import moment from 'moment';
import Feedback from '../../Databases/Feedback';
import SwitchSelector from 'react-native-switch-selector';
import Dimensions from '../../Utils/Dimensions';
export default class FeedbackForm extends Component {

    // TODO change duration at deployment
    duration = 5;

    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course,
            user: this.props.user,
            textInput : [],
            inputData : [],
            date : moment(database().getServerTime()).add(360, 'minutes').format("DD/MM/YYYY"),
            time : moment(database().getServerTime()).add(360, 'minutes').format("HH:mm:ss"),
            iosdate : moment(database().getServerTime()).add(360, 'minutes').format("DD/MM/YYYY"),
            iostime : moment(database().getServerTime()).add(360, 'minutes').format("HH:mm:ss"),
            showDate : false,
            showTime : false,
            error : null,
            topics : [],
            duration : this.duration,
            kind : null,
        }
    }

    addTextInput = (index) => {
        let textInput = this.state.textInput;
        textInput.push(
                <TextInput
                    style={styles.textInput}
                    key = {index}
                    autoCapitalize="sentences"
                    onChangeText={(text) => this.addValues(text, index)}
                />
            );
        this.setState({ textInput });
    }

    updateTopics = async () => {
        let arr = []
        const t = this.state.inputData
        for await (const item of t){
            if (item['text'].length!==0) {
                let topic = item["text"];
                topic = topic.charAt(0).toUpperCase() + topic.slice(1)
                arr.push(topic);
            }
        }
        await this.setState({
            topics:arr
        })
    }

    addFeedback = async () => {

        if (this.state.kind === null){
            this.setState({
                error: "Please choose feedback type."
            })
        }
        else if (this.state.inputData.length === 0) {
            this.setState({
                error: "Please enter at least one topic."
            })
        }
        // else if(Platform.OS==='android'&& (this.state.date == null || this.state.time == null)){

        //     this.setState({
        //         error: "Please schedule feedback."
        //     })
        // }
        else {
            const feedback = new Feedback()
            let startTime = "0"

            if(Platform.OS==='android')
                startTime = this.state.date + " " + this.state.time
           else
                startTime = this.state.iosdate + " " + this.state.iostime
            
            let endTime = moment(startTime, "DD/MM/YYYY HH:mm:ss")
                .add(this.state.duration, 'minutes')
                .format("DD/MM/YYYY HH:mm:ss")

            const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
            const curr = moment(database().getServerTime())

            if(curr>temp)
            {
                this.setState({
                    error: "Please schedule correct time."
                })
            }
           else
            {
                await this.updateTopics().then(r=>{console.log()})

                await feedback.getFeedback(this.state.course.passCode)
                    .then((values) => {
                        if (values === null) {
                            feedback.createFeedback(
                                this.state.course.passCode,
                                startTime,
                                endTime,
                                this.state.topics,
                                this.state.kind,
                                this.state.user.email
                            ).then(r => {
                                console.log("create")
                                console.log(this.state.kind)
                            })
                        } else {
                            const url = Object.keys(values)[0];
                            const feedbackCount = Object.values(values)[0].feedbackCount
                            feedback.setFeedback(
                                this.state.course.passCode,
                                startTime,
                                endTime,
                                this.state.topics,
                                this.state.kind,
                                this.state.user.email,
                                url,
                                false,
                                feedbackCount+1

                            ).then(r => {
                                console.log("update")
                                console.log(this.state.kind)
                                console.log(this.state.topics)
                            })

                        }
                        this.props.setTopics(this.state.topics)
                        this.setState({
                            textInput : [],
                            inputData : [],
                            date : null,
                            showDate : false,
                            showTime : false,
                            time : null,
                            error : null,
                            topics : [],
                            kind : null
                        })

                    })
            }

        }
    }

    addValues = (text, index) => {
        let dataArray = this.state.inputData;
        let checkBool = false;
        if (dataArray.length !== 0){
            dataArray.forEach(element => {
                if (element.index === index ){
                    element.text = text;
                    checkBool = true;
                }
            });
        }
        if (checkBool){
            this.setState({
                inputData: dataArray
            });
        }
        else {
            dataArray.push({'text':text,'index':index});
            this.setState({
                inputData: dataArray
            });
        }
    }
    
    onChangeDate = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format("DD/MM/YYYY")
        this.setState({
            date : currentDate,
            showDate : false,
            showTime : false
        })
    }
    onChangeTime = (event, selectedTime) => {
        const currentTime = moment(selectedTime).format("HH:mm:ss")
        this.setState({
            time : currentTime,
            showDate : false,
            showTime : false
        })
    }
    iOSonChangeDate = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format("DD/MM/YYYY")
        this.setState({
            iosdate : currentDate,
        })
    }
    iOSonChangeTime = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format("HH:mm:ss")
        this.setState({
            iostime : currentDate,
        })
    }
    doneButton = () =>{
        this.setState({
            showDate : false,
            showTime : false,
        })
    }
    showDatePicker = ()=>{
        this.setState({
            showDate : true,
            showTime : false
        })
    }
    showTimePicker = ()=>{
        this.setState({
            showDate : false,
            showTime : true
        })
    }

    render(){

        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text style={styles.heading}> Feedback {this.props.feedbackCount + 1}</Text>

                    <View style={styles.rowContainer}>
                        <Text style={styles.topic}> Topics </Text>
                        <Icon
                            name='plus-circle'
                            type='font-awesome'
                            style={{borderRadius:1}}
                            onPress={() => this.addTextInput(this.state.textInput.length)}
                        />

                    </View>

                    {this.state.textInput.map((value) => {
                        return value
                    })}
                    <View style={styles.selector}>
                    <SwitchSelector
                    onPress={value => {this.setState({kind : value })}}
                    textColor={'black'}
                    selectedColor={'black'}
                    borderColor={'#383030'}
                    options={[
                        { label: "Color Scale", value: "0", activeColor: 'tomato'},
                        { label: "Likert Scale", value: "1" ,activeColor: 'tomato'},
                    ]}
                    />
                    </View>

                    <View style={styles.buttonRowContainer}>
                        <View style={styles.container}>
                            { Platform.OS==='ios'?
                                <View>
                                    <Button titleStyle={{color:'white',fontWeight:'normal'}} buttonStyle={styles.mydatebutton} onPress={this.showDatePicker} title="Select Date" />
                                    <Text style={styles.dateTime}> {this.state.iosdate!=null ? this.state.iosdate:""}</Text>
                                </View>
                            :
                                <View>
                                    <Button titleStyle={{color:'white',fontWeight:'normal'}} buttonStyle={styles.mydatebutton} onPress={this.showDatePicker} title="Select Date" />
                                    <Text style={styles.dateTime}> {this.state.date!=null ? this.state.date:""}</Text>
                                </View>
                            }

                        </View>
                        <View style={styles.container}>
                            {  Platform.OS === 'ios' ?
                                <View>
                                    <Button titleStyle={{color:'white',fontWeight:'normal'}} buttonStyle={styles.mydatebutton}  onPress={this.showTimePicker} title="Select Time" />
                                    <Text style={styles.dateTime}> {this.state.iostime!=null ? this.state.iostime:""}</Text>
                                </View>
                                :
                                <View>
                                    <Button titleStyle={{color:'white',fontWeight:'normal'}} buttonStyle={styles.mydatebutton} onPress={this.showTimePicker} title="Select Time" />
                                    <Text style={styles.dateTime}> {this.state.time!=null ? this.state.time:""}</Text>
                                </View>
                            }

                        </View>
                    </View>

                    <View>
                        { this.state.showDate
                            ?
                            <View>

                                { Platform.OS==='ios'?
                                    <View>
                                        <View>
                                            <Button  buttonStyle={styles.mydatebutton} titleStyle={{color:'white',fontWeight:'normal'}} onPress={this.doneButton} title="Ok"/>
                                        </View>
                                        <DateTimePicker
                                            testID="datePicker"
                                            value={moment(this.state.iosdate,"DD/MM/YYYY").toDate()}
                                            mode={'date'}
                                            is24Hour={true}
                                            display="default"
                                            minimumDate = {moment(database().getServerTime()).toDate()}
                                            maximumDate = {
                                                moment(database().getServerTime()).add(30,'days')
                                                    .toDate()
                                            }
                                            onChange={this.iOSonChangeDate}
                                        />
                                    </View>
                                    :
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={moment(database().getServerTime()).toDate()}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        minimumDate = {moment(database().getServerTime()).toDate()}
                                        maximumDate = {
                                            moment(database().getServerTime()).add(30,'days')
                                                .toDate()
                                        }
                                        onChange={this.onChangeDate}
                                    />
                                }
                            </View>
                            : this.state.showTime
                            ?
                            <View>
                                { Platform.OS==='ios'?
                                    <View>
                                        <View>
                                            <Button buttonStyle={styles.mydatebutton} titleStyle={{color:'white',fontWeight:'normal'}} onPress={this.doneButton} title="Ok"/>
                                        </View>
                                        <DateTimePicker
                                            testID="timePicker"
                                            value={moment(this.state.iostime,"HH:mm:ss").toDate()}
                                            mode={'time'}
                                            is24Hour={true}
                                            display="default"
                                            onChange={this.iOSonChangeTime}
                                        />
                                    </View>
                                    :
                                    <DateTimePicker
                                        testID="timePicker"
                                        value={moment(database().getServerTime()).toDate()}
                                        mode={'time'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChangeTime}
                                    />
                                }

                            </View>

                            :<Text/>
                        }
                    </View>

                    <View style={styles.buttonContainer}>

                    {this.state.error ?
                        <Text style={styles.errorMessage}>
                            {this.state.error}
                        </Text> : <Text/>}
                        <View >
                            <Button buttonStyle={styles.mybutton} titleStyle={{color:'white',fontWeight:'normal'}} style={styles.buttonMessage} title='Submit' onPress={this.addFeedback} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 20,
        paddingBottom: 10,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1.50,
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
          color: 'black',
          marginTop: 5,
          textAlign: 'center',
      },
    dateTime : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 10,
        fontSize : 16,
        color: '#333',
        marginTop: 5,
        textAlign: 'center',
    },
    topic : {
        padding: 10,
        fontSize : 18,
        fontWeight: "bold",
        color: '#333',
        paddingLeft :20
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 15,
    },
    rowContainer: {

        paddingVertical: 25,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    buttonRowContainer: {
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 30,
        paddingBottom:10,
        paddingLeft : 30,
        paddingRight : 30
    },
    textInput: {
        color:'black',
        width: '80%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    buttonContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft : 50,
        paddingRight : 50
    },
    mybutton:{
        backgroundColor: 'tomato', 
        borderColor : 'black',
        borderRadius:20,
        marginTop:30,
        marginBottom:30
    },
    mydatebutton:{
        backgroundColor: '#333', 
        borderColor : 'black',
        borderRadius:20,
        width:Dimensions.window.width/3,
        alignSelf:'center'
    },
    selector:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 5,
        marginTop: 5,
        textAlign: 'center',
    },
})
