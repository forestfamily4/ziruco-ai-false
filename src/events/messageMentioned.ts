import { Message } from "discord.js";
import { runAI } from "../ai/api";
import { Bot } from "../bot";

export async function replyToMessageMentioned(message: Message, client: Bot) {
  const messages = (await message.channel.messages.fetch({ limit: 20 }))
    .filter((m) => m.author.id !== client.userId && !m.author.bot)
    .reverse()
    .map((m) => ({
      username: m.author.username,
      content: m.content,
      timestamp: m.createdTimestamp,
    }));
  const data = await runAI(messages);
  const { response, error } = data;
  await message.channel.sendTyping();
  await new Promise((r) => setTimeout(r, 3000));
  await message.reply(
    !response
      ? `\`${error}\``
      : (response.message.content ??
          response.message.refusal ??
          response.finish_reason),
  );
  return;
}
