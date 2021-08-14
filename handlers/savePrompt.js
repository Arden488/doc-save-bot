import { getData, setData } from "../services/appData.js";
import { getMessageType } from "../utils/message.js";
import { processFile } from "./file.js";
import { handleSend } from "./send.js";

let step = 0;

function start(message, bot) {
  console.log("start 1");
  setData("status", "SAVE_PROMPT");
  console.log("start 2");
  console.log(bot, message.chat.id);
  bot.sendMessage(message.chat.id, "Опиши, что добавляешь");
  console.log("start 3");
  setData("step", 1);
}

function setDescription(message, bot) {
  console.log("setDescription 0");
  if (!message.text) {
    bot.sendMessage(
      message.chat.id,
      "Некорректное описание, нужен простой текст"
    );
    return;
  }

  console.log("setDescription 1");
  setData("description", message.text);
  console.log("setDescription 2");
  console.log(bot, message);
  bot.sendMessage(
    message.chat.id,
    "Ок, теперь вставь ссылку или прикрепи файл"
  );
  console.log("setDescription 3");
  setData("step", 2);
}

async function setFileOrLink(message, bot) {
  const messageType = getMessageType(message);
  let link = null;

  console.log(messageType);

  if (messageType !== "file" && messageType !== "link") {
    bot.sendMessage(message.chat.id, "Мне нужен файл или ссылка");
    return;
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
}

function handleSavePrompt(message, bot) {
  const step = getData("step");
  console.log(step);
  switch (step) {
    case 0:
      start(message, bot);
      break;
    case 1:
      setDescription(message, bot);
      break;
    case 2:
      setFileOrLink(message, bot);
      handleSend();
      break;
  }

  console.log("handleSavePrompt");
}

export default handleSavePrompt;
