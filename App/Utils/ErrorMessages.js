export default class ErrorMessages{

    getErrorMessage( code ){
        var errorDict = {
            'auth/email-already-exists': "Email-id already in use.",
            'auth/invalid-email' : "Please enter a valid email address.",
            'auth/invalid-password' : "Incorrect credentials.",
            'auth/user-not-found' : "Incorrect credentials.",
            'auth/wrong-password' : "Incorrect credentials.",
            'auth/weak-password' : "Password must be 6 or more characters long.",
            'auth/email-already-in-use' : "Email-id already in use.",
            'auth/unknown' : "Please try again later."
        }

        if (errorDict[code]) {
            return errorDict[code];
        }

        return "Please try again later.";
    }

}


