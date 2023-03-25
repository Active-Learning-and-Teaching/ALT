```diff 
!-Components
! |-Announcement
!   |-Announcement.js
!   |-AnnouncementCard.js 
!   |-AnnouncementsAdd.js

-Announcement
  This folder contains the page and the components required for the announcements on a particular course stream which will be set by the faculty.

-Announcement.js
  This is the main page that a user encounters upon selecting a particular course on the application, the page first uses the course information to fetch all the announcements and then renders the page ui which can be divided into two view components in a single scroll view:
+ Course Title Card
  It is the components that will be shown on the header of every course page and the course code can be copied to clipboard upon pressing this component.
+ Announcemnets
  It is the view that will contain all the announcements in the form of 'AnnouncementCard' components.

-AnnouncementCard.js
  This is the announcements card component which contains all the information provided by the user, if the user operating is a faculty then on long press of the card an action sheet will be displayed for further actions like deletion of the announcement.

-AnnouncementAdd.js
  This components conists of the actions as well as the rendered ui of the add announcement form which requres the following input:
+ Title
+ Description

```