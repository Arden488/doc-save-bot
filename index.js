import TelegramBot from "node-telegram-bot-api";

import handleCancel from "./handlers/cancel.js";
import handleError from "./handlers/error.js";
import handleSaveLast from "./handlers/saveLast.js";
import handleSavePrompt from "./handlers/saveLast.js";
import handleSaveReply from "./handlers/saveReply.js";
import { handleScenario } from "./handlers/main.js";
import { isCommand, isCalledDirectlyWithReply } from "./utils/bot.js";

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", handleError);
bot.onText(/\/cancel/, handleCancel);
bot.onText(/\/save_last/, handleSaveLast);
bot.onText(/\/save_prompt/, handleSavePrompt);
bot.on("message", (message) => {
  if (isCommand(message)) return;
  if (isCalledDirectlyWithReply(message)) handleSaveReply(message);

  handleScenario(message);
});
