import bot from "../bot.js";
import { getData, resetData } from "../services/appData.js";
import { saveToNotion } from "../services/notion.js";

function handleSend(chatId) {
  const description = getData("description");
  const link = getData("link");
  const user = getData("user");

  if (saveToNotion({ description, link, user })) {
    bot.sendMessage(
      chatId,
      "Спасибо, все ушло в базу👌🏻 Да пребудет с тобой понятность"
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
