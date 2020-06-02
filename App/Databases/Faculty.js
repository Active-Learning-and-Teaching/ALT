import database from '@react-native-firebase/database';
import * as config from '../config';

class Faculty {

    id :string
    name :string
    email : string
    url : string

    constructor(){
    }

    setID(id){
        this.id = id;
    }

    setName(name){
        this.name = name;
    }
    setEmail(email){
        this.email = email;
    }

    getID(){
        return this.id
    }

    getName(){
        return this.name
    }

    getEmail(){
        return this.email
    }
    async setUrl() {
        await this.getFaculty(this.email)
            .then(val => {
                    this.url = val
                }
            )
    }
    getUrl(){
        return this.url
    }

    reference = database().ref(config['internalDb']+'/Faculty/')

    //Checking if user is faculty
    checkFaculty = async (email)=> {
        let ans = false
        await database()
            .ref(config['sheetFaculty'])
            .orderByChild("Email")
            .equalTo(email)
            .once("value")
            .then(snapshot => {
                if (snapshot.val()){
                    ans = true
                }
            })
        return ans
    }

    //Login
    getUser  = async (email)=> {
        let ans = false
        await this.reference
            .orderByChild("email")
            .equalTo(email)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    ans = true
                }
            })
        return ans
    }

    //Getting Faculty Url for Course Signature
    getFaculty  = async (email)=> {
        let ans = ""
        await this.reference
            .orderByChild("email")
            .equalTo(email)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.keys(snapshot.val());
                    ans = keys[0]
                }
            })
        return ans
    }


    createUser =  (id, name, email)=>{
        console.log(id)
        this.reference
            .push()
            .set({
                name : name,
                email : email,
                photo : 0,
                id : id,
                courses : []
            })
            .then(()=>{
                console.log('Data added')
            })
    }


    getAllFaculty

    getCoursesofFaculty = async () =>{
        let ans = []
        await database()
            .ref(config['internalDb']+'/Faculty/'+this.url)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object(snapshot.val());
                    if ("courses" in keys)
                        ans = keys["courses"].map(x=>x)
                }
            })
        return ans
    }

    setCourseFaculty = async (courses) =>{
        await database()
            .ref(config['internalDb']+'/Faculty/'+this.url)
            .set({
                name : this.getName(),
                email : this.getEmail(),
                photo : 0,
                id : this.getID(),
                courses : courses
            })
            .then(()=>{
                console.log("Courses added")
            })
    }

    addCourse = async (courseUrl) => {
        await this.getCoursesofFaculty().then(
            value => {
                value.push(courseUrl)
                this.setCourseFaculty(value)
            }
        )
    }









}

export default Faculty;
