

const TelegramBot = require("node-telegram-bot-api");
const sequelize = require("./database/sequelize");
const express = require("express");
const Movie = require("./models/Movie");
const router = require("./route/routers");
const Users = require("./models/Users");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

const app = express();

// ====================== EXPRESS CONFIG ======================
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(router);

// ====================== BOT CONFIG ======================
const TOKEN = "8249959313:AAFLYzg87jnQcTqlHTyfRLPQFpBRPvY6E_o";
const CHANNEL_ID = -1003242203360;
const admin = 7110194543;
const USERS_PAGE_SIZE = 10;
const PAGE_SIZE = 5;
const ITEMS_PER_PAGE = 10;

const bot = new TelegramBot(TOKEN, { polling: true });

// ====================== BOOTSTRAP ======================
const bootstrap = async () => {
  await sequelize.authenticate({ logging: false });
  await sequelize.sync({ alter: true, logging: false });
  app.listen(8000, () => console.log(`Server listening on 8000`));
};

bootstrap();

// ====================== HELPERS ======================
function parseCaption(caption) {
  const data = { film: null, janr: null, yil: null };
  if (!caption) return data;

  caption.split("\n").forEach(line => {
    line = line.trim();
    if (line.toLowerCase().startsWith("film:")) data.film = line.split(":")[1]?.trim();
    if (line.toLowerCase().startsWith("janr:")) data.janr = line.split(":")[1]?.trim();
    if (line.toLowerCase().startsWith("yil:")) data.yil = line.split(":")[1]?.trim();
  });

  return data;
}

// ====================== USER MENU ======================
const userMenus = {};
function sendMoviePage(chatId, movies, pageIndex, messageId = null) {
  const start = pageIndex * PAGE_SIZE;
  const pageMovies = movies.slice(start, start + PAGE_SIZE);

  // Inline keyboard
  const keyboard = pageMovies.map((m, i) => [{
    text: `🎬${m.film} | 📌${m.janr} | 📅${m.yil}`,
    callback_data: `movie:${start + i}`
  }]);

  const totalPages = Math.ceil(movies.length / PAGE_SIZE);
  const navButtons = [];
  if (pageIndex > 0) navButtons.push({ text: "⏮ Предыдущая", callback_data: `page:${pageIndex - 1}` });
  if (pageIndex < totalPages - 1) navButtons.push({ text: "⏭ Следующая", callback_data: `page:${pageIndex + 1}` });
  if (navButtons.length) keyboard.push(navButtons);

  const text = `🎬 Список фильмов\nСтраница: ${pageIndex + 1}/${totalPages}`;

  const options = { chat_id: chatId, reply_markup: { inline_keyboard: keyboard } };
  if (messageId) options.message_id = messageId;

  if (messageId) bot.editMessageText(text, options);
  else bot.sendMessage(chatId, text, options);
}

// callback_query ichida
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const [action, value] = query.data.split(":");

  try {
    const movies = await Movie.findAll({ order: [["film", "ASC"]] });

    if (action === "page") {
      sendMoviePage(chatId, movies, parseInt(value), messageId);
    }

    if (action === "movie") {
      const movie = movies[parseInt(value)];
      if (!movie) return;

      const info = `🎬 Фильм: ${movie.film}\n📌 Жанр: ${movie.janr}\n📅 Год: ${movie.yil}`;
      if (movie.file_id) {
        if (movie.type === "video") bot.sendVideo(chatId, movie.file_id, { caption: info });
        else if (movie.type === "document") bot.sendDocument(chatId, movie.file_id, { caption: info });
        else if (movie.type === "animation") bot.sendAnimation(chatId, movie.file_id, { caption: info });
      } else {
        bot.copyMessage(chatId, CHANNEL_ID, movie.message_id);
      }
    }

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Произошла ошибка.");
  }

  bot.answerCallbackQuery(query.id);
});

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match?.[1];

  const keyboard = { reply_markup: { keyboard: [["🎬 Жанры", "📅 Год"]], resize_keyboard: true } };

  await Users.findOrCreate({
    where: { chatId },
    defaults: { username: msg.chat.username || null, firstName: msg.chat.first_name || null, lastName: msg.chat.last_name || null }
  });

  // Film nomi kiritilgan bo‘lsa qidirish
  if (text) {
    try {
      const movie = await Movie.findOne({ where: { film: text } });
      if (movie) {
        const info = `🎬 Фильм: ${movie.film}\n📌 Жанр: ${movie.janr}\n📅 Год: ${movie.yil}`;
        if (movie.type === "video") await bot.sendVideo(chatId, movie.file_id, { caption: info });
        else if (movie.type === "document") await bot.sendDocument(chatId, movie.file_id, { caption: info });
        else if (movie.type === "animation") await bot.sendAnimation(chatId, movie.file_id, { caption: info });
        else await bot.copyMessage(chatId, CHANNEL_ID, movie.message_id);
      } else {
        await bot.sendMessage(chatId, "❌ Фильм не найден.", keyboard);
      }
    } catch (err) { console.error(err); await bot.sendMessage(chatId, "Произошла ошибка."); }
  } else {
    await bot.sendMessage(chatId, "Напишите название любого фильма или воспользуйтесь кнопками, чтобы посмотреть список фильмов по жанру или году.", keyboard);
  }
});

