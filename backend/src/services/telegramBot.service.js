const TelegramBot = require("node-telegram-bot-api");

const User = require("../models/User");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `
👋 Welcome to HackRadar!

To connect Telegram with your account,

1️⃣ Login to HackRadar

2️⃣ Click "Connect Telegram"

3️⃣ Copy the generated code

4️⃣ Send here

/verify YOUR_CODE
`
  );
});

bot.onText(/\/verify (.+)/, async (msg, match) => {
  try {
    const code = match[1].trim();

    const user = await User.findOne({
      telegramVerificationCode: code,
    });

    if (!user) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Invalid verification code."
      );
    }

    if (
      !user.telegramVerificationExpires ||
      user.telegramVerificationExpires < new Date()
    ) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Verification code expired."
      );
    }

    user.telegramChatId = msg.chat.id.toString();

    user.telegramVerified = true;

    user.telegramVerificationCode = "";

    user.telegramVerificationExpires = null;

    await user.save();

    bot.sendMessage(
      msg.chat.id,
      "✅ Telegram connected successfully with HackRadar!"
    );
  } catch (err) {
    console.log(err);

    bot.sendMessage(
      msg.chat.id,
      "❌ Verification failed."
    );
  }
});

module.exports = bot;