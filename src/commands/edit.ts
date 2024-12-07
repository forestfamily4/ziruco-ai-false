import type { Message } from "discord.js";
import { collection, getPreset } from "../lib/db";

export const name = "edit";

export const description = "命令を変更します。";

export const aliases = [];

export const usages = ["edit [メッセージ]"];

export async function exec(message: Message, _args: string[], arg: string) {
  const preset = await getPreset();
  await collection.updateOne(
    { key: "system", preset: preset },
    { $set: { content: arg, preset: preset } },
    { upsert: true },
  );
  return message.reply("命令を変更しました");
}
