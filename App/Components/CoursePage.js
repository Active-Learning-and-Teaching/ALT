import React, {Component} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import Clipboard from "@react-native-community/clipboard";
import Dimensions from '../Utils/Dimensions';
import {Tile} from 'react-native-elements';
import {CoursePics} from '../Utils/CoursePics';
import CourseAdd from './CourseAdd';
import database from '@react-native-firebase/database';
import * as config from '../config';
import AnnouncementCard from './AnnouncementCard';
import moment from 'moment';

export default class  CoursePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            announcementList : []
        };
    }
    getImage = () =>{
        console.log(CoursePics(this.state.course.imageURL))
        return CoursePics(this.state.course.imageURL)
    }

    getAnnouncements = () => {
        database()
            .ref(config['internalDb']+'/Announcements/')
            .orderByChild("passCode")
            .equalTo(this.state.course.passCode)
            .on('value', snapshot => {

                if (snapshot.val()){
                    const list = Object.values(snapshot.val());
                    list.sort(function(a, b) {
                        const keyA = moment(a.date, 'DD/MM/YYYY HH:mm');
                        const keyB = moment(b.date, 'DD/MM/YYYY HH:mm');
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    this.setState({
                        announcementList : list
                    })
                }
            })
    }

    componentDidMount() {
        this.getAnnouncements()
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <View style ={styles.grid}>
                        <Tile
                            onPress={()=>{
                                Clipboard.setString(this.state.course.passCode)
                                Toast.show('PassCode Copied to Clipboard');
                            }}
                            imageSrc={this.getImage()}
                            imageContainerStyle={styles.imageContainer}
                            activeOpacity={0.7}
                            title = {this.state.course.courseName + " (" + this.state.course.passCode + ")"}
                            titleStyle={styles.title}
                            caption={this.state.course.instructor}
                            captionStyle={styles.caption}
                            containerStyle={styles.container}
                            featured
                        />

                    </View>

                    <View style={styles.grid}>
                        {this.state.announcementList.map((item,i)=> (
                            <AnnouncementCard announcement = {item} key={i}/>
                        ))}
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
    grid: {
        marginBottom: 10,
        paddingBottom : 10,
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    container: {
        flex: 1,
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(5),
        marginBottom: 8,
        paddingBottom : 8
    },
    imageContainer: {
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(5),
        borderRadius: 20,
        overflow: 'hidden',
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        position: 'absolute',
        left: 15,
        fontSize: 22,
        top: 15,
        color:'white'
    },
    caption: {
        position: 'absolute',
        left: 15,
        bottom: 15,
        fontSize: 18,
        color:'white'
    },
})
