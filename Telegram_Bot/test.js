const TelegramBot = require('node-telegram-bot-api');
// Replace this with your actual token
const token = '7820281886:AAF7HTMQ-4ICN3U-ecf9y3X8TQ-hKx-Vpxs';
// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });
console.log('Bot is up and running...');

// Listens for "/start" command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the bot! How can I assist you today?',chatId);
});

// Listens for "/help" command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Here are some commands you can use:\n/start - Start the bot\n/help - Get help');
});

// Echoes any text message sent to the bot
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore commands (already handled above)
  if (text.startsWith('/')) return;

  // Use backticks for template literals
  bot.sendMessage(chatId, "You said: ${text}");
});