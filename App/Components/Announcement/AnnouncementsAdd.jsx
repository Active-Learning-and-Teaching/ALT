/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View,TextInput,} from 'react-native';
import {Button, Text} from 'react-native-elements';
import moment from 'moment';
import database from '@react-native-firebase/database';
import Announcement from '../../database/Announcement';

function AnnouncementsAdd({course,toggle}) {
    const [heading,setHeading] = useState('')
    console.log(heading)
    const [description,setDescription] = useState('')
    const [error,setError] = useState(null)

    const addAnnouncement = async () => {
        const newHeading = heading.replace(/\s+/g,' ').trim()
        setHeading(newHeading);
        if (heading === '') {
            setError("Please Enter Heading.")
        } 
        else {
            const newHeading = heading.charAt(0).toUpperCase() + heading.slice(1)
            setHeading(newHeading)
            const announcement =  new Announcement()
            const dateAndTime= moment.utc(database().getServerTime()).format("DD/MM/YYYY HH:mm:ss")
            console.log(course.passCode, heading, description, dateAndTime)
            await announcement.createAnnouncement(
                course.passCode,
                heading,
                description,
                dateAndTime
            ).
            then(()=>{
                setHeading('')
                setDescription('')
                toggle()
            })
        }
    }

    return(
        <View className='flex-1 flex-col justify-center p-5 bg-white'>
            <Text className="text-center font-bold mb-10 self-center text-gray-700 text-xl">
                New Announcement
            </Text>

            <TextInput
                className="text-black w-full mb-5 self-center border-b border-gray-300"
                autoCapitalize="sentences"
                placeholder="Heading"
                placeholderTextColor = "grey"
                onChangeText={text=>setHeading(text)}
                value={heading}
            />

            <TextInput
                className="text-black w-full mb-5 self-center border-b border-gray-300"
                autoCapitalize="sentences"
                placeholder="Description"
                placeholderTextColor = "grey"
                onChangeText={text=>setDescription(text)}
                value={description}
            />

            {error ? 
            <Text className='text-red-500 mb-15 pt-10 pb-10'> 
                {error}
            </Text> : <Text/>
            }

            <View>
                <Button 
                    className='bg-[tomato] border-black border-2 rounded-lg mt-30 mb-30'
                    titleStyle={{color:'white',fontWeight:'normal'}} 
                    title="Share" 
                    onPress={addAnnouncement} 
                />
            </View>
        </View>
    );

}

export default AnnouncementsAdd

