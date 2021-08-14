import { getData, setData } from "../services/appData.js";

export default function handleSaveReply(message) {
  if (getData("status") === null) {
    setData("status", "SAVE_REPLY");
  }

  console.log("handleSaveReply");
}
