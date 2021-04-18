/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from 'react-native';
import moment from 'moment';
import database from '@react-native-firebase/database';
import Announcement from '../../Databases/Announcement';

export default class AnnouncementsAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: '',
            description : '',
            error: null,
        };
    }

    addAnnouncement = async () => {

        let {heading, description, error} = this.state;
        heading = heading.replace(/\s+/g,' ').trim();
        if (heading === '') {
            this.setState({
                error: "Please Enter Heading."
            })
        } else {
            heading = heading.charAt(0).toUpperCase() + heading.slice(1)
            const announcement =  new Announcement()
            const dateAndTime= moment(database().getServerTime()).format("DD/MM/YYYY HH:mm:ss")
            await announcement.createAnnouncement(
                this.props.course.passCode,
                heading,
                description,
                dateAndTime
            ).then(()=>{

                    this.setState({
                        heading: '',
                        description : ''
                    })

                    this.props.toggle()

                })

        }

    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style={styles.textCreate}>
                    New Announcement
                </Text>

                <TextInput
                    style={styles.textInput}
                    autoCapitalize="sentences"
                    placeholder="Heading"
                    placeholderTextColor = "grey"
                    onChangeText={heading => this.setState({ heading })}
                    value={this.state.heading}
                />

                <TextInput
                    style={styles.textInput}
                    autoCapitalize="sentences"
                    placeholder="Description"
                    placeholderTextColor = "grey"
                    onChangeText={description => this.setState({ description })}
                    value={this.state.description}
                />

                { this.state.error ?
                    <Text style={styles.errorMessage}>
                        {this.state.error}
                    </Text> : <Text/>}
                <Button style={styles.buttonMessage} buttonStyle={{backgroundColor: 'black'}} title="Share" onPress={this.addAnnouncement} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    textInput: {
        color:'black',
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    textCreate: {
        width: '100%',
        fontWeight: "bold",
        justifyContent: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        color : "grey",
        fontSize : 18,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 10,
        paddingBottom: 10,
    },
    buttonMessage: {
        marginTop: 15,
    }
});

