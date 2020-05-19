import database from '@react-native-firebase/database';
import * as config from '../config';

class Student {

    id :string
    name :string
    email : string

    constructor() {
    }

    reference = database().ref(config['internalDb']+'/Student/')

    getUser = async (id, name, email) => {
        await this.reference
            .orderByChild("email")
            .equalTo(email)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    console.log("true")
                }
                else{
                    console.log("false")
                    this.createUser(id, name, email)
                }
            })
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

const student = new Student()
export default student;
