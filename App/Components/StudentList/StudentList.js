import React, {Component} from 'react';
import {Linking, Platform, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Dimensions from '../../Utils/Dimensions';
import {ListItem} from 'react-native-elements';
import database from '@react-native-firebase/database';
import * as config from '../../config.json';
import Courses from '../../Databases/Courses';

export default class StudentList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            type : this.props.route.params.type,
            course : this.props.route.params.course,
            user : this.props.route.params.user,
            studentList : [],
            courseURL : ''
        };
    }

    getCourseURL = async () => {
        const course = new Courses()
        await course.getCourse(this.state.course.passCode)
            .then(async url=>{
                await this.setState({
                    courseURL :url
                })
            })
    }

    getStudents = () => {
        database()
            .ref(config['internalDb'] + '/Student/')
            .orderByChild("courses")
            .on('value', snapshot => {
                const list = []
                snapshot.forEach( (data) => {
                    const keys = Object(data.val())

                    if ("courses" in keys){
                        const arr = data.val()["courses"]
                        if (arr.includes(this.state.courseURL)){
                            const dict = {}
                            dict["name"] = keys["name"]
                            dict["email"] = keys["email"]
                            dict["photo"] = keys["photo"]
                            list.push(dict)

                        }
                    }
                })
                list.sort((a,b) =>
                    (a.name.toUpperCase() > b.name.toUpperCase()) ? 1
                        : ((b.name.toUpperCase()  > a.name.toUpperCase()) ? -1 : 0));
                this.setState({
                    studentList : list
                })
            })
    }
    createTitle = (value)=>{
        const res = value.split(" ");
        if(res.length===1)
            return res[0].charAt(0).toUpperCase();
        else
            return res[0].charAt(0).toUpperCase()+res[res.length-1].charAt(0).toUpperCase()
    }

    componentDidMount() {
        this.getCourseURL().then(()=>{
            this.getStudents()
        })

    }

    render(){
        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <View style={styles.grid}>
                        {this.state.studentList.map((student,i)=> (
                            <ListItem
                                key = {i}
                                leftAvatar= {{
                                    title : this.createTitle(student.name),
                                    titleStyle : {color:"white", fontSize:20},
                                    overlayContainerStyle : {backgroundColor: '#2697BF'},
                                    size : "medium",
                                    rounded : true
                                }}
                                rightIcon={{
                                    name : 'envelope-o',
                                    type : 'font-awesome',
                                    size : 24,
                                    color : 'grey',
                                    onPress : () =>{
                                        Linking.openURL('mailto:' + student.email).then(r  => console.log(r))
                                    }
                                }}
                                title={student.name}
                                titleStyle={styles.title}
                                subtitle={student.email}
                                subtitleStyle={styles.caption}
                                containerStyle={styles.container}
                                bottomDivider
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
    container: {
        width : Dimensions.window.width-10,
        height : Dimensions.window.height/(9),
        marginTop: 2,
        marginBottom: 2,
        paddingTop : 2,
        paddingBottom : 2
    },
    grid: {
        marginBottom: 10,
        paddingBottom : 10,
        alignItems: 'center',
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        fontSize: 16,
        color:'black',
        marginTop: 1,
        paddingTop : 1,
        marginBottom: 2,
        paddingBottom : 2,
        fontWeight : "bold"
    },
    caption: {
        fontSize: 12,
        color:'black'
    },
})
