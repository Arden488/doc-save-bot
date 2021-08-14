import { getData, setData } from "../services/appData.js";

export default function handleCancel(message, bot) {
  console.log("cancel 1");
  setData("status", null);
  setData("step", 0);
  setData("description", null);
  setData("link", null);

  console.log("cancel 2");

  bot.sendMessage(message.chat.id, "Ок, всё сбрасываю");

  console.log("cancel 3");

  console.log("handleCancel");
}
