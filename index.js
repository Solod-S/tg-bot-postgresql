const TelegramBot = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const { sequelize } = require("./db");
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, PORT } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты отгадай!"
  );
  const randomNumber = Math.floor(Math.floor(Math.random() * 10));
  chats[chatId] = randomNumber;
  console.log(randomNumber);
  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

const start = async () => {
  try {
    // await sequelize.authenticate();
    // await sequelize.sync();
  } catch (error) {
    console.log(error.message, `ОШИБКА`);
  }
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
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Вы нажали ${data} и отгадали загаданую цифру`,
        againOptions
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
