import database from '@react-native-firebase/database';
import * as config from '../config';

class Student {

    id :string
    name :string
    email : string

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

    reference = database().ref(config['internalDb']+'/Student/')

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
