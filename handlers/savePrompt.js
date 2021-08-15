import { bot } from "../utils/bot.js";
import { getData, isAllDataSet, setData } from "../services/appData.js";
import { getMessageType } from "../utils/message.js";
import { processFile } from "./file.js";
import { handleSend } from "./send.js";

function start(message) {
  // TODO: check if another status is in progress
  setData("status", "SAVE_PROMPT");
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

  if (messageType === "file") {
    link = await processFile(message.document);
  } else if (messageType === "link") {
    link = message.text;
  }

  setData("link", link);

  bot.sendMessage(
    message.chat.id,
    "Спасибо, все ушло в базу👌🏻 Да прибудет с тобой понятность"
  );
  return true;
}

async function handleSavePrompt(message) {
  const step = getData("step");
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
        handleSend();
      }
      break;
  }
}

export default handleSavePrompt;
