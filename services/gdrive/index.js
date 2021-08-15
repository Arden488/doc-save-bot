import { promises as fs, createReadStream } from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import got from "got";

const __dirname = path.resolve();

async function saveFileToDrive(fileUrl) {
  // If modifying these scopes, delete token.json.
  const SCOPES = ["https://www.googleapis.com/auth/drive"];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.

  // Load client secrets from a local file.
  const credentialsFileRead = await fs
    .readFile(path.join(__dirname, "services", "gdrive") + "/credentials.json")
    .catch((err) => console.error("Failed to read credentials file", err));
  const credentials = JSON.parse(credentialsFileRead.toString());
  const oAuth2Client = await authorize(credentials);

  const fileId = await addRemoteFile(oAuth2Client, fileUrl);
  return fileId;
  // (err, content) => {
  //   if (err) return console.log("Error loading client secret file:", err);
  //   // Authorize a client with credentials, then call the Google Drive API.
  //   authorize(JSON.parse(content), (auth) => addRemoteFile(auth, fileUrl));
  // };
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
  const TOKEN_PATH = path.join(__dirname, "services", "gdrive") + "/token.json";

  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  const tokenFileRead = await fs.readFile(TOKEN_PATH);
  // , (err, token) => {
  //   if (err) return getAccessToken(oAuth2Client, callback);
  //   oAuth2Client.setCredentials(JSON.parse(token));
  // callback(oAuth2Client);
  // });
  const token = JSON.parse(tokenFileRead.toString());

  if (token) {
    await oAuth2Client.setCredentials(token);
  } else {
    await getAccessToken(oAuth2Client);
  }

  return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// TODO: rewrite to async await
async function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function addRemoteFile(auth, fileUrl) {
  const drive = google.drive({ version: "v3", auth });
  // const fileUrl =
  //   "https://api.telegram.org/file/bot1897674501:AAFb19ULt0NrHVnaN_Wqi3YseAWgyBaSGOk/documents/file_1.docx";
  //   console.log(request(fileUrl).pipe(fs.createWriteStream("file_1.docx")));
  var folderId = "18dajzacJlBaVxyRxfr4xDjfUJsr5PH3l";
  var filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
  var fileMetadata = {
    name: filename,
    parents: [folderId],
  };
  var media = {
    // mimeType:
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    body: got.stream(fileUrl),
  };
  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });
  return generatePublicUrl(auth, file.data.id);
}

//create a public url
async function generatePublicUrl(auth, fileId) {
  const drive = google.drive({ version: "v3", auth });

  try {
    //change file permisions to public.
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    //obtain the webview and webcontent links
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    return result.data;
  } catch (error) {
    console.log(error.message);
  }
}

export { saveFileToDrive };
