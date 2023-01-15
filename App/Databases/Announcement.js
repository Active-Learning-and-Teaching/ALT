import database from '@react-native-firebase/database';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
class Announcement {

    coursePasscode :string
    date :string
    heading : string
    description : string

    constructor() {
    }

    setCoursePasscode(coursePasscode){
        this.coursePasscode = coursePasscode;
    }
    getCoursePasscode(){
        return this.coursePasscode
    }

    setDate(date){
        this.date = date;
    }

    getDate(){
        return this.date
    }

    setHeading(heading){
        this.heading = heading;
    }

    getHeading(){
        return this.heading
    }

    setDescription(description){
        this.description = description;
    }

    getDescription(){
        return this.description
    }

    // reference = database().ref('InternalDb/Announcements/')
    reference = firestore().collection("Announcements");

    // createAnnouncement =  async (passCode, heading, description, date) => {
    //     await this.reference
    //         .push()
    //         .set({
    //             passCode: passCode,
    //             heading: heading,
    //             description: description,
    //             date: date
    //         })
    //         .then(() => {
    //             console.log('Data added')
    //         })
    // }

    createAnnouncement =  async (passCode, heading, description, date) => {
        await this.reference
            .add({
                passCode: passCode,
                heading: heading,
                description: description,
                date: date
            })
            .then(() => {
                console.log('Data added')
            })
    }


    // getAllAnnouncement = async (passCode)=>{
    //     let ans = ""
    //     await this.reference
    //         .orderByChild("passCode")
    //         .equalTo(passCode)
    //         .once('value')
    //         .then(snapshot => {
    //             if (snapshot.val()){
    //                 const list = Object.values(snapshot.val());
    //                 list.sort(function(a, b) {
    //                     const keyA = moment.utc(a.date, 'DD/MM/YYYY HH:mm:ss');
    //                     const keyB = moment.utc(b.date, 'DD/MM/YYYY HH:mm:ss');
    //                     if (keyA < keyB) return 1;
    //                     if (keyA > keyB) return -1;
    //                     return 0;
    //                 });
    //                 ans=list
    //             }
    //         })
    //         return ans
    // }

    getAllAnnouncement = async (passCode)=>{
        let ans = ""
        await this.reference
            .where("passCode", '==', passCode)
            .get()
            .then(snapshot => {
                if (!snapshot.empty){
                    const list = snapshot.docs.map(doc=>doc.data());;
                    list.sort(function(a, b) {
                        const keyA = moment.utc(a.date, 'DD/MM/YYYY HH:mm:ss');
                        const keyB = moment.utc(b.date, 'DD/MM/YYYY HH:mm:ss');
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    ans=list
                }
            })
            return ans
    }

    // deprecated
    getAnnouncementUrl = async (passCode, date)=>{
        let ans = ""
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const object = snapshot.val()
                    ans = Object.keys(object).find(key => object[key]['date'] === date);
                }
            })
        return ans
    }

    //@Vishwesh
    deleteAnnouncement = async (url)=>{
        await this.reference
            .doc(url)
            .delete()
            .then(()=>{
                console.log("Announcement deleted")
            })
    }



}


export default Announcement;
