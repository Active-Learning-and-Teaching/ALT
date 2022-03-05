# Firebase cloud functions

Firebase cloud functions is a serverless framework that lets us run backend code in response to events by https requests. In this we use cloud funtions for features such as mailing, account deletion, notifications, etc. Run the following commands inside the functions folder.

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
npm install
```

5. Setup environment secrets. Right now environment secrets contain the email address, password and smtp provider.

```sh
firebase functions:config:set mailingsystem.host="Your smtp provider" mailingsystem.email="Your Email" mailingsystem.password="Your password"
firebase functions:config:get > .runtimeconfig.json
```

6. Test the functions locally (Comment out authentication)

```sh
npm run serve
npm start
```

7. Deploy the functions to firebase

```sh
npm run deploy
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
