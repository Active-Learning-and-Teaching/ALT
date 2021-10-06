import database from '@react-native-firebase/database';
import moment from 'moment';

class QuizResponses {

    coursePasscode :string
    userID :string
    userName : string
    answer : string
    timestamp:string

    constructor() {
    }


    reference = database().ref('InternalDb/KBCResponse/')

    getResponse  = async (userID, passCode)=> {
        let ans = null
        await this.reference
            .orderByChild("userID_passCode")
            .equalTo( userID+"_"+passCode)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()){
                    const keys = Object.keys(snapshot.val());
                    ans = keys[0]
                }
            })
        return ans
    }

    setResponse = async (passCode, userID, userName, answer, timestamp, name, url) =>{
        await database()
            .ref('InternalDb/KBCResponse/'+url)
            .set({
                passCode: passCode,
                userID: userID,
                userName: userName,
                userID_passCode : userID+"_"+passCode,
                answer: answer,
                timestamp:timestamp,
                name: name
            })
            .then(()=>{
                console.log("Response modified")
            })
    }

    createResponse =  async (passCode, userID, userName, answer, timestamp, name) => {
        await this.reference
            .push()
            .set({
                passCode: passCode,
                userID: userID,
                userName: userName,
                userID_passCode : userID+"_"+passCode,
                answer: answer,
                timestamp: timestamp,
                name: name
            })
            .then(() => {
                console.log('Response Created')
            })
    }

    // getAllStudentsforMail = async (passCode, startTime, endTime)=> {

    //     let url = null
    //     const db_ref = database().ref('InternalDb/Courses/');
    //     await db_ref.orderByChild("passCode").equalTo(passCode).once("value",
    //     function(snapshot) {url = Object.keys(snapshot.val())[0].replace(' ', '');},
    //     function(errorObject) {console.log("The read failed: " + errorObject.code);},)

    //     let vlist = null
    //     await database()
    //         .ref('InternalDb/Student/')
    //         .once('value')
    //         .then(snapshot => {
    //             const list = []
    //             snapshot.forEach( (data) => {
    //                 const keys = Object(data.val())
    //                 const x = data.key
    //                 if ("verified" in keys){
    //                     const arr = data.val()["verified"]
    //                     if (arr.includes(url)){
    //                         list.push(x)
    //                     }
    //                 }
    //             })
    //             vlist = list
    //         })
        
    //     let ans = null
    //     let attempted = null

    //     await this.reference
    //         .orderByChild("passCode")
    //         .equalTo(passCode)
    //         .once('value')
    //         .then(snapshot => {
    //             const a = {}
    //             const b = []
    //             snapshot.forEach( (data) => {
    //                 const keys = Object(data.val())
    //                 const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
    //                 const temp1 = moment(keys["timestamp"], "DD/MM/YYYY HH:mm:ss")
    //                 const temp2 = moment(endTime, "DD/MM/YYYY HH:mm:ss")

    //                 if (temp1<=temp2 && temp1>=temp){
    //                     let answer = keys['answer'].trim().toUpperCase()
    //                     let email = keys['userName']
    //                     let ID = keys['userID']
    //                     let name = keys['name']===undefined? "N/A": keys["name"]
    //                     const val={"Name":name,"Email":email,"Answer":answer}
    //                     if (vlist.includes(ID)){
    //                     a[ID]=val
    //                     b.push(ID)
    //                     }
    //                 }
    //             })
    //             ans = a
    //             attempted = b
    //         })

    //     let final = null
    //     await database()
    //         .ref('InternalDb/Student/')
    //         .once('value')
    //         .then(snapshot => {
    //             const list = []
    //             snapshot.forEach( (data) => {
    //                 const x = data.key
    //                 const keys = Object(data.val())
    //                 if (vlist.includes(x)){
    //                     if (attempted.includes(x)){
    //                         list.push(ans[x])
    //                     }
    //                     else
    //                     {
    //                         let name = keys['name']
    //                         let email = keys['email']
    //                         let answer = "N/A"
    //                         const val={"Name":name,"Email":email,"Answer":answer}
    //                         list.push(val)
    //                     }

    //                 }
    //             })
    //             final = list
    //         })
    
    //     return final
    // }

    getAllMcqResponse = async (passCode, startTime, endTime)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                const list = {'A':0,'B':0,'C':0,'D':0}
                snapshot.forEach( (data) => {
                    const keys = Object(data.val())
                    const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
                    const temp1 = moment(keys["timestamp"], "DD/MM/YYYY HH:mm:ss")
                    const temp2 = moment(endTime, "DD/MM/YYYY HH:mm:ss")

                    if (temp1<=temp2 && temp1>=temp){
                        list[keys["answer"]] += 1
                    }
                })
                ans = list
            })
        return ans
    }

    getAllNumericalResponse = async (passCode, startTime, endTime)=> {
        let ans = null
        await this.reference
            .orderByChild("passCode")
            .equalTo(passCode)
            .once('value')
            .then(snapshot => {
                const dict = {}
                snapshot.forEach( (data) => {
                    const keys = Object(data.val())
                    const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
                    const temp1 = moment(keys["timestamp"], "DD/MM/YYYY HH:mm:ss")
                    const temp2 = moment(endTime, "DD/MM/YYYY HH:mm:ss")

                    if (temp1<=temp2 && temp1>=temp){
                        let answer = keys["answer"].trim().toUpperCase().replace(/,/g,"")
                        console.log(answer)
                        if(answer in dict){
                            dict[answer]+=1
                        }
                        else{
                            dict[answer] = 1
                        }
                    }
                })
                ans = dict
            })
        return ans
    }


}


export default QuizResponses;
