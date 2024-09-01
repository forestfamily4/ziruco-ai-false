import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";
import { collection } from "../lib/db";

export const name = "show";

export const description = "命令を表示します";

export const aliases = [];

export const usages = ["show [メッセージ]"];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  const data = await collection.findOne({ key: "system" });
  return message.reply(
    `現在の命令は次の通りです。\n\`\`\`${data?.content}\`\`\``,
  );
}
