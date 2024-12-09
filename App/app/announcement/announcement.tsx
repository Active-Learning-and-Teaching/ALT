import Clipboard from "@react-native-community/clipboard";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { CoursePics } from '../utils/coursePics';
import Dimensions from '../utils/Dimentions';
import AnnouncementCard from './announcementCard';

// Define the types for the props passed from the route
type AnnouncementRouteProp = RouteProp<{ params: { type: string; course: Course } }, 'params'>;

// Define a type for the Course object
interface Course {
    courseCode: string;
    courseName: string;
    passCode: string;
    instructor: string;
    imageURL: string;
}

// Define a type for the Announcement object
interface Announcement {
    id: string;
    date: string; // Assuming date is a string in 'DD/MM/YYYY HH:mm:ss' format
    [key: string]: any; // Allows other properties as needed
}

function Announcement() {
    const routes = useRoute<AnnouncementRouteProp>();
    const { type, course } = routes.params;
    const [image, setImage] = useState<string>("");
    const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);

    const getImage = () => {
        setImage(CoursePics(course.imageURL));
    };

    const getAnnouncements = () => {
        firestore()
            .collection('Announcements')
            .where("passCode", "==", course.passCode)
            .onSnapshot((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
                setAnnouncementList([]);
                if (!snapshot.empty) {
                    const list = snapshot.docs.map((doc) => {
                        let id = doc.id;
                        return {
                            ...doc.data(),
                            id,
                        } as Announcement;
                    });
                    list.sort((a, b) => {
                        const keyA = moment.utc(a.date, 'DD/MM/YYYY HH:mm:ss');
                        const keyB = moment.utc(b.date, 'DD/MM/YYYY HH:mm:ss');
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    setAnnouncementList(list);
                }
            });
    };

    useEffect(() => {
        getAnnouncements();
        getImage();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <ImageBackground
                        source={{ uri: image }}
                        loadingIndicatorSource={require('../../assets/LoadingImage.jpg')}
                        style={styles.imageBackground}
                    >
                        <Avatar
                            titleStyle={styles.avatarTitle}
                            containerStyle={styles.avatarContainer}
                            onPress={() => {
                                console.log(course.passCode);
                                Clipboard.setString(course.passCode);
                                Toast.show('Passcode Copied to Clipboard', Toast.SHORT);
                            }}
                            title={
                                course.courseCode + " " +
                                course.courseName + " (" +
                                course.passCode + ")"
                            }
                            activeOpacity={0.5}
                        />
                        <Text style={styles.instructorText}>{course.instructor}</Text>
                    </ImageBackground>
                </View>

                <View style={styles.announcementListContainer}>
                    {announcementList.map((item, i) => (
                        <AnnouncementCard
                            announcement={item}
                            key={i}
                            type={type}
                            course={course}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    headerContainer: {
        marginTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    imageBackground: {
        borderRadius: 20,
        width: Dimensions.window.width - 20,
        height: Dimensions.window.height / 4,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.20,
        shadowRadius: 2.00,
        elevation: 25,
    },
    avatarContainer: {
        flex: 1,
        width: Dimensions.window.width - 20,
        height: Dimensions.window.height / 5,
        marginBottom: 8,
        paddingBottom: 8,
    },
    avatarTitle: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        position: 'absolute',
        left: 15,
        right: 5,
        fontSize: 20,
        top: 15,
        color: 'white',
    },
    instructorText: {
        position: 'absolute',
        left: 5,
        bottom: 5,
        color: 'white',
        fontSize: 18,
    },
    announcementListContainer: {
        marginTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
});

export default Announcement;
