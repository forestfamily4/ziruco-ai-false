import { Message } from "discord.js";
import { runAI } from "../ai/api";
import { Bot } from "../bot";
import {
  getCurrentMessageTimestamp,
  setCurrentMessageTimestamp,
} from "../lib/db";

export async function execMessageRegularly(message: Message, client: Bot) {
  if (message.channelId !== "959810627822575616") return;

  const timestamp = message.createdTimestamp;
  const currentTime = await getCurrentMessageTimestamp();
  if (Number.isNaN(currentTime)) {
    return;
  } else if (!(timestamp - currentTime >= 1000 * 60 * 60 * 12)) {
    return;
  }
  setCurrentMessageTimestamp(timestamp.toString());

  message.channel.sendTyping();

  const messages = (await message.channel.messages.fetch({ limit: 40 }))
    .filter((m) => m.author.id !== client.userId && !m.author.bot)
    .filter(
      (m) => message.createdTimestamp - m.createdTimestamp < 20 * 60 * 1000,
    )
    .reverse()
    .map((m) => ({
      username: m.author.username,
      content: m.content,
      timestamp: m.createdTimestamp,
    }));
  const data = await runAI(messages);
  const { content } = data;
  await message.channel.sendTyping();
  await new Promise((r) => setTimeout(r, 3000));
  if (content) {
    await message.channel.send(content);
  }
}
