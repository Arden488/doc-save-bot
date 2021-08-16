import { promises as fs, createReadStream } from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import util from "util";
import got from "got";

const __dirname = path.resolve();
const TOKEN_PATH = "token.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

let oAuth2Client = null;

async function saveFileToDrive(fileUrl) {
  const fileId = await addRemoteFile(fileUrl);
  return fileId;
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
async function authorize() {
  const credentialsFileRead = await fs
    .readFile("credentials.json")
    .catch((err) => console.error("Failed to read credentials file", err));
  const credentials = JSON.parse(credentialsFileRead.toString());

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
  } else {
    await getAccessToken();
  }

  return oAuth2Client !== null;
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

  var folderId = process.env.GDRIVE_UPLOAD_FOLDER;
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

export { saveFileToDrive, authorize };
