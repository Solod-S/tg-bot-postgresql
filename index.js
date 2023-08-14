const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, PORT } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

const chats = {};

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "0", callback_data: "0" },
        { text: "1", callback_data: "1" },
        { text: "2", callback_data: "2" },
      ],
      [
        { text: "3", callback_data: "3" },
        { text: "4", callback_data: "4" },
        { text: "5", callback_data: "5" },
      ],
      [
        { text: "6", callback_data: "6" },
        { text: "7", callback_data: "7" },
        { text: "8", callback_data: "8" },
      ],
      [{ text: "9", callback_data: "9" }],
    ],
  }),
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text == "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/thumb-animated-128.mp4"
      );
      return bot.sendMessage(chatId, `Привет ${msg.from.first_name} `);
    }

    if (text == "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }

    if (text === "/game") {
      await bot.sendMessage(
        chatId,
        "Сейчас я загадаю цифру от 0 до 9, а ты отгадай!"
      );
      const randomNumber = Math.floor(Math.floor(Math.random() * 10));
      chats[chatId] = randomNumber;
      console.log(randomNumber);
      return bot.sendMessage(chatId, "Отгадай", gameOptions);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    console.log(data, chats[chatId]);
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Вы нажали ${data} и отгадали загаданую цифру`
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Вы нажали ${data} и не отгадали загаданую цифру ${chats[chatId]}`
      );
    }
  });
};

start();
