import React, {Component} from 'react';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import {Linking, StyleSheet, View} from 'react-native';
import Dimensions from '../../Utils/Dimensions';
import ActionSheet from 'react-native-actionsheet';
import Courses from '../../Databases/Courses';
import Toast from 'react-native-simple-toast';
import Student from '../../Databases/Student';
import CheckBox from '@react-native-community/checkbox';
import database from '@react-native-firebase/database';
import * as config from '../../config';

export default class StudentCard extends Component{
    constructor(props) {
        super(props);
    }

    showActionSheet = () => {
        this.ActionSheet.show();
    };

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

    removeStudent = async ()=>{

        const courses = new Courses()
        const student = new Student()
        student.setName(this.props.student.name)
        student.setEmail(this.props.student.email)
        await student.facultySetUrl(this.props.student.email).then( async r=>{
            await courses.getCourse(this.props.course.passCode)
                .then(async courseUrl => {
                    await student.deleteCourse(courseUrl)
                        .then(r => Toast.show('Student removed'))
                })
        })
    }

    verifyStudent = async (email,courseUrl) => {
        let ans = []
        let url = ''
        await database()
            .ref(config['internalDb']+'/Student/')
            .equalTo(email)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object(snapshot.val());
                    if ("verified" in keys){
                        ans = keys["verified"].map(x=>x)
                }}
            })

        await database()
            .ref(config['internalDb']+'/Student/')
            .orderByChild("email")
            .equalTo(email)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.keys(snapshot.val());
                    url = keys[0]
                }
            })

        if (!ans.includes(courseUrl)){
            ans.push(courseUrl)
            await database()
                .ref(config['internalDb']+'/Student/'+url)
                .update({verified : ans})
                .then(()=>{console.log("Student Verified")})
        }
    }

    cancelStudent = async (email,courseUrl) => {
        
        let ans = []
        let abc = []
        await database()
            .ref(config['internalDb']+'/Student/')
            .equalTo(email)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object(snapshot.val());
                    if ("verified" in keys)
                        ans = keys["verified"].map(x=>x)
                }})
        
        for(let i = 0; i < ans.length; i++){
            if (!(ans[i]===courseUrl)){
                abc.push(ans[i])
            }}
        
        await database()
            .ref(config['internalDb']+'/Student/')
            .orderByChild("email")
            .equalTo(email)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.keys(snapshot.val());
                    url = keys[0]
                }
            })

        await database()
            .ref(config['internalDb']+'/Student/'+url)
            .update({verified : abc})
            .then(()=>{console.log("Student Cancelled")})
    }

    render() {
        if (this.props.type==="faculty"){
            return (
                <View>
                    <ListItem
                        onLongPress={()=>{this.showActionSheet()}}
                        underlayColor="#ffffff00"
                        key = {this.props.key}
                        containerStyle={styles.container}
                        bottomDivider>
                        <Avatar
                            title = {this.createTitle(this.props.student.name, this.props.student.email)}
                            titleStyle = {{color:"white", fontSize:20}}
                            overlayContainerStyle = {{backgroundColor: '#2697BF'}}
                            size = "medium"
                            rounded
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.title}>
                                {this.props.student.name!==undefined && this.props.student.name.replace(/\s+/g,' ').trim().length!==0
                                    ? this.props.student.name.replace(/\s+/g,' ').trim()
                                    : this.props.student.email}
                            </ListItem.Title>
                            <ListItem.Subtitle style={styles.caption}>
                                {this.props.student.email}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <CheckBox
                            style={{flex: 0.05, padding: 10}}
                            value={this.props.student['verified']}
                            onValueChange={ (newValue)=>{ 
                                if (this.props.student['verified']===0)
                                {
                                    this.props.student['verified'] = 1
                                    this.verifyStudent(this.props.student['email'],this.props.courseURL)
                                }
                                else
                                {
                                    this.props.student['verified'] = 0
                                    this.cancelStudent(this.props.student['email'],this.props.courseURL)
                                }
                            }}
                        />
                        <Icon
                            name = 'mail-forward'
                            type = 'font-awesome'
                            size = {20}
                            color = 'grey'
                            onPress = {() =>{
                                Linking.openURL('mailto:' + this.props.student.email).then(r  => console.log(r))
                            }}
                        />
                    </ListItem>
                    <ActionSheet
                        ref={o => (this.ActionSheet = o)}
                        title={'Do you want to remove this student?'}
                        options={[`Remove ${this.props.student.name!==undefined
                            ?this.props.student.name
                            :this.props.student.email}`, 'Cancel']}

                        cancelButtonIndex={1}
                        destructiveButtonIndex={0}
                        onPress={index => {
                            if(index===0)
                            this.removeStudent().then(()=>"")
                        }}
                    />
                </View>
            )
        }
        else
        {
        return (
            <View>
                <ListItem
                    onLongPress={()=>{}}
                    underlayColor="#ffffff00"
                    key = {this.props.key}
                    containerStyle={styles.container}
                    bottomDivider>
                    <Avatar
                        title = {this.createTitle(this.props.student.name, this.props.student.email)}
                        titleStyle = {{color:"white", fontSize:20}}
                        overlayContainerStyle = {{backgroundColor: '#2697BF'}}
                        size = "medium"
                        rounded
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {this.props.student.name!==undefined && this.props.student.name.replace(/\s+/g,' ').trim().length!==0
                                ? this.props.student.name.replace(/\s+/g,' ').trim()
                                : this.props.student.email}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.caption}>
                            {this.props.student.email}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <Icon
                        name = 'mail-forward'
                        type = 'font-awesome'
                        size = {20}
                        color = 'grey'
                        onPress = {() =>{
                            Linking.openURL('mailto:' + this.props.student.email).then(r  => console.log(r))
                        }}
                    />
                </ListItem>
            </View>
        )
        }
}}

const styles = StyleSheet.create({
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
