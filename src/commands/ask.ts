import type { Message } from "discord.js";
import { runAI } from "../ai/api";

export const name = "ask";

export const description = "お話します。メッセージの履歴を読みません。";

export const aliases = [];

export const usages = ["ask [内容]"];

export async function exec(message: Message, _args: string[], arg: string) {
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
  const { content, error } = data;
  message.reply(
    content?.slice(0, 2000) ??
      error ??
      "エラーが発生しました。もう一度お試しください。",
  );
}
