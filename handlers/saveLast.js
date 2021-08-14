import { getData, setData } from "../services/appData.js";

export default function handleSaveLast(message) {
  if (getData("status") === null) {
    setData("status", "SAVE_LAST");
  }

  console.log("handleSaveLast");
}
