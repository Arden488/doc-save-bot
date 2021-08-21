import bot from "../bot.js";
import {
  getAllData,
  getData,
  isAllDataSet,
  setData,
} from "../services/appData.js";
import { getMessageType } from "../utils/message.js";
import { processFile } from "./file.js";
import { handleSend } from "./send.js";
import { logger } from "../services/log.js";

function start(message) {
  // TODO: check if another status is in progress
  setData("status", "SAVE_ASK");
  bot.sendMessage(message.chat.id, "Опиши, что добавляешь");
  setData("step", 1);
}

function setDescription(message) {
  if (!message.text) {
    bot.sendMessage(
      message.chat.id,
      "Некорректное описание, нужен простой текст"
    );
    return;
  }

  setData("description", message.text);
  bot.sendMessage(
    message.chat.id,
    "Ок, теперь вставь ссылку или прикрепи файл"
  );

  setData("step", 2);
}

async function setFileOrLink(message) {
  const messageType = getMessageType(message);
  let link = null;

  if (messageType !== "file" && messageType !== "link") {
    bot.sendMessage(message.chat.id, "Мне нужен файл или ссылка");
    return false;
  }

  // TODO: DRY
  if (messageType === "file") {
    bot.sendMessage(message.chat.id, "Пробую загрузить файл...");
    link = await processFile(message.document);
    if (link) {
      bot.sendMessage(message.chat.id, "Файл загрузил!");
    }
  } else if (messageType === "link") {
    link = message.text;
  }

  setData("link", link);

  return true;
}

async function handleSavePrompt(message) {
  setData("user", [message.from.first_name, message.from.last_name].join(" "));
  const step = getData("step");

  logger.log("info", "Save Prompt handler", { data: message, step });

  switch (step) {
    case 0:
      start(message);
      break;
    case 1:
      setDescription(message);
      break;
    case 2:
      await setFileOrLink(message);
      if (isAllDataSet()) {
        logger.log("info", "Saving data", { message, appData: getAllData() });
        handleSend(message.chat.id);
      }
      break;
  }
}

export default handleSavePrompt;
