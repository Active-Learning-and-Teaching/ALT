import database from '@react-native-firebase/database';
import * as config from '../config';
import Faculty from './Faculty';

class Courses {

    courseName :string
    courseCode :string
    room : string
    days : []
    passCode : string
    instructor : Faculty

    constructor(courseName, courseCode, room, days) {
        this.courseName = courseName
        this.courseCode = courseCode
        this.room = room
        this.days = days
        this.passCode = courseCode
    }



    setInstructor(faculty){
        this.instructor = faculty
    }

    getCourse  = async ()=> {
        let ans = false
        await this.reference
            .orderByChild("courseCode")
            .equalTo(this.courseCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    ans = true
                }
            })
        return ans
    }

    createCourse =  ()=>{
        this.reference
            .push()
            .set({
                courseName : this.courseName,
                courseCode : this.courseCode,
                room : this.room,
                days : this.days,
                passCode : this.courseCode,
                instructor : this.instructor.getID(),
            })
            .then(()=>{
                console.log('Data added')
            })
    }


    reference = database().ref(config['internalDb']+'/Courses/')





}

// const courses = new Courses()
export default Courses;
