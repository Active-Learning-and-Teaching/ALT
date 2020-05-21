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

    constructor() {
    }


    getcourseName() {
        return this.courseName;
    }

    setcourseName(courseName) {
        this.courseName = courseName;
    }

    getcourseCode() {
        return this.courseCode;
    }

    setcourseCode(courseCode) {
        this.courseCode = courseCode;
    }

    getRoom() {
        return this.room;
    }

    setRoom(room) {
        this.room = room;
    }

    getDays() {
        return this.days;
    }

    setDays(days) {
        this.days = days;
    }

    setInstructor(faculty){
        this.instructor = faculty
    }

    // getCourseFaculty = async (userID) =>{
    //     await this.reference
    //         .orderByChild("instructor")
    //         .equalTo(userID)
    //         .on("value")
    //         .then(snapshot =>{
    //             console.log(snapshot)
    //         })
    // }

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
