import TelegramBot from "node-telegram-bot-api";

import handleCancel from "./handlers/cancel.js";
import handleError from "./handlers/error.js";
import handleSaveLast from "./handlers/saveLast.js";
import handleSavePrompt from "./handlers/savePrompt.js";
import handleSaveReply from "./handlers/saveReply.js";
import { handleScenario } from "./handlers/main.js";
import { isCommand, isCalledDirectlyWithReply } from "./utils/bot.js";
import { getData, setData } from "./services/appData.js";
import { getMessageType } from "./utils/message.js";

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", handleError);
bot.onText(/\/cancel/, (message) => handleCancel(message, bot));
bot.onText(/\/save_last/, handleSaveLast);
bot.onText(/\/save_prompt/, (message) => handleSavePrompt(message, bot));
bot.on("message", (message) => {
  if (isCommand(message)) return;
  const messageType = getMessageType(message);

  if (messageType === "link" || messageType === "file") {
    setData("lastMessage", message);
    if (isCalledDirectlyWithReply(message)) handleSaveReply(message);
  }

  handleScenario(message, bot);
});
