import type { Message } from "discord.js";
import { runAI } from "../ai/api";

const name = "ask";

const description = "お話します。メッセージの履歴を読みません。";

const aliases: string[] = [];

const usages = ["ask [内容]"];

async function exec(message: Message, _args: string[], arg: string) {
  const attachment = message.attachments;
  const data = await runAI([
    {
      username: message.author.username,
      content: arg,
      timestamp: message.createdTimestamp,
      images: attachment.map((a) => ({
        contentType: a.contentType,
        url: a.url,
      })),
    },
  ]);
  const { content, reaction, error } = data;
  if (reaction) {
    await message.react(reaction);
  }
  message.reply(
    content?.slice(0, 2000) ??
      error ??
      "エラーが発生しました。もう一度お試しください。",
  );
}

export default { name, description, aliases, usages, exec };
