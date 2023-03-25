```diff
!-Components
! |-Authentication
!   |-CheckUserLoggedIn.js
!   |-Login.js
!   |-RegisterUser.js
!   |-StudentOrFaculty.js

-Authentication 
  It is the folder in the component directory that consists of the backend functions and  frontend components required for handling authentication.
  The app utilizes Firebase authentication to log the user in using two methods: 
+ login via Username and Password
+ login via Google Authenticator
  Both of these methods will create a user data endpoint for authenticationonr the users section in the firebase authentication module.
  You will need a webclient ID for authentication with google that will be provided in the sign in methods for firebase authentication under the google web SDK Configuration.
   

-CheckUserLoggedIn.js
  This files cosnists of the functions that will be called when we want to check the status of the authentication. It first calls the 'logInUser' method which checks if the user is previously logged in and then navigates to the login page appropriately.

-Login.js
  This is the main login page of the application which contains the 'signInWithGoogle' and 'LoginUser' methods with appropriate ui components.
  If the User is not a previous registered individual they will be navigated to RegisterUser Page. 

-RegisterUser.js
  This Page utilizes the username and password provided by the user to create an endpoint for person using the firebase username and password authentication provider.

-StudentOrFaculty.js
  This Page is neccesary as it classifies the users into two categories that are substantial for understanding the design of the application:
+ Student and Faculty
  This information will later be utilised in order to navigated the user on different dashboard pages.

```