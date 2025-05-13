import type { Message } from "discord.js";
import { collection, getPreset } from "../lib/db";

const name = "edit";

const description = "命令を変更します。";

const aliases: string[] = [];

const usages = ["edit [メッセージ]"];

async function exec(message: Message, _args: string[], arg: string) {
  // eslint-disable-next-line no-irregular-whitespace
  if (arg.match(/^[ 　]*$/)) {
    return message.reply("メッセージを指定してください。");
  }
  if (arg.length > 2000) {
    return message.reply("メッセージは2000文字以内で指定してください。");
  }
  const preset = await getPreset();
  await collection.updateOne(
    { key: "system", preset: preset },
    { $set: { content: arg, preset: preset } },
    { upsert: true },
  );
  return message.reply("命令を変更しました");
}

export default { name, description, aliases, usages, exec };
