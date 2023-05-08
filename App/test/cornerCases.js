/*
Test corner cases here
*/

const fetch = require('node-fetch');
var assert = require('assert');

createSpreadSheet = async () => {
  try {

      
        const response = await fetch(
          'https://sheets.googleapis.com/v4/spreadsheets',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ya29.a0AWY7Ckk9H5H63VldlQGl19Q-VZ_NUPNyuVpqjzzhibS41D3QTPIJLuozUbhzVnG1Rp6ab983GnxXLXjJRDFjaA9OvQTvx6R8kTpIgJV_L_j6d51edv_VdmtEtT7PLnfS9v-iAj16MSUhWMzep1d8G31edcdqnl13aCgYKAWESARASFQG1tDrpACF6dN22JIk8wGOSdQv-Lg0167`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              properties: {
                title: "Mocha Testing",
              },
            }),
          }
        );
        const data = await response.json();
        
        return 1;
      } catch (error) {
        console.log('Error:', error);
        return '';
      }
}


checkConnection = async () => {

  try{
    console.log("Same fucntion")
    const response = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/1EmtNNbqJBfhHK4j4-IvrBcDBj9BF2bbbPaJ8ns1r9Vo/values/Sheet1!A1:C1?valueInputOption=USER_ENTERED',
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ya29.a0AWY7Ckk9H5H63VldlQGl19Q-VZ_NUPNyuVpqjzzhibS41D3QTPIJLuozUbhzVnG1Rp6ab983GnxXLXjJRDFjaA9OvQTvx6R8kTpIgJV_L_j6d51edv_VdmtEtT7PLnfS9v-iAj16MSUhWMzep1d8G31edcdqnl13aCgYKAWESARASFQG1tDrpACF6dN22JIk8wGOSdQv-Lg0167`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "range":  "Sheet1!A1:C1",
              "majorDimension": "ROWS",
          "values": [[1,2,3]],
            }),
          }
        );
      const result = await response.json();
    console.log('Data added to Sheet:', result);
    return 0;
    
  }
  catch (error){
    console.log('Error:', error);
  Alert.alert('Error', "Network Error. Couldn't update sheet with marks. CSV file will be mailed instead");
  }
}


emptyAppendData = async () => {

  try{
    
    const response = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/1EmtNNbqJBfhHK4j4-IvrBcDBj9BF2bbbPaJ8ns1r9Vo/values/Sheet1!A1:A1?valueInputOption=USER_ENTERED',
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ya29.a0AWY7Ckk9H5H63VldlQGl19Q-VZ_NUPNyuVpqjzzhibS41D3QTPIJLuozUbhzVnG1Rp6ab983GnxXLXjJRDFjaA9OvQTvx6R8kTpIgJV_L_j6d51edv_VdmtEtT7PLnfS9v-iAj16MSUhWMzep1d8G31edcdqnl13aCgYKAWESARASFQG1tDrpACF6dN22JIk8wGOSdQv-Lg0167`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "range":  "Sheet1!A1:A1",
              "majorDimension": "ROWS",
          "values": [],
            }),
          }
        );
      const result = await response.json();
    console.log('Data added to Sheet:', result);
    return 0;
    
  }
  catch (error){
    console.log('Error:', error);
  Alert.alert('Error', "Network Error. Couldn't update sheet with marks. CSV file will be mailed instead");
  }
}


describe('OAuth', async function () {
    describe('#connectToGoogleSheetsAPI()', async function () {
      it('Return 0 if GoogleSheets Hook is working', async function () {
        assert.equal(await checkConnection(), 0);
      });
    });
  });

  
  describe('Append', async function () {
    describe('#checkEmptyAppend()', async function () {
      it('Return 0 if empty quiz data can be appended', async function () {
        assert.equal(await emptyAppendData(), 0);
      });
    });
  });


  describe('Append', async function () {
    describe('#checkRepeatAppend()', async function () {
      it('Return 0 if redundant quiz data is entering', async function () {
        assert.equal(await checkConnection(), 0);
      });
    });
  });

  describe('Append', function () {
    describe('#checkMultipleAppend()', function () {
      it('Return 0 if multiple quiz data can be appended in their respective sheets', function () {
        assert.equal([1, 2, 3].indexOf(1), -1);
        // because of existing bug in the alt app that quizzes are only demarcated by their starting time, and nothing else.
      });
    });
  });



  describe('Append', async function () {
    describe('#checkAppendifPreviousEmpty()', async function () {
      it('Return 0 if previous quiz data is empty and data can still be appended',async function () {
        assert.equal(await emptyAppendData(), 0);
      });
    });
  });


