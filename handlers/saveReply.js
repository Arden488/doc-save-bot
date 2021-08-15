import { bot } from "../utils/bot.js";
import { getData, isAllDataSet, setData } from "../services/appData.js";
import { getMessageType } from "../utils/message.js";
import { processFile } from "./file.js";
import { handleSend } from "./send.js";

function start(message) {
  // TODO: check if another status is in progress
  setData("status", "SAVE_REPLY");
  bot.sendMessage(message.chat.id, "Опиши, что добавляешь");
  setData("step", 1);
}

async function setFileOrLink(message) {
  const messageType = getMessageType(message);
  let link = null;

  if (messageType !== "file" && messageType !== "link") {
    bot.sendMessage(message.chat.id, "Мне нужен файл или ссылка");
    return false;
  }

  if (messageType === "file") {
    link = await processFile(message.document);
  } else if (messageType === "link") {
    link = message.text;
  }

  setData("link", link);

  return true;
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
    "Спасибо, все ушло в базу👌🏻 Да прибудет с тобой понятность"
  );
}

async function handleSaveReply(message) {
  const step = getData("step");

  switch (step) {
    case 0:
      const isLinkSet = await setFileOrLink(message);
      if (isLinkSet) {
        start(message);
      }
      break;
    case 1:
      setDescription(message);
      if (isAllDataSet()) {
        handleSend();
      }
      break;
    case 2:
      break;
  }
}

export default handleSaveReply;
