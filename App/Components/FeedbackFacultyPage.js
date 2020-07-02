import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, ScrollView, TextInput} from 'react-native';
import {Icon, Text, Button} from 'react-native-elements';

export default class FeedbackFacultyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course,
            user: this.props.user,
            textInput : [],
            inputData : []
        }
    }

    addTextInput = (index) => {
        let textInput = this.state.textInput;
        textInput.push(
                <TextInput
                    style={styles.textInput}
                    key = {index}
                    onChangeText={(text) => this.addValues(text, index)}
                />
            );
        this.setState({ textInput });
    }

    getValues = () => {
        console.log('Data',this.state.inputData);
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

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text style={styles.heading}> New Minute Paper</Text>
                    <Icon
                        name='plus-circle'
                        type='font-awesome'
                        style={{borderRadius:1}}
                        onPress={() => this.addTextInput(this.state.textInput.length)}
                    />
                    {this.state.textInput.map((value) => {
                        return value
                    })}
                    <View style={styles.buttonContainer}>
                        <Button style={styles.buttonMessage} title='SUBMIT' onPress={this.getValues} />
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
    textInput: {
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
        padding: 35,
    },
})
