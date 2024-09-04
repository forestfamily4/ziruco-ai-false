import { Message } from "discord.js";
import { Bot } from "../bot";
import { collection } from "../lib/db";
import { runAI } from "../ai/api";

export async function execMessageRegularly(message: Message, client: Bot) {
  if (message.channelId !== "959810627822575616") return;
  //最新時刻から20分以上経過していたら最新時刻を更新
  const timestamp = message.createdTimestamp;
  const currentTime = Number(
    (await collection.findOne({ key: "currentMessage" }))?.content,
  );
  if (Number.isNaN(currentTime)) {
    await collection.deleteMany({ key: "currentMessage" });
    return collection.insertOne({
      key: "currentMessage",
      content: timestamp.toString(),
    });
  } else if (!(timestamp - currentTime >= 1000 * 60 * 60 * 12)) {
    return;
  }
  await collection.updateOne(
    { key: "currentMessage" },
    { $set: { content: timestamp.toString() } },
  );

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
  const { content, error } = data;
  await message.channel.sendTyping();
  await new Promise((r) => setTimeout(r, 3000));
  if (content) {
    await message.channel.send(content);
  }
}
