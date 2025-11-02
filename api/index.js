import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = "https://api.telegram.org/bot" + BOT_TOKEN;

app.post("/", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message || !message.text) return res.sendStatus(200);

    const chatId = message.chat.id;
    const text = message.text.trim();

    if (text === "/start") {
      await sendMessage(chatId, "👋 Welcome to *TeraPlay Bot*!\n\nSend me any *Terabox link* to watch and earn ads revenue.", "Markdown");
      return res.sendStatus(200);
    }

    if (text.includes("terabox.com")) {
      const encoded = encodeURIComponent(text);
      const videoPage = `https://teraplay-bots.vercel.app/watch.html?url=${encoded}`;
      const reply = `🎬 *Your video is ready!*\n\n👉 [Watch Now](${videoPage})\n\n💰 Powered by Adsterra`;
      await sendMessage(chatId, reply, "Markdown");
    } else {
      await sendMessage(chatId, "❌ Please send a valid *Terabox* link.", "Markdown");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

async function sendMessage(chatId, text, parse_mode) {
  await fetch(`${BASE_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode }),
  });
}

export default app;
