const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { google } = require('googleapis');

const TOKEN = process.env.SHEETS_TOKEN;
const CREDENTIALS = JSON.parse(process.env.SHEETS_CRED);
const SPREADSHEET_ID = '1naQC7iEfnro5iOjTFEn7iPCxNMPaPa4YnIddjT5CTM8';
const RANGE = 'Usernames';
const PR_AUTHOR = context.payload.pull_request.user.login;
const PR_NUMBER = context.payload.pull_request.number;
const LINK_RESULT = (
  'https://github.com/oppia/oppia/wiki' +
  '/Contributing-code-to-Oppia#setting-things-up')

const octokit = new GitHub(process.env.GITHUB_TOKEN);
console.log(PR_NUMBER, PR_AUTHOR);
authorize(claCheck);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} CREDENTIALS The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  const { client_secret, client_id, redirect_uris } = CREDENTIALS.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(JSON.parse(TOKEN));
  callback(oAuth2Client);
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function claCheck(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    const flat_rows = [].concat.apply([], rows)
    if (rows.length) {
      console.log('Checking if ', PR_AUTHOR, ' has signed the CLA');
      const isSign = flat_rows.includes(PR_AUTHOR);
      if (!isSign) {
        core.setFailed(PR_AUTHOR + ' has not signed the CLA');
      }
    } else {
      console.log('No data found.');
    }
  });
}