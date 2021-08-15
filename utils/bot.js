import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

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
