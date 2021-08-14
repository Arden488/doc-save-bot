import { getData, setData } from "../services/appData.js";
import handleSaveLast from "./saveLast.js";
import handleSavePrompt from "./savePrompt.js";
import handleSaveReply from "./saveReply.js";

function handleScenario(message, bot) {
  const status = getData("status");

  console.log("handleScenario", status);

  switch (status) {
    case "SAVE_REPLY":
      handleSaveReply(message, bot);
      break;
    case "SAVE_PROMPT":
      handleSavePrompt(message, bot);
      break;
    case "SAVE_LAST":
      handleSaveLast(message, bot);
      break;
  }
}

export { handleScenario };
