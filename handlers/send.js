import { getData } from "../services/appData.js";

function handleSend() {
  const description = getData("description");
  const link = getData("link");

  console.log({ description, link });
}

export { handleSend };