// ====================== CHANNEL POST (FILM & THUMB) ======================
let lastMovieId = null;
bot.on("channel_post", async (msg) => {
  try {
    // 📸 Thumbnail
    if (msg.photo) {
      if (!lastMovieId) return console.log("❌ Film hali yozilmagan!");
      const photo = msg.photo[msg.photo.length - 1];
      const fileRes = await axios.get(`https://api.telegram.org/bot${TOKEN}/getFile?file_id=${photo.file_id}`);
      const file_path = fileRes.data.result.file_path;
      const url = `https://api.telegram.org/file/bot${TOKEN}/${file_path}`;
      const filename = `${Date.now()}-${photo.file_unique_id}.jpg`;
      const savePath = path.join(__dirname, "uploads", filename);
      const response = await axios({ url, method: "GET", responseType: "stream" });
      await new Promise((resolve, reject) => {
        const stream = response.data.pipe(fs.createWriteStream(savePath));
        stream.on("finish", resolve);
        stream.on("error", reject);
      });
      const localUrl = `http://13.60.191.29/uploads/${filename}`;
      await Movie.update({ thumb_url: localUrl }, { where: { id: lastMovieId } });
      console.log("📸 Thumbnail saqlandi:", localUrl);
      lastMovieId = null;
      return;
    }

    // 🎬 Film
    let file_id = null, type = null;
    if (msg.video) { type = "video"; file_id = msg.video.file_id; }
    else if (msg.document) { type = "document"; file_id = msg.document.file_id; }
    else if (msg.animation) { type = "animation"; file_id = msg.animation.file_id; }
    else return;

    const { film, janr, yil } = parseCaption(msg.caption || "");
    if (!film) return console.log("❌ Film nomi topilmadi!");

    const movie = await Movie.create({ film, janr, yil, message_id: msg.message_id, file_id, type, thumb_url: null });
    lastMovieId = movie.id;
    console.log("🎬 Film saqlandi (thumbnail keyin qo‘shiladi):", film);
  } catch (err) { console.error("❌ Xatolik:", err); }
});

// ====================== GEN USERS PAGE ======================
bot.onText(/\/users/, async (msg) => { if (msg.chat.id === admin) sendUsersPage(msg.chat.id, 0); });

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  // USERS PAGE
  if (data.startsWith("users_page:")) {
    const pageIndex = parseInt(data.split(":")[1]);
    sendUsersPage(chatId, pageIndex, messageId);
    return bot.answerCallbackQuery(query.id);
  }

  // JANR/YIL FILM PAGINATION handled below
});

// Users page function
async function sendUsersPage(chatId, pageIndex, messageId = null) {
  const { count, rows } = await Users.findAndCountAll({ order: [["id", "ASC"]], offset: pageIndex * USERS_PAGE_SIZE, limit: USERS_PAGE_SIZE });
  const totalPages = Math.ceil(count / USERS_PAGE_SIZE);

  let text = `👥 *Foydalanuvchilar ro‘yxati*\nJami: *${count} ta*\nSahifa: *${pageIndex + 1}/${totalPages}*\n\n`;
  rows.forEach((u,i) => { text += `*${pageIndex*USERS_PAGE_SIZE + i + 1}.* ID: \`${u.chatId}\`\n${u.firstName?`👤 ${u.firstName}\n`:''}${u.username?`📛 @${u.username}\n`:''}--------------------------\n`; });

  const nav = [];
  if (pageIndex > 0) nav.push({ text: "⏮ Oldingi", callback_data: `users_page:${pageIndex - 1}` });
  if (pageIndex < totalPages - 1) nav.push({ text: "⏭ Keyingi", callback_data: `users_page:${pageIndex + 1}` });

  const markup = { reply_markup: { inline_keyboard: nav.length ? [nav] : [] }, parse_mode: "Markdown" };
  if (messageId) bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...markup });
  else bot.sendMessage(chatId, text, markup);
}

