import type { Message } from "discord.js";
import { collection, getPreset, setPreset } from "../lib/db";

export const name = "preset";

export const description = "プリセットを変更します。";

export const aliases = [];

export const usages = ["preset [プリセット名]", "preset rm [プリセット名]"];

export async function exec(message: Message, _args: string[]) {
  const arg1 = _args.at(0);
  const arg2 = _args.at(1);
  if (!arg1) {
    const presets = Array.from(
      new Set((await collection.find().toArray()).map((c) => c.preset)),
    );
    return message.reply(
      `現在のプリセットは${await getPreset()}です。\nプリセット一覧は${presets.join(",")}です。`,
    );
  }
  if (arg1 === "rm") {
    await collection.deleteMany({ preset: arg2 });
    await setPreset("0");
    return message.reply("プリセットを削除しました。");
  }
  if (!(await collection.findOne({ preset: arg1 }))) {
    await collection.insertOne({
      preset: arg1,
      key: "model",
      content: "gpt-4o",
    });
    await collection.insertOne({
      preset: arg1,
      key: "system",
      content: "デフォルトの命令です。",
    });
    setPreset(arg1);
    return message.reply("プリセットを作成しました。");
  }
  setPreset(arg1);
  return message.reply("プリセットを変更しました。");
}

export default { name, description, aliases, usages, exec };
