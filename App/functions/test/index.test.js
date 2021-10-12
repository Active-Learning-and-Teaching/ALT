const test = require('firebase-functions-test')({
  databaseURL: 'https://testfortls.firebaseio.com',
  projectId: 'testfortls',
}, 'service-testfortls.json');
// const test = require('firebase-functions-test')({
//   databaseURL: 'https://tls-op-default-rtdb.firebaseio.com',
//   projectId: 'tls-op',
// }, 'tls-op-firebase-adminsdk-dttop-548676ff42.json');
const admin = require('firebase-admin');

const chai = require('chai');
const assert = chai.assert;
describe('Cloud Functions Auth Tests', () => {
  let myFunctions;

  before(() => {
    // Require index.js and save the exports inside a namespace called myFunctions.
    // This includes our cloud functions, which can now be accessed at myFunctions.cloud
    // and myFunctions.addMessage
    myFunctions = require('../index');
  });

  after(() => {
    // Do cleanup tasks.
    test.cleanup();
  });

  describe('Allow only Authenticated users to use onCall Endpoints', () => {
    // Test Case: setting messages/11111/original to 'input' should cause 'INPUT' to be written to
    // messages/11111/uppercase
    it('mailingSystem should return 401 status code on not providing context', () => {
      const data = {
          'passCode': 'kuec7240',
          'type': 'Quiz'
      }
   
      const context = {}

      // Wrap the cloud function
      wrapped = test.wrap(myFunctions.mailingSystem);
            return wrapped(data,context)
      .then((result)=>{
      		assert.equal(result.code,401)
      })

    }).timeout(20000);
    it('deleteCourse should return 401 status code on not providing context', () => {
      const data = {
          'passCode': 'kuec7240',
      }
    
      const context = {}

      // Wrap the cloud function
      wrapped = test.wrap(myFunctions.deleteCourse);
            return wrapped(data,context)
      .then((result)=>{
      		assert.equal(result.code,401)
      })

    }).timeout(20000);
    it('deleteStudent should return 401 status code on not providing context', () => {
      const data = {
          'key': 'hash',
      }
    
      const context = {}

      // Wrap the cloud function
      wrapped = test.wrap(myFunctions.deleteStudent);
            return wrapped(data,context)
      .then((result)=>{
      		assert.equal(result.code,401)
      })

    }).timeout(20000);
    it('deleteFaculty should return 401 status code on not providing context', () => {
      const data = {
      'data':{'uid':"V9NdBqTHq6dAzs8EihxFAKfaXKs2",
      'key':'-Mlfzr4Lx6nX4y9Xm2Jq'}
      }
      const context = {}

      // Wrap the cloud function
      wrapped = test.wrap(myFunctions.deleteFaculty);
      // deleteFaculty is not Async, hence .then() cannot be used on it.
      // Simply checking result
      result = wrapped(data,context)
      assert.equal(result.code,401)

      
    }).timeout(20000);

  });


})








