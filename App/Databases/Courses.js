import database from '@react-native-firebase/database';
import * as config from '../config';
import Faculty from './Faculty';

class Courses {

    courseName :string
    courseCode :string
    room : string
    days : []
    passCode : string
    instructors = []
    imageURL : string
    instructor : string

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

    getPassCode(){
        return this.passCode
    }

    setPassCode(){
        this.passCode = (+new Date).toString(36)
    }

    async setImage(){
        this.imageURL = Math.floor(Math.random() * (8)) +1
    }

    getImage(){
        return this.imageURL
    }

    addInstructors(faculty){
        this.instructors.push(faculty.getUrl())
        this.instructor = faculty.getName()
    }

    reference = database().ref(config['internalDb']+'/Courses/')

    getCourse  = async (passCode)=> {
        let ans = ""
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.keys(snapshot.val());
                    ans = keys[0]
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
                passCode : this.passCode,
                instructors : this.instructors,
                imageURL : this.imageURL,
                instructor: this.instructor
            })
            .then(()=>{
                console.log('Data added')
                console.log(this.passCode)
            })
    }


    getCourseByUrl = async (courseUrl) => {
        let ans = {}
        await database()
            .ref(config['internalDb']+'/Courses/'+courseUrl)
            .once('value')
            .then(snapshot => {
                if (snapshot.val())
                    ans = snapshot.val()
            })
        return ans
    }

}

// const courses = new Courses()
export default Courses;
