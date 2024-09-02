import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";
import { runAI } from "../ai/api";

export const name = "ask";

export const description = "お話";

export const aliases = [];

export const usages = [];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  const data = await runAI([
    {
      username: message.author.username,
      content: arg,
      timestamp: message.createdTimestamp,
    },
  ]);
  const { content, error } = data;
  message.reply(
    content ?? error ?? "エラーが発生しました。もう一度お試しください。",
  );
}
