import { getData, setData } from "../services/appData.js";
import handleSaveLast from "./saveLast.js";
import handleSavePrompt from "./savePrompt.js";
import handleSaveReply from "./saveReply.js";

function handleScenario(message) {
  const status = getData("status");

  switch (status) {
    case "SAVE_REPLY":
      handleSaveReply(message);
      break;
    case "SAVE_PROMPT":
      handleSavePrompt(message);
      break;
    case "SAVE_LAST":
      handleSaveLast(message);
      break;
  }
}

export { handleScenario };
