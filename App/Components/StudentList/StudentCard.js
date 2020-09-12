import React, {Component} from 'react';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import {Linking, StyleSheet, View} from 'react-native';
import Dimensions from '../../Utils/Dimensions';
import ActionSheet from 'react-native-actionsheet';
import Courses from '../../Databases/Courses';
import Toast from 'react-native-simple-toast';
import Student from '../../Databases/Student';

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

    render() {
        return (
            <View>
                <ListItem
                    onLongPress={()=>{
                        this.props.type==="faculty"
                            ?this.showActionSheet()
                            :""
                    }}
                    underlayColor="#ffffff00"
                    key = {this.props.key}
                    containerStyle={styles.container}
                    bottomDivider
                >
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
}

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