// ====================== PHOTO BROADCAST ======================
bot.on("photo", async (msg) => {
  if (msg.chat.id !== admin) return;
  const photo = msg.photo[msg.photo.length - 1].file_id;
  const caption = msg.caption || "";
  const users = await Users.findAll();
  users.forEach(async (user) => {
    try { await bot.sendPhoto(user.chatId, photo, { caption }); } 
    catch (e) { console.log("Xato:", user.chatId, e.message); }
  });
  bot.sendMessage(admin, "Hamma userlarga yuborildi!");
});

// ====================== FILM INLINE PAGINATION ======================
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "🎬 Жанры") {
    const janrlar = await Movie.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('janr')), 'janr']] });
    const inlineKeyboard = janrlar.map(j => j.janr).filter(Boolean).map(j => [{ text: j, callback_data: `JANR_${j}_1` }]);
    return bot.sendMessage(chatId, "Выберите жанр:", { reply_markup: { inline_keyboard: inlineKeyboard } });
  }

  if (text === "📅 Год") {
    const yillar = await Movie.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('yil')), 'yil']] });
    const inlineKeyboard = yillar.map(y => y.yil).filter(Boolean).map(y => [{ text: y, callback_data: `YIL_${y}_1` }]);
    return bot.sendMessage(chatId, "Выберите год:", { reply_markup: { inline_keyboard: inlineKeyboard } });
  }

  // Oddiy matn qidiruvi
  if (text && !text.startsWith("/")) {
    try {
      const movie = await Movie.findOne({ where: { film: text } });
      if (!movie) return bot.sendMessage(chatId, "❌ Фильм не найден.");
      const info = `🎬 Фильм: ${movie.film}\n📌 Жанр: ${movie.janr}\n📅 Год: ${movie.yil}`;
      if (movie.file_id) {
        if (movie.type === "video") bot.sendVideo(chatId, movie.file_id, { caption: info });
        else if (movie.type === "document") bot.sendDocument(chatId, movie.file_id, { caption: info });
        else if (movie.type === "animation") bot.sendAnimation(chatId, movie.file_id, { caption: info });
      } else bot.copyMessage(chatId, CHANNEL_ID, movie.message_id);
    } catch (err) { console.error(err); bot.sendMessage(chatId, "Произошла ошибка."); }
  }
});

// ====================== CALLBACK QUERY FILM / JANR / YIL ======================
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  // JANR/YIL PAGINATION
  if (data.startsWith("JANR_") || data.startsWith("YIL_")) {
    const isJanr = data.startsWith("JANR_");
    const parts = data.split("_");
    const value = parts[1];
    const pageNum = Math.max(1, parseInt(parts[2] || "1"));

    const where = isJanr ? { janr: value } : { yil: value };
    const films = await Movie.findAll({ where });
    if (!films.length) {
      return bot.editMessageText(`❌ ${value} Фильмов по выбранному критерию не найдено.`, { chat_id: chatId, message_id: messageId });
    }

    const totalPages = Math.ceil(films.length / ITEMS_PER_PAGE);
    const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
    const currentItems = films.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Inline keyboard yaratish (har bir film tugma)
    const filmButtons = currentItems.map(f => [{
      text: f.film,
      callback_data: `FILM_${f.id}`
    }]);

    // Sahifa tugmalari
    const nav = [];
    if (pageNum > 1) nav.push({ text: "⬅️ Предыдущая", callback_data: `${isJanr?"JANR":"YIL"}_${value}_${pageNum-1}` });
    if (pageNum < totalPages) nav.push({ text: "Следующая ➡️", callback_data: `${isJanr?"JANR":"YIL"}_${value}_${pageNum+1}` });
    if (nav.length) filmButtons.push(nav); // paginationni oxirgi qatorga qo‘shish

    const text = `🎬 ${isJanr ? value + " в жанре" : value + " в годе"} фильмы (страница ${pageNum}/${totalPages}):`;
    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: filmButtons }
    });

    return bot.answerCallbackQuery(query.id);
  }

  // FILM BOSILSA
  if (data.startsWith("FILM_")) {
    const filmId = data.replace("FILM_", "");
    const film = await Movie.findByPk(filmId);
    if (!film) return bot.answerCallbackQuery(query.id, { text: "Фильм не найден." });

    const caption = `🎬 Фильм: ${film.film}\n📅 Год: ${film.yil}\n📌 Жанр: ${film.janr}`;
    if (film.file_id) {
      if (film.type === "video") await bot.sendVideo(chatId, film.file_id, { caption });
      else if (film.type === "document") await bot.sendDocument(chatId, film.file_id, { caption });
      else if (film.type === "animation") await bot.sendAnimation(chatId, film.file_id, { caption });
    } else {
      await bot.copyMessage(chatId, CHANNEL_ID, film.message_id);
    }

    return bot.answerCallbackQuery(query.id);
  }
});

