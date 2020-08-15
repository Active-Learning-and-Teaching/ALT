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
                    a.name!==undefined && b.name!==undefined
                    ? a.name.toUpperCase() > b.name.toUpperCase()
                        ? 1
                        : ((b.name.toUpperCase()  > a.name.toUpperCase())
                            ? -1
                            : 0)
                    : a.email > b.email
                        ? 1
                        : b.email > a.email
                            ? -1
                            : 0
                );
                this.setState({
                    studentList : list
                })
                this.props.route.params.getStudentListData(list)
            })
    }

    createTitle = (name,email)=>{
        if(name!==undefined){
            name = name.replace(/\s+/g,' ').trim();
            if(name.length==0)
                return email.charAt(0).toUpperCase();
            const res = name.split(" ");
            if(res.length===1)
                return res[0].charAt(0).toUpperCase();
            else if(res.length>1)
                return res[0].charAt(0).toUpperCase()+res[res.length-1].charAt(0).toUpperCase()
        }
        return email.charAt(0).toUpperCase();
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
                                    title : this.createTitle(student.name, student.email),
                                    titleStyle : {color:"white", fontSize:20},
                                    overlayContainerStyle : {backgroundColor: '#2697BF'},
                                    size : "medium",
                                    rounded : true
                                }}
                                rightIcon={{
                                    name : 'mail-forward',
                                    type : 'font-awesome',
                                    size : 20,
                                    color : 'grey',
                                    onPress : () =>{
                                        Linking.openURL('mailto:' + student.email).then(r  => console.log(r))
                                    }
                                }}
                                title={student.name!==undefined && student.name.replace(/\s+/g,' ').trim().length!==0
                                        ? student.name.replace(/\s+/g,' ').trim()
                                        : student.email}
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
        paddingBottom : 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.10,
        shadowRadius: 5.00,
        elevation: 4,
        borderRadius: 15,
    },
    grid: {
        marginTop : 10,
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
