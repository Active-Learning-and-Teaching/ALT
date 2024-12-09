import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import Dimensions from '../utils/Dimentions';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Announcement from '../database/announcement';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

// Define types for the props
interface AnnouncementCardProps {
    course: {
        passCode: string;
    };
    announcement: {
        id: string;
        date: string;
        [key: string]: any;
    };
    type: string;
    key: string | number; // key should be string or number based on React requirements
}

function AnnouncementCard({ course, announcement, type, key }: AnnouncementCardProps) {
    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheet = () => {
        showActionSheetWithOptions(
            {
                title: 'Do you want to delete this announcement?',
                options: ['Remove Announcement', 'Cancel'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
            },
            async (selectedIndex) => {
                if (selectedIndex === 0) {
                    await deleteAnnouncement();
                }
            }
        );
    };

    const deleteAnnouncement = async () => {
        const announcementObj = new Announcement();
        try {
            const url = await announcementObj.getAnnouncementUrl(course.passCode, announcement.date);
            if (url !== null) {
                await announcementObj.deleteAnnouncement(url);
            }
            Toast.show('Announcement deleted', Toast.LONG);
        } catch (error) {
            console.error('Error deleting announcement:', error);
            Toast.show('Error deleting announcement', Toast.LONG);
        }
    };

    return (
        <View>
            <ListItem
                onLongPress={() => {
                    if (type === 'faculty') {
                        showActionSheet();
                    }
                }}
                underlayColor="#ffffff00"
                key={key}
                containerStyle={styles.listItemContainer}
                bottomDivider
            >
                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle}>
                        {announcement.heading}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>
                        {announcement.description}
                    </ListItem.Subtitle>
                </ListItem.Content>
                <Badge
                    value={`  ${moment(announcement.date, 'DD/MM/YYYY HH:mm:ss')
                        .add(moment().utcOffset(), 'minutes')
                        .format('DD/MM/YYYY HH:mm:ss')}  `}
                    containerStyle={styles.badgeContainer}
                    textStyle={styles.badgeText}
                />
            </ListItem>
        </View>
    );
}

const styles = {
    listItemContainer: {
        width: Dimensions.window.width - 20,
        height: Dimensions.window.height / 8,
        margin: 6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        borderRadius: 16,
    } as ViewStyle,
    listItemTitle: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        color: 'black',
        fontSize: 18, // Adjust font size as needed
        fontWeight: 'bold',
        marginVertical: 4,
    } as TextStyle,
    listItemSubtitle: {
        color: 'black',
        fontSize: 14, // Adjust font size as needed
    } as TextStyle,
    badgeContainer: {
        position: 'absolute',
        top: 8,
        right: 10,
        borderRadius: 25,
    } as ViewStyle,
    badgeText: {
        color: 'white',
        fontSize: 10,
    } as TextStyle,
};

export default AnnouncementCard;
