/*
Test data validity here - 
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
        console.log('Spreadsheet created:', data);
        return 1;
      } catch (error) {
        console.log('Error:', error);
        return '';
      }
}


appendData = async () => {

  try{
    
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
          "values": ['A','B','C'],
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


describe('SheetsAPI', async function () {
  describe('#createSheet()', async function () {
    it('should return 1 if new Sheet can be created', async function () {
       assert.equal(await createSpreadSheet(), 1);
    });
  });
});

describe('Append', async function () {
  describe('#multipleResponses()',async function () {
    it('should return 0 when the last response of student is taken', async function () {
      assert.equal(await appendData(), 0);
    });
  });
});


