const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { CREDENTIALS_PATH, SCOPES, TOKEN_PATH } = require('./Consts');

const getAccessToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          reject('Error retrieving access token');
        }
        oAuth2Client.setCredentials(token);

        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (e) => {
          if (e) return console.error(e);
          console.log('Token stored to', TOKEN_PATH);
        });

        console.log('- Google client authorization success.');
        resolve(oAuth2Client);
      });
    });
  });
};

const authorize = (credentials) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0],
  );

  try {
    const token = require(TOKEN_PATH);
    oAuth2Client.setCredentials(token);
    console.log('- Google client authorization success.');
    return oAuth2Client;
  } catch (e) {
    return getAccessToken(oAuth2Client);
  }
};

const getClient = async () => {
  try {
    const content = require(CREDENTIALS_PATH);
    return await authorize(content);
  } catch (err) {
    throw `Authorization Error: ${JSON.stringify(err)}`;
  }
};

module.exports = {
  getClient,
};
