import { authorize } from "./index.js";

const auth = await authorize();

if (auth) {
  console.log("Successfully authorized");
} else {
  console.log("Something went wrong...");
}
