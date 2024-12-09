import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements';
import moment from 'moment';
import database from '@react-native-firebase/database';
import Announcement from '../database/announcement';
import Courses from '../database/courses';

interface AnnouncementsAddProps {
    course: Courses | undefined;
    toggle: () => void;
}

const AnnouncementsAdd: React.FC<AnnouncementsAddProps> = ({ course, toggle }) => {
    const [heading, setHeading] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const addAnnouncement = async () => {
        const newHeading = heading.replace(/\s+/g, ' ').trim();
        setHeading(newHeading);
        if (newHeading === '') {
            setError('Please Enter Heading.');
        } else {
            if (course === undefined) {
                return;
            }
            const formattedHeading = newHeading.charAt(0).toUpperCase() + newHeading.slice(1);
            setHeading(formattedHeading);
            const announcement = new Announcement();
            const dateAndTime = moment.utc(database().getServerTime()).format('DD/MM/YYYY HH:mm:ss');
            console.log(course.passCode, formattedHeading, description, dateAndTime);
            try {
                await announcement.createAnnouncement(
                    course.passCode,
                    formattedHeading,
                    description,
                    dateAndTime
                );
                setHeading('');
                setDescription('');
                toggle();
            } catch (error) {
                console.error('Error adding announcement:', error);
            }
        }
    };

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 5, backgroundColor: 'white' }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10, alignSelf: 'center', color: 'gray', fontSize: 20 }}>
                New Announcement
            </Text>

            <TextInput
                style={{ color: 'black', width: '100%', marginBottom: 5, alignSelf: 'center', borderBottomColor: 'gray', borderBottomWidth: 1 }}
                autoCapitalize="sentences"
                placeholder="Heading"
                placeholderTextColor="grey"
                onChangeText={(text) => setHeading(text)}
                value={heading}
            />
            
            <TextInput
                style={{ color: 'black', width: '100%', marginBottom: 5, alignSelf: 'center', borderBottomColor: 'gray', borderBottomWidth: 1 }}
                autoCapitalize="sentences"
                placeholder="Description"
                placeholderTextColor="grey"
                onChangeText={(text) => setDescription(text)}
                value={description}
            />

            {error ? (
                <Text style={{ color: 'red', marginBottom: 15, paddingTop: 10, paddingBottom: 10 }}>
                    {error}
                </Text>
            ) : (
                <Text />
            )}

            <View>
                <Button
                    buttonStyle={{ backgroundColor: 'tomato', borderColor: 'black', borderWidth: 2, borderRadius: 10, marginTop: 30, marginBottom: 30 }}
                    titleStyle={{ color: 'white', fontWeight: 'normal' }}
                    title="Share"
                    onPress={addAnnouncement}
                />
            </View>
        </View>
    );
};

export default AnnouncementsAdd;
