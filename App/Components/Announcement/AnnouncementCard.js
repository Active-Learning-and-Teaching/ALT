import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import { ListItem, Badge } from 'react-native-elements'
import Dimensions from '../../Utils/Dimensions';
import ActionSheet from 'react-native-actionsheet';
import Announcement from '../../Databases/Announcement';
import Toast from 'react-native-simple-toast';

export default class AnnouncementCard extends Component{
    constructor(props) {
        super(props);
    }

    showActionSheet = () => {
        this.ActionSheet.show();
    };


    //@Vishwesh
    deleteAnnouncement = async () =>{
        const announcement = new Announcement()
        await announcement.getAnnouncementUrl(this.props.course.passCode, this.props.announcement.date)
            .then(async url=>{
                await announcement.deleteAnnouncement(url)
                    .then(r=>{Toast.show('Announcement deleted')
                })
            })
    }

    render(){
        return(

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
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>
                            {this.props.announcement.heading}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.caption}>
                            {this.props.announcement.description}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <Badge
                        value = {"  "+this.props.announcement.date+"  "}
                        containerStyle = {styles.date}
                        textStyle={{color:"white", fontSize:11}}
                    />
                </ListItem>
                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    title={'Do you want to delete this announcement?'}
                    options={[`Remove Announcement`, 'Cancel']}

                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={index => {
                        if(index===0)
                            this.deleteAnnouncement().then(()=>"")
                    }}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(6),
        marginTop: 6,
        marginBottom: 6,
        paddingTop : 6,
        paddingBottom : 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.50,
        elevation: 1,
        borderRadius: 15,
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        fontSize: 16,
        color:'black',
        marginTop: 1,
        paddingTop : 1,
        marginBottom: 8,
        paddingBottom : 8,
        fontWeight : "bold"
    },
    date: {
        position : 'absolute',
        top : 8,
        right : 4
        // marginTop: 0,
        // paddingTop : 0,
        // marginBottom: 30,
        // paddingBottom : 30,
    },
    caption: {
        fontSize: 12,
        color:'black'
    },
})
