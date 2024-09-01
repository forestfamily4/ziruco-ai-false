import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";
import { collection } from "../lib/db";

export const name = "edit";

export const description = "命令を変更します";

export const aliases = [];

export const usages = ["edit [メッセージ]"];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  await collection.updateOne(
    { key: "system" },
    { $set: { content: arg } },
    { upsert: true },
  );
  return message.reply("命令を変更しました");
}
