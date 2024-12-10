```diff 
!-Components
! |-DashBoard
!   |-CourseAdd.js
!   |-CourseCard.js 
!   |-FacultyDashboard.js
!   |-FormAddCourse.js
!   |-StudentAddCourseForm.js
!   |-StudentDashboard.js

-DashBoard
  This folder contains the components and page views of the 'Dashboard' section of the application which is the entry point form any user who uses the application it can be broadly distributed into two main types:
+ Faculty Dashboard
+ Student Dashboard
  This folder also contains the methods and screens to add course or join course forms which can be utilized by the professors or the students respectively.

-CourseAdd.js
  This file contains the popup that will be displayed when someone tries to join or add a course. 'FormAddCourse' or 'StudentAddCourseForm' will be triggered according to the user type displaying the appropriate form.

-CourseCard.js
  This file contains the component of the course card which gets the course information from the props sent by the calling function. It then utilizes the prop information to fetch data about the course from the databse and then populates the data points of the card component like image, title etc.

-FacultyDashboard.js
  The main dashboard component that a user of the faculty type encounters upon entering the application can be found here, This page first takes the user information from the authentication and according to that fetches the details of all the courses that have been added by the user and passes the course information to the 'CourseCard' components mapping the respective course cards on the dashboard screen.
  This file also contains the functionality corresponding to signout and deletion of the account.
+ It must be noted that deletion of an account or a course is a very resource heavy operation on the database.

-FormAddCourse.js
  This the component that provides the functionality as well as the rendered pop up required for the formation of a new course by the faculty.
  Each course consists of the following
+ Course Name 
+ Course Code 
+ Room Code 
  The faculty will be responsible for submission of these details via this form.

-StudentAddCourseForm.js
  This the component that provides the functionality as well as the rendered pop up required for the joining of any course by the student.
  The student is required to submit the 'Course Code' in the form which shall be provided by the respective faculty.

-StudentDashboard.js
  This is the dashboard page for the students. This page takes the user information from the authentication and according to that fetches the details of all the courses that have been joined by the student and passes the course information to the 'CourseCard' components dor rendering the mapped cards onto the dashboard.
  This file also contains the functionality corresponding to signout, deletion of the account as well as unsubscribing from a particular course.

```