import { logger } from "../log.js";
import { authorize } from "./index.js";

const auth = await authorize();

if (auth) {
  logger.log("info", "Successfully authorized");
} else {
  logger.log("info", "Something went wrong");
}
