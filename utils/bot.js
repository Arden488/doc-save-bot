import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN;
const config = { polling: process.env.NODE_ENV !== "production" };

const bot = new TelegramBot(token, config);

if (process.env.NODE_ENV === "production") {
  bot.setWebHook(process.env.PUBLIC_URL, {
    certificate: "../crt.pem", // Path to your crt.pem
  });
}

function isCommand(message) {
  return (
    message.entities && message.entities.some((e) => e.type === "bot_command")
  );
}

function isCalledDirectlyWithReply(message) {
  if (!message.text) return false;
  return /^@DocSaveTestBot+$/.exec(message.text.trim());
  // && msg.reply_to_message &&
  // checkIfLinkOrFile(msg.reply_to_message)
}

export { isCommand, isCalledDirectlyWithReply, bot };
