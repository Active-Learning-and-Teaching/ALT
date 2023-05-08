import database from '@react-native-firebase/database';
import {
  GoogleSignin,
  } from '@react-native-community/google-signin';
  
   


    const  getClassData = async (courseCode,course) => {
        const ref =  database().ref('InternalDb/Student');
        const snapshot = await ref.once('value');
        const data = snapshot.val();
        const students = getClassStudents(data,courseCode);
        console.log(students, students.length,"Length of students in class ?");
        rowData =  addStudents(students);
        resp = await addStudentsToSheet(rowData,course);
    }

    const addStudentsToSheet = async (rowData,course) => {
      const rowLength = rowData.length + 1;
      const range = 'D' + rowLength;
      rowData.splice(0, 0, ["Name","Email","Marks Quiz 1","Total"]);
      return await addColumnData(rowData,range,course);
    }

    const addStudents =  (students) => {

        //column headers are in place
        //fetch quiz1 data, and put it respective fields
        // student might be in class but not have given quiz1 
        // name email marks total

        let appendData = []
        for (i = 0; i < students.length; i++){
          const row = [];
          const student = students[i];
          row.push(student["name"]);
          row.push(student["email"]);
          row.push(1);//marks of quiz1
          row.push(1);//marks of quiz1 as total;
          appendData.push(row);

        }
        return appendData;


    }

    const addColumnData = async (updatedData,range,course) => {
      //config data doesn't have range will have to add manually
      try{
         console.log(course.spreadsheetURL);
        const config = {
          url: 'https://sheets.googleapis.com/v4/spreadsheets/',
          spreadSheetId: course.spreadsheetURL,
          // spreadSheetId: '1lkZibUEGNiO-tvgRhD0XxK_uDLesG0FzM5CM19KNiH8',
          values: '/values/Sheet1!',
          range:'',
          protocol: '?valueInputOption=USER_ENTERED'
      }
      config.range = "A1:" + range;
      const tokens = await GoogleSignin.getTokens();
      const response = await fetch(
            config.url + config.spreadSheetId + config.values + config.range + config.protocol,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "range":  "Sheet1!A1:" + range,
                "majorDimension": "ROWS",
            "values": updatedData,
              }),
            }
          );
        const result = await response.json();
      console.log('Data added to Sheet:', result);
      return result;
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Network error.Could not add quizData to spreadSheet. Mailing csv file only.');
      return '';
    }
      

    }

  

    const getCourseCode = async (course) => {
      //Idea is to get the course code from firebase and then return it as string
        var answer = '';
        const coursesData = database().ref('InternalDb/Courses');
        const snapshot = await coursesData.once('value');
        const courses = snapshot.val();
        
        for (const [key, value] of Object.entries(courses)) {
            if (value["passCode"] == course["passCode"])
                return key;
          }

        return answer;

  }


  const getClassStudents = (data,course) => {
    //Idea is to get all the students that are anrolled in the course and return them in a list
    const students = [];
    for (const [key, value] of Object.entries(data)) {
        for (const [i,j] of Object.entries(value)){
          if (i.includes("courses"))
          {
                if (j.includes(course)) 
                    students.push(value);
          }
            
        }
      }
    return students;
}



export const handleQuiz1 = async (course) => {
    console.log("Came to debug for init");
    const courseCode = await getCourseCode(course);
    await getClassData(courseCode,course);
}


  
  