import { getMessageType } from "./utils/message.js";
import { bot, isCommand, isCalledDirectlyWithReply } from "./utils/bot.js";

import handleCancel from "./handlers/cancel.js";
import handleError from "./handlers/error.js";
import handleSaveLast from "./handlers/saveLast.js";
import handleSavePrompt from "./handlers/savePrompt.js";
import handleSaveReply from "./handlers/saveReply.js";
import { handleScenario } from "./handlers/main.js";
import { getData, setData } from "./services/appData.js";

bot.on("webhook_error", handleError);
bot.on("polling_error", handleError);
bot.onText(/\/cancel/, handleCancel);
bot.onText(/\/save_last/, handleSaveLast);
bot.onText(/\/save_prompt/, handleSavePrompt);
bot.on("message", (message) => {
  if (isCommand(message)) return;
  let targetMessage = message.reply_to_message || message;

  const messageType = getMessageType(targetMessage);

  if (messageType === "link" || messageType === "file") {
    if (isCalledDirectlyWithReply(message)) {
      handleSaveReply(targetMessage);
    } else {
      setData("lastMessage", targetMessage);
    }
  }

  handleScenario(targetMessage);
});
