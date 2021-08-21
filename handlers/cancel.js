import bot from "../bot.js";
import { resetData } from "../services/appData.js";

export default function handleCancel(message) {
  resetData();

  logger.log("info", "Cancel handler", { data: message, step });
  bot.sendMessage(message.chat.id, "Ок, всё сбрасываю");
}
