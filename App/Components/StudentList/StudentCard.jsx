import React from 'react';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import {Linking, StyleSheet, View} from 'react-native';
import Dimensions from '../../utils/Dimensions';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Courses from '../../database/Courses';
import Toast from 'react-native-simple-toast';
import Student from '../../database/Student';
import CheckBox from '@react-native-community/checkbox';
import database from '@react-native-firebase/database';

function StudentCard({toggle, course, type, key, courseURL, student}) {

    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheet = () => {
        showActionSheetWithOptions({
            title:'Options',
            options:[
                `Remove 
                ${student.name!==undefined
                ?student.name
                :student.email}`,

                `Make Course TA
                ${student.name!==undefined?
                student.name
                :student.email}`,

                'Cancel'],
            cancelButtonIndex:2,
            destructiveButtonIndex:0,
        }, async (selectedIndex) => {
        switch (selectedIndex) {
            case 0:
                removeStudent()
            break;
            case 1:
                makeTA()
            break;
            case 2:
        }});
    };

    const createTitle = (name,email)=>{
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

    const removeStudent = async ()=>{
        const coursesObj = new Courses()
        const studentObj = new Student()
        studentObj.setName(student.name)
        studentObj.setEmail(student.email)
        await studentObj.facultySetUrl(student.email)
        .then( async r=>{
            await coursesObj.getCourse(course.passCode)
            .then(async courseUrl => {
                await studentObj.deleteCourse(courseUrl)
                    .then(r => Toast.show('Student removed'))
            })
        })
    }

    const makeTA = async ()=>{
        const coursesObj = new Courses();
        const studentObj = new Student()
        await studentObj.setEmail(student.email)
        await studentObj.setUrl();
        const facultyURL = course.instructors[0];
        const studentURL = student.url;
        await coursesObj.addTAs(`${facultyURL}_${studentURL}`,courseURL)
        if (course) {
            await studentObj.addTACourseStudent(courseURL)
            .then(r => console.log('Added Course to Student'));
            toggle();
        }
    }

    const verifyStudent = async (email,courseUrl) => {
        let ans = []
        let url = ''
        await database()
            .ref('InternalDb/Student/')
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
            .ref('InternalDb/Student/')
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
                .ref('InternalDb/Student/'+url)
                .update({verified : ans})
                .then(()=>{console.log("Student Verified")})
        }
    }

    const cancelStudent = async (email,courseUrl) => {
        
        let ans = []
        let abc = []
        await database()
            .ref('InternalDb/Student/')
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
            .ref('InternalDb/Student/')
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
            .ref('InternalDb/Student/'+url)
            .update({verified : abc})
            .then(()=>{console.log("Student Cancelled")})
    }

    if (type==="faculty"){
        return (
            <View>
                <ListItem
                    onLongPress={()=>{showActionSheet()}}
                    underlayColor="#ffffff00"
                    key = {key}
                    containerStyle={styles.container}
                    bottomDivider>
                    <Avatar
                        title = {createTitle(student.name, student.email)}
                        titleStyle = {{color:"white", fontSize:20}}
                        overlayContainerStyle = {{backgroundColor: 'tomato'}}
                        size = "medium"
                        rounded
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {student.name!==undefined && student.name.replace(/\s+/g,' ').trim().length!==0
                                ? student.name.replace(/\s+/g,' ').trim()
                                : student.email}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.caption}>
                            {student.email}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <CheckBox
                        style={{flex: 0.05, padding: 10}}
                        value={student['verified']===1}
                        onValueChange={ (newValue)=>{ 
                            if (student['verified']===0)
                            {
                                student['verified'] = 1
                                verifyStudent(student['email'],courseURL)
                            }
                            else
                            {
                                student['verified'] = 0
                                cancelStudent(student['email'],courseURL)
                            }
                        }}
                    />
                    <Icon
                        name = 'mail-forward'
                        type = 'font-awesome'
                        size = {20}
                        color = 'grey'
                        onPress = {() =>{
                            Linking.openURL('mailto:' + student.email).then(r  => console.log(r))
                        }}
                    />
                </ListItem>
            </View>
        )
    }
    else{
        return (
            <View>
                <ListItem
                    onLongPress={()=>{}}
                    underlayColor="#ffffff00"
                    key = {key}
                    containerStyle={styles.container}
                    bottomDivider>
                    <Avatar
                        title = {createTitle(student.name, student.email)}
                        titleStyle = {{color:"white", fontSize:20}}
                        overlayContainerStyle = {{backgroundColor: 'tomato'}}
                        size = "medium"
                        rounded
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {student.name!==undefined && student.name.replace(/\s+/g,' ').trim().length!==0
                                ? student.name.replace(/\s+/g,' ').trim()
                                : student.email}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.caption}>
                            {student.email}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <Icon
                        name = 'mail-forward'
                        type = 'font-awesome'
                        size = {20}
                        color = 'grey'
                        onPress = {() =>{
                            Linking.openURL('mailto:' + student.email).then(r  => console.log(r))
                        }}
                    />
                </ListItem>
            </View>
        )
    }
}

export default StudentCard

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
            height: 5,
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
