import React from 'react';
import {View} from 'react-native';
import { ListItem, Badge } from 'react-native-elements'
import Dimensions from '../../Utils/Dimensions';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Announcement from '../../Databases/Announcement';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

function AnnouncementCard({course,announcement,type,key}) {

    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheet = () => {
        showActionSheetWithOptions({
            title:'Do you want to delete this announcement?',
            options:['Remove Announcement','Cancel'],
            cancelButtonIndex:1,
            destructiveButtonIndex:0,
        }, async (selectedIndex) => {
        switch (selectedIndex) {
            case destructiveButtonIndex=0:
               await deleteAnnouncement()
            break;
            case cancelButtonIndex=1:
        }});
    };

    const deleteAnnouncement = async () =>{
        const announcementObj = new Announcement()
        await announcementObj.getAnnouncementUrl(course.passCode, announcement.date)
        .then(async url=>{
            await announcementObj.deleteAnnouncement(url)
                .then(r=>{Toast.show('Announcement deleted')
            })
        })
    }

  return (
        <View>
            <ListItem
                onLongPress={()=>{
                    type==="faculty"
                    ?showActionSheet()
                    :""
                }}
                underlayColor="#ffffff00"
                key = {key}
                containerStyle={{
                    width : Dimensions.window.width-20,
                    height : Dimensions.window.height/8,
                    margin: 6,
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.05,
                    borderRadius: 16,
                }}
                bottomDivider
                >
                <ListItem.Content>
                    <ListItem.Title className="self-start text-left text-black text-base font-bold my-1">
                        {announcement.heading}
                    </ListItem.Title>
                    <ListItem.Subtitle className='text-black text-sm'>
                        {announcement.description}
                    </ListItem.Subtitle>
                </ListItem.Content>
                <Badge
                    value = {"  "+moment(announcement.date,'DD/MM/YYYY HH:mm:ss').add(moment().utcOffset(), "minutes").format('DD/MM/YYYY HH:mm:ss')+"  "}
                    containerStyle = {{
                        position : 'absolute',
                        top : 8,
                        right : 10,
                        borderRadius: 25,
                    }}
                    textStyle={{color:"white", fontSize:10}}
                    />
            </ListItem>
        </View>
    )
}

export default AnnouncementCard