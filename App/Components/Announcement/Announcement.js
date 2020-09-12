import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View, Text, ImageBackground} from 'react-native';
import Toast from 'react-native-simple-toast';
import Clipboard from "@react-native-community/clipboard";
import Dimensions from '../../Utils/Dimensions';
import {Avatar} from 'react-native-elements';
import {CoursePics} from '../../Utils/CoursePics';
import database from '@react-native-firebase/database';
import * as config from '../../config.json';
import AnnouncementCard from './AnnouncementCard';
import moment from 'moment';

export default class  Announcement extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            image : "",
            announcementList : []
        };
    }
    getImage = () =>{
        this.setState({
            image : CoursePics(this.state.course.imageURL)
        })
    }

    getAnnouncements = () => {
        database()
            .ref(config['internalDb']+'/Announcements/')
            .orderByChild("passCode")
            .equalTo(this.state.course.passCode)
            .on('value', snapshot => {
                this.setState({
                    announcementList : []
                })
                if (snapshot.val()){
                    const list = Object.values(snapshot.val());
                    list.sort(function(a, b) {
                        const keyA = moment(a.date, 'DD/MM/YYYY HH:mm:ss');
                        const keyB = moment(b.date, 'DD/MM/YYYY HH:mm:ss');
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
        this.getImage()
    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <View style ={styles.grid}>
                        <ImageBackground
                            source={this.state.image}
                            loadingIndicatorSource={require('../../Assets/LoadingImage.jpg')}
                            borderRadius={20}
                            style={styles.container}
                        >
                            <Avatar
                                onPress={()=>{
                                    Clipboard.setString(this.state.course.passCode)
                                    Toast.show('PassCode Copied to Clipboard');
                                }}
                                title = {
                                    this.state.course.courseCode + " " +
                                    this.state.course.courseName + " (" +
                                    this.state.course.passCode + ")"
                                }
                                titleStyle={styles.title}
                                containerStyle={styles.container}
                                activeOpacity={0.7}
                            />
                            <Text style={styles.name}>{this.state.course.instructor}</Text>
                        </ImageBackground>
                    </View>

                    <View style={styles.grid}>
                        {this.state.announcementList.map((item,i)=> (
                            <AnnouncementCard announcement = {item}
                                              key={i}
                                              type={this.state.type}
                                              course={this.state.course}
                            />
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
        marginTop: 10,
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
        paddingBottom : 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.20,
        shadowRadius: 2.00,
        elevation: 24,
    },
    imageContainer: {
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(5),
        borderRadius: 20,
        overflow: 'hidden',
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        paddingTop : 10,
        paddingBottom : 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.20,
        shadowRadius: 2.00,
        elevation: 24,
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        position: 'absolute',
        left: 15,
        right: 5,
        fontSize: 20,
        top: 15,
        color:'white',
    },
    name: {
        position: 'absolute',
        left: 15,
        bottom: 15,
        fontSize: 18,
        color:'white'
    },
})
