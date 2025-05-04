import { Message } from "discord.js";
import { runAI } from "../ai/api";
import { Bot } from "../bot";

export async function replyToMessageMentioned(message: Message, client: Bot) {
  if (!message.channel.isSendable()) return;
  const messages = (await message.channel.messages.fetch({ limit: 10 }))
    .filter((m) => m.author.id === client.userId || !m.author.bot)
    .filter(
      (m) => message.createdTimestamp - m.createdTimestamp < 20 * 60 * 1000,
    )
    .reverse()
    .map((m) => {
      const attachment = m.attachments;
      return {
        username: m.author.username,
        content: m.content,
        timestamp: m.createdTimestamp,
        images: attachment.map((a) => ({
          contentType: a.contentType,
          url: a.url,
        })),
      };
    });
  const data = await runAI(messages);
  const { content, reaction, error } = data;
  if (reaction) {
    await message.react(reaction);
  }
  await message.channel.sendTyping();
  await new Promise((r) => setTimeout(r, 3000));
  await message.reply(
    content?.slice(0, 2000) ??
      error ??
      "エラーが発生しました。もう一度お試しください。",
  );
  return;
}
