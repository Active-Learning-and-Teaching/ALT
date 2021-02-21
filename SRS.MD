# Software Requirements Specification

## Purpose

This document specifies the software requirements for the upgrade of TLS app developed by Mr Suraj Kumar and Ms Dewangee Agrawal. 
The project is sponsored by Dr Pankaj Jalote. The intended audience of this document includes the project team, mentors, and the sponsor.

## Overview of TLS :iphone:

The TLS app is developed to enhance online teaching and learning. The application offers two categories of users:-

- **Faculty:** A faculty can create a course, which students can join by using a unique code. The faculty can then make announcements for the course, organise timed quizzes (Multiple Choice Single Correct/Multiple Choice Multi Correct/Alphanumeric) and schedule feedback forms.

- **Student:** A student can enrol in a course using the unique code. The student can then view announcements, attempt quizzes and respond to feedback questions.

The application currently follows a 2-tier architecture (client and server) with all the processing done on the client-side.
React Native has been used for the front-end and the database is in Firebase.
Faculty can choose to receive quiz and feedback responses by email.
No records of quiz and feedback are maintained to reduce storage requirements. 
All version updates are done manually.
Currently, the app is available for Android and iOS but the distribution of iOS has some issues.

## Scope of Project

The project aims to introduce enhancements to the TLS app.
The architecture and functionality need to be changed to make the app more general and usable for teaching by anyone across the world.
The new enhanced version of the app would be called Active Learning and Teaching App (ALT).
It would be an Open Source Software and made publically available for anyone to use.

## Functional Requirements :gear:

### High Priority :red_circle:

- **Architecture:** Shift from 2-tier architecture to 3-tier architecture. Integrate cloud functions with Firebase for the same.

- **iOS Release:** Upgrade libraries and fix bugs (if any) to release the app for iOS 14.

- **Feedback:** Provide the capability to the faculty to host feedback form with a variable number of questions.
Faculty can choose the type of response as either numeric (Likert scale from 1 to 5) or colour labels (red, yellow, green). 
The responses should be kept anonymous and only the overall average/pie chart should be mailed to the faculty.

- **Account Deletion:** Provide the capability to delete accounts to both student and faculty. 
Deleting a faculty account should also delete all the courses owned by him/her.
Deleting a student account should remove him/her from all courses he/she signed up for.

### Medium Priority :yellow_circle:

- **Course Deletion:** Provide the capability to the faculty to delete any course owned by him/her. 
Deleting a course should remove it from accounts of all the students who signed up for the course. 
It should also delete all the data associated with the course from relevant tables.

- **Students List:** Faculty should be able to mark students as valid in the student list. 
Appropriate flag for the same is updated in the database. 
The grading is done only for valid students.
Also, provide the capability of locking of course to the faculty.

- **Autograding:** Currently, quiz responses are recorded and graded only for those who responded.
Eliminate this issue by also keeping track of students who have not answered and awarding them 0.

- **Immediate Mailing of Responses:** Currently emailing is done only when the faculty opens the app because the limitation is that the app should be opened in order to run the code.
In the new 3-tier architecture, use cloud functions to resolve this issue.

### Low Priority :green_circle:

- **Grading Alphanumeric Answers:** Grading is currently not there for alphanumeric answers. 
We aim to develop a natural language parser to support grading of alphanumeric answers.

- **Notifications:** Implement application push notifications for announcements, quizzes and minute papers. (only for Android)

- **Global Availability:** Currently, some users in Oman and Qatar face an issue with the quiz. Attempt to mitigate this issue.

- **Cancel Quiz/Feedback:** Provide capability to faculty to  cancel a quiz/feedback and inform the same to the students.

- **Minute Paper (Subject to Discussion):** The faculty should be able to post a short answer type of question to which students can respond with sentences/phrases.
Further details would be informed later.

## Design Constraints :clipboard: 
Following the design constraints of the TLS app, the storage requirements need to be kept minimal as before.
All libraries need to be upgraded to be compatible with the latest versions of iOS and Android. 
Each new feature implemented should be functional on both iOS and Android platforms.
Reduce the number of update rollouts and eliminate the need to download the app for every small change in the backend.

## Performance Requirements :chart_with_upwards_trend:
The system currently has a good response time in milliseconds as clients interact directly with firebase. 
The cloud functions might incur some added latency.

## External Interfaces :outbox_tray:
Any mobile device with Android 4.1 and above or iOS 10.0 and above can run the application. No specific hardware requirements.

## Acceptance Criteria :white_check_mark:
Make at least 2 releases of the app and fulfil the high and medium priority requirements.

## Summary of Meetings

### Meeting 1 :speech_balloon:
**Date:** 29th January 2021  
**Attendees:** Dr Pankaj Jalote, Suraj Kumar, Dewangee Agrawal   
**Duration:** 30min  
**Main Points of Discussion:** Scope of the project, Current state of TLS   
**Sponsor/Mentors spoke:** 20min  
**Team spoke:** 10min  

### Meeting 2 :speech_balloon:
**Date:** 6th February 2021  
**Attendees:** Suraj Kumar, Dewangee Agrawal   
**Duration:** 60min  
**Main Points of Discussion:** Detailed Requirements, Structure of Database,  Architecture, Hosting and current issues with TLS  
**Sponsor/Mentors spoke:** 45min  
**Team spoke:** 15min  

### SRS Review Meeting :open_book:
**Date:** 10th February 2021  
**Attendees:** Dr Pankaj Jalote  
**Duration:** 45min  
**Size of SRS:** 5 pages  
**Method of Review:** After submitting the first draft, the mentors reviewed it offline and suggested necessary changes. 
Certain elements of the SRS required further discussion with the sponsor. The SRS was presented to the sponsor and key issues were identified. 
Key issues identified: The requirements had to be prioritized as High, Medium and Low.

