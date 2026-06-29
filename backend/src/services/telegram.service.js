const axios = require("axios");

const sendTelegramMessage = async (chatId, message) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await axios.post(url, {
  chat_id: chatId,
  text: message,
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🌐 Open HackRadar",
          url: "https://yourwebsite.com"
        }
      ]
    ]
  }
});

    return response.data;
  } catch (error) {
    console.error(
      "Telegram Error:",
      error.response?.data || error.message
    );
  }
};

module.exports = {
  sendTelegramMessage,
};