import { authorize, saveFileToDrive } from "../services/gdrive/index.js";
import { bot } from "../utils/bot.js";

async function processFile(document) {
  const fileTmpLink = await bot.getFileLink(document.file_id);

  const auth = await authorize();

  if (auth) {
    const filePersistentLink = await saveFileToDrive(fileTmpLink);
    return filePersistentLink.webContentLink;
  }

  return false;
}

export { processFile };
