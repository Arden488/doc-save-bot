import { bot } from "../utils/bot.js";
import { resetData } from "../services/appData.js";

export default function handleCancel(message) {
  resetData();

  bot.sendMessage(message.chat.id, "Ок, всё сбрасываю");
}
