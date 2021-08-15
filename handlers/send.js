import { bot } from "../utils/bot.js";
import { getData, resetData } from "../services/appData.js";
import { saveToNotion } from "../services/notion.js";

function handleSend(chatId) {
  const description = getData("description");
  const link = getData("link");

  if (saveToNotion({ description, link })) {
    bot.sendMessage(
      chatId,
      "Спасибо, все ушло в базу👌🏻 Да прибудет с тобой понятность"
    );
  } else {
    bot.sendMessage(
      chatId,
      "Произошла ошибка. Мы всё записали и скоро поправим. Приносим извинения за неудобства"
    );
  }

  resetData();
}

export { handleSend };
