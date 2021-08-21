import bot from "../bot.js";
import { logger } from "../services/log.js";
import { resetData } from "../services/appData.js";

export default function handleCancel(message) {
  resetData();

  logger.log("info", "Cancel handler", { data: message });
  bot.sendMessage(message.chat.id, "Ок, всё сбрасываю");
}
