```diff 
!-Components
! |-FeedBack
!   |-FeedBackFacultyPage.js
!   |-FeedBackForm.js
!   |-FeedBackHomePage.js
!   |-FeedBackResultsList.js
!   |-FeedBackStudentPage.js
!   |-StudentFeedbackCard.js

-FeedBack
  This folder consists of the methods and the ui components for the complete process of hosting a feedback by the faculty, the student response from and the feedback result page. Feedback hosted can be of three types:
+ Colour Scale
+ Linkert Scale
+ Minute Paper

-FeedBackFacultyPage.js
  This is the main component for the faculty version the feedback page.

  * If a feedback hosting is requested by the user then the 'FeedBackFacultyPage' renders the prompt to set the duration, type and appropriate details of the feedback once this process is initiated a new feedback instance is created in the database with the respective details.
  * If a feedback is in progress then the 'FeedBackFacultyPage' renders the popup declaring the same.
  * If a feedback is recently submitted by the students the result page is rendered that will showcase the submission details using piechart, etc.

-FeedBackForm.js
  This is the form popup for the feedback presented before the faculty for providing information such as the duration, type and appropriate details of the feedback.

-FeedBackHomePage.js
  This is the page for the feedback process it first checks the user type using the auth token and then renders 'FeedBackFacultyPage' or 'FeedBackStudentPage' accordingly.

-FeedBackResultsList.js
  After duration of the feedback this component gets the response data about the feedback from the databse and displays the result in the form of either a list of feedbacks or a piechart appropritely.

-FeedBackStudentPage.js
  This is the main component for the student version the feedback page. on loading it fetches the details of the feedback and creates a feedback instance.
  * If the student has responded to the feedback this page renders the 'no current feedback message'.
  * If the student has not yet responded to the feedback the a countdown along with the 'StudentFeedbackCard' with the appropriate feedback details is rendered.
  * This file also contains the submit feedback function which is called accordingly when the user submits the feedback

-StudentFeedbackCard.js
  This component contains the ui component for the student feedback required by the faculty, it will render a mcq based feedback or a slider based feedback form according to the feedback type provided by the faculty.

```