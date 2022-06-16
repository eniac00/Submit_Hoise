const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function fetch_google(c_id, c_sec, c_r, c_r_t, folder){
    const CLIENT_ID = c_id;
    const CLIENT_SECRET = c_sec;
    const REDIRECT_URI = c_r;
    const REFRESH_TOKEN = c_r_t;

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });

    const ID_OF_FOLDER = folder;
    var result = null;

    try{
        const response = await drive.files.list({
            pageSize: 150,
            q: `'${ ID_OF_FOLDER }' in parents and trashed=false`
        });

        if(response && response.data && response.data.files){
            result = response.data.files;
        }
    }catch(err){
        console.log(err);
    }

    return result;

}

module.exports = fetch_google;





