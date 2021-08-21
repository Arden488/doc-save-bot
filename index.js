import { serverStart } from "./server.js";
import bot from "./bot.js";

import handleCancel from "./handlers/cancel.js";
import handleError from "./handlers/error.js";
import handleSaveLast from "./handlers/saveLast.js";
import handleSavePrompt from "./handlers/savePrompt.js";
import { handleMain } from "./handlers/main.js";

bot.on("webhook_error", handleError);
bot.on("polling_error", handleError);
bot.onText(/\/cancel/, handleCancel);
bot.onText(/\/save_last/, handleSaveLast);
bot.onText(/\/save_ask/, handleSavePrompt);
bot.on("message", handleMain);

serverStart(bot);
