import Clipboard from "@react-native-community/clipboard";
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { CoursePics } from '../../Utils/CoursePics';
import Dimensions from '../../Utils/Dimensions';
import AnnouncementCard from './AnnouncementCard';

function Announcement() {
    const routes = useRoute()
    const {type,course} = routes.params
    const [image,setImage] = useState("")
    const [announcementList,setAnnouncementList] = useState([])

    const getImage = () =>{
        setImage(CoursePics(course.imageURL))
    }
        
    const getAnnouncements = () => {
        firestore()
            .collection('Announcements')
            .where("passCode", "==", course.passCode)
            .onSnapshot(snapshot => {
                setAnnouncementList([]);
                if (!snapshot.empty){
                    const list = snapshot.docs.map((doc)=>{
                        let id = doc.id
                        return {
                            ...doc.data(),
                            id
                        }
                    });
                    list.sort(function(a, b) {
                        const keyA = moment.utc(a.date, 'DD/MM/YYYY HH:mm:ss');
                        const keyB = moment.utc(b.date, 'DD/MM/YYYY HH:mm:ss');
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    setAnnouncementList(list);
                }
            })
    }

    useEffect(() =>{
        getAnnouncements()
        getImage()
    },[])


  return (
        <SafeAreaView className='flex-1 bg-transparent'>
            <ScrollView>
                <View className='mt-5 pb-5 items-center'>
                    <ImageBackground
                        source={image}
                        loadingIndicatorSource={require('../../Assets/LoadingImage.jpg')}
                        borderRadius={20}
                        className="mb-2 h-[calc(100vh/5)] p-2 shadow-md "
                        style={{
                            width : Dimensions.window.width-20,
                            height : Dimensions.window.height/(4)
                        }}
                    >
                        <Avatar
                            titleStyle={styles.title}
                            containerStyle={styles.container}
                            onPress={()=>{
                                console.log(course.passCode)
                                Clipboard.setString(course.passCode)
                                Toast.show('Passcode Copied to Clipboard');
                            }}
                            title = {
                                course.courseCode + " " +
                                course.courseName + " (" +
                                course.passCode + ")"
                            }
                            activeOpacity={0.5}
                        />
                        <Text className="absolute left-5 bottom-5 text-white text-18">{course.instructor}</Text>
                    </ImageBackground>
                </View>

                <View className='mt-5 pb-5 items-center'>
                    {announcementList.map((item,i)=> (
                        <AnnouncementCard   
                            announcement = {item}
                            key={i}
                            type={type}
                            course={course}
                        />
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>

    )
}

const styles  = StyleSheet.create({
    container: {
        flex: 1,
        width : Dimensions.window.width-20,
        height : Dimensions.window.height/(5),
        marginBottom: 8,
        paddingBottom : 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.20,
        shadowRadius: 2.00,
        elevation: 25,
    },
    title: {
        alignSelf:'flex-start',
        textAlign: 'left',
        position: 'absolute',
        left: 15,
        right: 5,
        fontSize: 20,
        top: 15,
        color:'white',
    }
});

export default Announcement