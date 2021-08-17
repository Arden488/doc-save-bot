import { authorize, saveFileToDrive } from "../services/gdrive/index.js";
import { logger } from "../services/log.js";
import { bot } from "../utils/bot.js";

async function processFile(document) {
  const fileTmpLink = await bot.getFileLink(document.file_id);

  const auth = await authorize();

  if (auth) {
    const filePersistentLink = await saveFileToDrive({
      file: document,
      link: fileTmpLink,
    });
    return filePersistentLink.webViewLink;
  }

  logger.log("error", "File is not saved to GDrive", { auth, document });

  return false;
}

export { processFile };
