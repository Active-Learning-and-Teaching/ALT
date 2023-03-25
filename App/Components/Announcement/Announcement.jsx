import React, {useEffect,useState} from 'react';
import {SafeAreaView, ScrollView, View, Text, ImageBackground} from 'react-native';
import Toast from 'react-native-simple-toast';
import Clipboard from "@react-native-community/clipboard";
import Dimensions from '../../Utils/Dimensions';
import {Avatar} from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import {CoursePics} from '../../Utils/CoursePics';
import database from '@react-native-firebase/database';
import AnnouncementCard from './AnnouncementCard';
import moment from 'moment';


function Announcement() {
    const route = useRoute()
    const [type,setType] = useState(route.params.type)
    const [course,setCourse] = useState(route.params.course)
    const [user,setuser] = useState(route.params.user)
    const [image,setImage] = useState("")
    const [announcementList,setAnnouncementList] = useState([])

    const getImage = () =>{
        setImage(CoursePics(course.imageURL))
    }
        
    const getAnnouncements = () => {
        database()
        .ref('InternalDb/Announcements/')
        .orderByChild("passCode")
        .equalTo(course.passCode)
        .on('value', snapshot => {
            if (snapshot.val()){
                const list = Object.values(snapshot.val());
                list.sort(function(a, b) {
                    const keyA = moment.utc(a.date, 'DD/MM/YYYY HH:mm:ss');
                    const keyB = moment.utc(b.date, 'DD/MM/YYYY HH:mm:ss');
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                });
                setAnnouncementList(list)
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
                        className="mb-2 h-[calc(100vh/5)] p-2 shadow-md"
                        style={{
                            width : Dimensions.window.width-20,
                            height : Dimensions.window.height/(4)
                        }}
                    >
                        <Avatar
                            onPress={()=>{
                                Clipboard.setString(course.passCode)
                                Toast.show('Passcode Copied to Clipboard');
                            }}
                            title = {
                                course.courseCode + " " +
                                course.courseName + " (" +
                                course.passCode + ")"
                            }
                            className="absolute left-15 right-5 top-15 text-white text-20 self-start text-left"
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

export default Announcement