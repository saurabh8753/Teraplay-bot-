import { Telegraf } from "telegraf";
import fetch from "node-fetch";

// Uses BOT_TOKEN from environment variables.
// IMPORTANT: Do NOT commit your actual BOT_TOKEN to the repo. Use Vercel Environment Variables.
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply("🎬 Welcome to TeraPlay Bot!\nSend me any Terabox link to get a playable link.")
);

bot.on("text", async (ctx) => {
  const text = (ctx.message && ctx.message.text) ? ctx.message.text.trim() : "";
  if (!text || !text.startsWith("http")) {
    return ctx.reply("⚠️ Please send a valid Terabox or Telegram link (must start with http).");
  }

  const link = text;
  const apiUrl = `https://iteraplay.com/api/play.php?url=${encodeURIComponent(link)}&key=iTeraPlay2025`;

  try {
    // We will reply with the iTeraPlay player link and original link.
    const watchMarkup = `🎬 *Your Video is Ready!*\n\n▶️ [Watch Video](${apiUrl})\n📥 [Open in Terabox](${link})`;
    await ctx.reply(watchMarkup, { parse_mode: "Markdown", disable_web_page_preview: false });
  } catch (error) {
    console.error("Handler error:", error);
    await ctx.reply("⚠️ Error while processing your link. Please try again later.");
  }
});

// Vercel serverless handler
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body);
    } catch (err) {
      console.error("bot.handleUpdate error:", err);
    }
    return res.status(200).send("OK");
  }

  // GET requests - basic status page
  res.status(200).send("TeraPlay Bot running on Vercel. Use Telegram webhook to send updates.");
}
