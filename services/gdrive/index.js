import { promises as fs, createReadStream } from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import util from "util";
import got from "got";
import { logger } from "../log.js";

const __dirname = path.resolve();
const TOKEN_PATH = "token.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

let oAuth2Client = null;

async function saveFileToDrive(fileUrl) {
  logger.log("info", "Uploading file to drive", { fileUrl });
  const fileId = await addRemoteFile(fileUrl);
  return fileId;
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
async function authorize() {
  logger.log("info", "Google auth is requested");
  const credentialsFileRead = await fs
    .readFile("credentials.json")
    .catch((error) =>
      logger.log("oror", "Failed to read credentials file", { error })
    );
  const credentials = JSON.parse(credentialsFileRead.toString());

  const { client_secret, client_id, redirect_uris } = credentials.web;
  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  const tokenFileRead = await fs
    .readFile(TOKEN_PATH)
    .catch(async (error) =>
      logger.log("info", "No saved google token", { error })
    );

  if (tokenFileRead) {
    const token = JSON.parse(tokenFileRead.toString());
    // const token = tokenRead.res.data;
    await oAuth2Client.setCredentials(token);
  } else {
    logger.log("info", "Trying to get new token");
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
  } catch (error) {
    logger.log("error", "Incorrect token creation", { error });
  }
}

async function processCodeasync(code) {
  const tokenRead = await oAuth2Client
    .getToken(code)
    .catch((error) =>
      logger.log("error", "Error retrieving access token", { error })
    );

  // const token = JSON.parse(tokenRead.toString());
  const token = tokenRead.res.data;
  await oAuth2Client.setCredentials(token);

  const tokenFileWrite = await fs
    .writeFile(TOKEN_PATH, JSON.stringify(token))
    .catch((error) =>
      logger.log("error", "Error writing access token", { error })
    );
  if (tokenFileWrite)
    logger.log("info", "Token stored to", { path: TOKEN_PATH });

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
    logger.log("error", "Error getting public url", { error });
  }
}

export { saveFileToDrive, authorize };
