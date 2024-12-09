import {statusCodes} from '@react-native-google-signin/google-signin';

export default class ErrorMessages {
  // Define the error dictionary as a class property
  private errorDict: Record<string, string> = {
    'auth/email-already-exists': 'Email-id already in use.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/invalid-password': 'Incorrect credentials.',
    'auth/user-not-found': 'Incorrect credentials.',
    'auth/wrong-password': 'Incorrect credentials.',
    'auth/weak-password': 'Password must be 6 or more characters long.',
    'auth/email-already-in-use': 'Email-id already in use.',
    'auth/unknown': 'Please try again later.',
  };

  // Method to get error message for authentication errors
  public getErrorMessage(code: string): string {
    if (this.errorDict[code]) {
      return this.errorDict[code];
    }
    console.log(code);
    return 'Please try again later.';
  }

  // Method to get error message for Google Sign-In errors
  public getGoogleSignInError(code: string): string {
    switch (code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return 'Login interrupted.';
      case statusCodes.IN_PROGRESS:
        return 'Signin already in progress.';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Play services not available or outdated.';
      default:
        console.log(code);
        return 'Please try again later.';
    }
  }
}
