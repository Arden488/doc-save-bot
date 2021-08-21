import TelegramBot from "node-telegram-bot-api";

const TOKEN = process.env.TELEGRAM_TOKEN;
const URL = process.env.PUBLIC_URL;
const isProduction = process.env.NODE_ENV === "production";

const bot = new TelegramBot(TOKEN, { polling: !isProduction });

if (process.env.NODE_ENV === "production") {
  bot.setWebHook(`${URL}${TOKEN}`);
}

export default bot;
