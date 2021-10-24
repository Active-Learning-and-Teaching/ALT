# Firebase cloud functions

Firebase cloud functions is a serverless framework that lets us run backend code in response to events by https requests. In this we use cloud funtions for features such as mailing, account deletion, notifications, etc.

## Deploying functions

1. Install firebase-tools

```sh
npm install -g firebase-tools
```

2. Login to firebase

```sh
firebase login
```

3. Select the correct project

```sh
firebase use <Name of your project>
```

4. Install dependencies

```sh
cd App/functions
npm install
cd ../
```

5. Setup environment secrets. Right now environment secrets contain the email address, password and smtp provider.

```sh
firebase functions:config:set mailingsystem.host="Your smtp provider" mailingsystem.email="Your Email" mailingsystem.password="Your password"
```

6. Deploy the functions to firebase

```sh
firebase deploy --only:functions
```

## Indexing

It is important to add the following indexes to your database rules file, for effecient querying of data.

```json
{
    "rules":{
        "InternalDb":{
            "Announcements":{
                ".indexOn":["passCode"]
            },
            "Courses":{
                ".indexOn":["passCode"]
            },
            "Faculty":{
                ".indexOn":["email"]
            },
            "Feedback":{
                ".indexOn":["passCode"]
            },
            "FeedbackResponse":{
                ".indexOn":["passCode", "userID", "userID_passCode"]
            },
            "KBC":{
                ".indexOn":["passCode"]
            },
            "KBCResponse":{
                ".indexOn":["passCode", "userID", "userID_passCode"]
            },
            "Student":{
                ".indexOn":["email"]
            },
        }
    }
}
```
