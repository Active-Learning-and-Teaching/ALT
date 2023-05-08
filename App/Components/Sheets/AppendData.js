import React from 'react';
import {  GoogleSignin,} from '@react-native-community/google-signin';
import database from '@react-native-firebase/database';
import { Alert } from 'react-native';



const getCourseCode = async (course) => {
  try {
    const coursesData = database().ref('InternalDb/Courses');
    const snapshot = await coursesData.once('value');
    const courses = snapshot.val();
    for (const [key, value] of Object.entries(courses)) {
      if (value["passCode"] === course["passCode"]) {
        console.log("Course Code returned", key);
        return key;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getResults = async (timeStamp,time,answer) => {
  
  const ref =  database().ref('InternalDb/KBCResponse');
  const snapshot = await ref.once('value');
  const responses = snapshot.val();
  const seconds  = convertDateToSeconds(timeStamp)
  const currentQuizData = filterCurrentQuizData(responses,timeStamp,seconds,time*60,answer);
  console.log(currentQuizData);  
  return currentQuizData;
}


const convertDateToSeconds = (timeStamp) => {
  
  
  const array = timeStamp.split(" ");
  console.log(timeStamp,array,"debug")
  const nums = array[1].split(":");
  time = 0;
  time += parseInt(nums[0]) * 3600
  time += parseInt(nums[1]) * 60
  time += parseInt(nums[2])
  return time;
}


const getCourseStudents = async (course) => {
  const ref =  database().ref('InternalDb/Student');
  const snapshot = await ref.once('value');
  const responses = snapshot.val();
  const courseCode = await getCourseCode(course);
  console.log(courseCode,"Course Code");
  const courseKids = []
  for (const [key, value] of Object.entries(responses)) {
    for (const [i,j] of Object.entries(value)){
      // console.log(i,j,"I and J");
        if (i === "courses" ){
          if (j.includes(courseCode)) courseKids.push(value);
        }
    }
  
  } 
  return courseKids;
}


const filterCurrentQuizData = (data,date,start,duration,answer) => {
  const newQuizResponses = []
  const day = date.split(" ")
  for (const [key, value] of Object.entries(data)) {
    for (const [i,j] of Object.entries(value)){
      if (i.includes("timestamp") && j.includes(day[0]))
      {
        
        const seconds = convertDateToSeconds(j);
        if (start <= seconds && start + duration >= seconds)
        newQuizResponses.push(value);
      }
        
    }
  }
  console.log(date,start,duration);
  const marksheet = []
  for (i = 0; i < newQuizResponses.length; i++){
    const student = newQuizResponses[i];
    var key = student["userName"];
    if (student["answer"] === answer) 
     marksheet.push({"key": student["userName"],"value":1}) ;
     else marksheet.push({"key": student["userName"],"value":0}) ;   
  }
  
  return marksheet; // return people who gave quiz
}

    
const calculateRange = (updatedData) => {
    const len = updatedData[0].length;
    const rows = updatedData.length;
    var chr = String.fromCharCode(64 + len); 
    return chr+rows;

}

const fillSheetForPreviousStudents = (sheetStudents,presentStudents,answer) => {
  var attendance = false;
  var returnVal = sheetStudents;
  for (i = 0; i < sheetStudents.length;i++){
    for (j = 0; j < presentStudents.length;j++){
      if (sheetStudents[i][1] === presentStudents[j]["key"])
      {
        attendance = true;
       
          returnVal[i].splice(returnVal[i].length-1,0,presentStudents[j]["value"])
          var total = returnVal[i][returnVal[i].length-1];
          returnVal[i].splice(returnVal[i].length-1,1,parseInt(total) + presentStudents[j]["value"]);

        
      }
    }
    if (attendance === false){
      returnVal[i].splice(returnVal[i].length-1,0,"Absent");
    }
    attendance = false;
  }

  return returnVal;
}

const getStudentsInSheet = (sheetData) => {
 
  const StudentsInSheetList = [];
  for (i = 1; i < sheetData.length;i++){
    StudentsInSheetList.push(sheetData[i]);    
  }

  return StudentsInSheetList;

}
  const manipulateData = async (sheetData,timeStamp,time,answer) => {
    
    const newQuizData = await getResults(timeStamp,time,answer);
    const studentsInGS = getStudentsInSheet(sheetData["values"]);
    return [studentsInGS,newQuizData];
    
  }  

  const appendData = async (course,timeStamp,time,answer) => {
    try {

      const config = {
        url: 'https://sheets.googleapis.com/v4/spreadsheets/',
        // spreadSheetId: '1lkZibUEGNiO-tvgRhD0XxK_uDLesG0FzM5CM19KNiH8',
        spreadSheetId: course.spreadsheetURL,
        values: '/values/Sheet1',
        range:'',
        protocol: '?valueInputOption=USER_ENTERED'
    }
    const tokens = await GoogleSignin.getTokens();
    
    console.log(tokens.accessToken);
    const readData = await fetch(
        
        config.url + config.spreadSheetId + config.values,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                'Content-Type':'application/json',
            }
        }
    );
      const sheetData = await readData.json();
      const arrayData = await manipulateData(sheetData,timeStamp,time,answer);
      return arrayData;
      
      
      
      // 
    } catch (error) {
      Alert.alert("Network Error. Couldn't update sheet with marks. CSV file will be mailed instead")
      console.log(error);
    }
  };

  const handlenewAdmissions = (courseStudents, presentStudents,sheetStudents,quizNumber,answer) => {
      var newAds = [];
      for (i = 0; i < courseStudents.length; i++){
        var newGuy = true;
        for (j = 0; j < sheetStudents.length; j++){
            if (courseStudents[i]["email"] === sheetStudents[j][1]) newGuy = false;
        }
        if (newGuy) newAds.push(courseStudents[i]);
        newGuy = true;
      }
      var returnData = [];
      for (i = 0; i < newAds.length; i++){
        var appendRow = [];
        appendRow.push(newAds[i]["name"]);
        appendRow.push(newAds[i]["email"]);
        var present = false;
        for (k = 0; k < quizNumber - 1; k++) appendRow.push("Absent");
        for (j = 0; j < presentStudents.length; j++){
          if (newAds[i]["email"] === presentStudents[j]["key"]){
            present = true;
            // if (presentStudents[j]["value"] === answer) {
            //   appendRow.push(1);
            //   appendRow.push(1);
            // }
            // else {
            //   appendRow.push(0);
            //   appendRow.push(0);
  
            // }
            appendRow.push(presentStudents[j]["value"])
            appendRow.push(presentStudents[j]["value"])
          }
         
        }

        if (present === false) {
             appendRow.push(0);
              appendRow.push(0);
        }
        returnData.push(appendRow);
        present = false;
      }
      return returnData;
  }


  const compileAndSendData = async (data1, data2,quizNumber,course) => {
    const config = {
      url: 'https://sheets.googleapis.com/v4/spreadsheets/',
      // spreadSheetId: '1lkZibUEGNiO-tvgRhD0XxK_uDLesG0FzM5CM19KNiH8',
      spreadSheetId: course.spreadsheetURL,
      values: '/values/Sheet1',
      range:'',
      protocol: '?valueInputOption=USER_ENTERED'
  }
      for (i = 0; i < data2.length;i++)
      data1.splice(data1.length,0,data2[i]);
      const headerRow = [];
      headerRow.push("Name");
      headerRow.push("Email");
      for (i = 0; i < quizNumber;i++){
        headerRow.push("Quiz " + (i+1) + " Marks");
      }
      headerRow.push("Total");
      data1.splice(0,0,headerRow);
      range = calculateRange(data1);
      try{
        config.range = "A1:" + range;
        const tokens = await GoogleSignin.getTokens();
        const response = await fetch(
              config.url + config.spreadSheetId + config.values + '!' + config.range + config.protocol,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "range":  "Sheet1!A1:" + range,
                  "majorDimension": "ROWS",
              "values": data1,
                }),
              }
            );
          const result = await response.json();
        console.log('Data added to Sheet:', result);
        
      }
      catch (error){
        console.log('Error:', error);
      Alert.alert('Error', "Network Error. Couldn't update sheet with marks. CSV file will be mailed instead");
      }

      
  }

  export const quizHandler = async (course,timeStamp,time,answer,quizNumber,type) => {
    console.log(timeStamp,time,answer,quizNumber);
    console.log("Get list of students in googlesheet and list of students in alt app");
    const studensInALT = await getCourseStudents(course);
    const arrayData = await appendData(course,timeStamp,time,answer);
    const studentsInGS = arrayData[0];
    const presentStudents = arrayData[1];
    console.log(studensInALT,studentsInGS,presentStudents, "This should be the last sentence");
    var data1 = fillSheetForPreviousStudents(studentsInGS,presentStudents,answer);
    var data2 = handlenewAdmissions(studensInALT,presentStudents,studentsInGS,quizNumber,answer);
    await compileAndSendData(data1,data2,quizNumber,course);
    
    
  }

  
