import handleSaveReply from "./handlers/saveReply.js";
import { handleScenario } from "./handlers/main.js";
import { getData, setData } from "./services/appData.js";
import handleSaveLast from "./saveLast.js";
import handleSavePrompt from "./savePrompt.js";
import handleSaveReply from "./saveReply.js";
import { getMessageType } from "./utils/message.js";
import { isCommand, isCalledDirectlyWithReply } from "./utils/bot.js";

function handleMain(message) {
  (message) => {
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
  };
}

function handleScenario(message) {
  const status = getData("status");

  switch (status) {
    case "SAVE_REPLY":
      handleSaveReply(message);
      break;
    case "SAVE_ASK":
      handleSavePrompt(message);
      break;
    case "SAVE_LAST":
      handleSaveLast(message);
      break;
  }
}

export { handleMain, handleScenario };
