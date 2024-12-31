const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
// Replace this with your actual tokenzzzz
const token = '7820281886:AAF7HTMQ-4ICN3U-ecf9y3X8TQ-hKx-Vpxs';
// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });
console.log('Bot is up and running...');


bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id; // Extract chat ID
  const userId = match[1]; // Extract user ID from /start <userId>

  bot.sendMessage(chatId, 'Welcome to the bot! How can I assist you today?'+userId+chatId);

  try {
    // Send chat ID to your backend to link with the user
    await axios.post('https://localhost:7190/api/telegram/connect', {
      userId,
      chatId,
    });

    bot.sendMessage(chatId, 'Your account has been successfully linked to Telegram!');
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'Failed to link your account. Please try again.');
  }
});
