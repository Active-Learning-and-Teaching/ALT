```diff 
!-Components
! |-Announcement
! |-Authentication
! |-DashBoard
! |-Feedback
! |-Navigation
! |-Quiz
! |-Settings
! |-StudentList

-Components
  This folder contains all the ui components and related functionality for all the pages of the application, this is the folder for the frontend interface of the application.

-Announcement
  This folder contains the page and the components required for handling the announcements on a particular course stream.

-Authentication
  It is the folder in the component directory that consists of the backend functions and  frontend components required for handling authentication.
  The app utilizes Firebase authentication to log the user in using two methods: 
+ login via Username and Password
+ login via Google Authenticator
  Both of these methods will create a user data endpoint for authenticationonr the users section in the firebase authentication module.
  You will need a webclient ID for authentication with google that will be provided in the sign in methods for firebase authentication under the google web SDK Configuration.

-DashBoard
  This folder contains the components and page views of the 'Dashboard' section of the application which is the entry point form any user who uses the application it can be broadly distributed into two main types:
+ Faculty Dashboard
+ Student Dashboard
  This folder also contains the methods and screens to add course or join course forms which can be utilized by the professors or the students respectively.

-FeedBack
  This folder consists of the methods and the ui components for the complete process of hosting a feedback by the faculty, the student response from and the feedback result page. Feedback hosted can be of three types:
+ Colour Scale
+ Linkert Scale
+ Minute Paper

-Navigation @rohan-dhar
-Quiz @rohan-dhar
-Settings @rohan-dhar
-StudentList @rohan-dhar
```