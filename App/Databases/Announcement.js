import database from '@react-native-firebase/database';
import * as config from '../config';

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

    reference = database().ref(config['internalDb']+'/Announcements/')

    createAnnouncement =  async (passCode, heading, description, date) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                heading: heading,
                description: description,
                date: date
            })
            .then(() => {
                console.log('Data added')
            })
    }

}


export default Announcement;
