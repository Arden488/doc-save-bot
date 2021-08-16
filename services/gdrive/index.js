import { promises as fs, createReadStream } from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import util from "util";
import got from "got";

const __dirname = path.resolve();
const TOKEN_PATH = path.join(__dirname, "services", "gdrive") + "/token.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

let oAuth2Client = null;

async function saveFileToDrive(fileUrl) {
  // If modifying these scopes, delete token.json.
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.

  // Load client secrets from a local file.
  const credentialsFileRead = await fs
    .readFile(path.join(__dirname, "services", "gdrive") + "/credentials.json")
    .catch((err) => console.error("Failed to read credentials file", err));
  const credentials = JSON.parse(credentialsFileRead.toString());
  await authorize(credentials);

  const fileId = await addRemoteFile(fileUrl);
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
  const { client_secret, client_id, redirect_uris } = credentials.web;
  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  const tokenFileRead = await fs.readFile(TOKEN_PATH).catch(async (err) => {
    console.log("No saved token");
  });

  if (tokenFileRead) {
    const token = JSON.parse(tokenFileRead.toString());
    // const token = tokenRead.res.data;
    await oAuth2Client.setCredentials(token);
    return;
  } else {
    await getAccessToken();
    return;
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// TODO: rewrite to async await
async function getAccessToken() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = util.promisify(rl.question).bind(rl);

  const authUrl = await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);

  const answer = await question("Enter the code from that page here: ");
  try {
    rl.close();
    return await processCodeasync(answer);
  } catch (err) {
    console.error("Incorrect token creation", err);
  }
}

async function processCodeasync(code) {
  const tokenRead = await oAuth2Client
    .getToken(code)
    .catch((err) => console.error("Error retrieving access token", err));

  // const token = JSON.parse(tokenRead.toString());
  const token = tokenRead.res.data;
  await oAuth2Client.setCredentials(token);

  const tokenFileWrite = await fs
    .writeFile(TOKEN_PATH, JSON.stringify(token))
    .catch((err) => console.error(err));
  if (tokenFileWrite) console.log("Token stored to", TOKEN_PATH);

  return true;
}

async function addRemoteFile(fileUrl) {
  const drive = google.drive({ version: "v3", auth: oAuth2Client });
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
  return generatePublicUrl(drive, file.data.id);
}

//create a public url
async function generatePublicUrl(drive, fileId) {
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
