import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect,useState} from 'react';
import Announcement from '../Announcement/Announcement';
import CourseAdd from '../Dashboard/CourseAdd';
import { useRoute } from '@react-navigation/native';
const Stack = createStackNavigator();

function AnnouncementStack() {
    const routes = useRoute()
    const {type, user, course} = routes.params
    const [isTA,setIsTA] =  useState(null)

    useEffect(()=>{
        const setTA = async() =>{
            const AllTAs = Object.keys(course.TAs)
            AllTAs.forEach(element => setIsTA(false||element.includes(user.url)));
            console.log(isTA)
        }
        setTA()
    },[])

    return (
        <Stack.Navigator>
            <Stack.Screen name='Announcements'
                   component={Announcement}
                   options={{
                       headerTitle : null,
                       headerShown : true,
                       headerBackTitle: '',
                       headerRight : ()=>(
                           type==='faculty'||isTA ?
                               <CourseAdd
                                   course ={course}
                               />
                               : null
                       )
                   }}
                   initialParams={{
                       type : type,
                       user: user,
                       course: course
                   }}
            />
        </Stack.Navigator>
    )
}

export default AnnouncementStack
