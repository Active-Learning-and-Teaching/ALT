import React, {Component} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet, View, TextInput, Switch} from 'react-native';
import {Button} from 'react-native-elements';
import Toast from 'react-native-simple-toast';


export default class FacultySettings extends Component{

    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            quizEmail : 'quizEmail@gmail.com',
            feedbackEmail : 'feedbackEmail@gmail.com',
            defaultEmailOption : true,
            error: null,
        };
    }

    getData = async ()=>{

    }

    setData = async ()=>{
        const { quizEmail, feedbackEmail, defaultEmailOption } = this.state;
        if(quizEmail==='' || feedbackEmail==='') {
                this.setState({
                    error : "Enter details."
                })
        }
        else {
            this.setState({
                error: null
            })
            console.log(quizEmail)
            console.log(feedbackEmail)
            Toast.show(`Updated ${this.state.course.courseName} Settings`)
        }

    }

    toggleSwitch = () => {
        this.setState({
            defaultEmailOption : !this.state.defaultEmailOption
        })
    };

    componentDidMount() {
        this.getData().then(r=>{
            console.log("got data")
        })
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.toggleButtonView}>
                            <Text style={styles.toggleText}>
                                Email Responses
                                {this.state.defaultEmailOption===true?" Enabled":" Disabled"}
                            </Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={this.state.defaultEmailOption ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={this.toggleSwitch}
                                value={this.state.defaultEmailOption}
                            />
                        </View>
                        <Text style={styles.text}>Current Email for Quiz Results</Text>
                        <TextInput
                            style={styles.textInput}
                            textAlign={'center'}
                            onChangeText={text => {this.setState({
                                quizEmail : text
                            })}}
                            value={this.state.quizEmail}
                        />
                        <Text style={styles.text}>Current Email for Minute Results</Text>
                        <TextInput
                            style={styles.textInput}
                            textAlign={'center'}
                            onChangeText={text => {this.setState({
                                quizEmail : text
                            })}}
                            value={this.state.feedbackEmail}
                        />
                        { this.state.error ?
                            <Text style={styles.errorMessage}>
                                {this.state.error}
                            </Text> : <Text/>}

                        <Button style={styles.buttonMessage}
                                title="Update Settings"
                                onPress={()=>{
                                    this.setData().then(r=>{
                                        console.log("set data")
                                    })
                                }}
                        />
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
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
    },
    toggleButtonView:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 30
    },
    toggleText:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        fontSize : 20,
        fontWeight: "bold",
        color: 'grey',
        textAlign: 'left',
    },
    textInput: {
        width: '100%',
        paddingTop:15,
        paddingBottom: 5,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1,
    },
    text:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 55,
        padding: 15,
        fontSize : 20,
        fontWeight: "bold",
        color: 'grey',
        marginTop: 25,
        textAlign: 'center',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 10,
        paddingBottom: 10,
    },
    buttonMessage: {
        marginTop : 30,
        paddingTop : 20,
        marginBottom: 30,
        paddingBottom : 20
    },
})
