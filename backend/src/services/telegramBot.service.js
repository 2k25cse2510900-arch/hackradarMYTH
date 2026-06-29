const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  console.log("Chat ID:", msg.chat.id);
console.log("User:", msg.from.username);

  bot.sendMessage(
    chatId,
    `👋 Welcome ${firstName}!

🚀 Welcome to HackRadar!

You will receive hackathon reminders here.

Now go to the HackRadar website and connect your Telegram account.

Happy Hacking! 💜`
  );
});

module.exports = bot;