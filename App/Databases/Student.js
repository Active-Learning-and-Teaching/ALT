import database from '@react-native-firebase/database';
import * as config from '../config';

class Student {

    id :string
    name :string
    email : string
    url : string

    constructor() {
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

    setUrl(){
        this.getFaculty(this.email)
            .then( val => {
                    this.url = val
                }
            )
    }
    getUrl(){
        return this.url
    }

    reference = database().ref(config['internalDb']+'/Student/')

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

    getStudent  = async (email)=> {
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
                photo : null,
                id : id
            })
            .then(()=>{
                console.log('Data added')
            })
    }
}


export default Student;
