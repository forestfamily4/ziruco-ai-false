import type { Message } from "discord.js";
import { Bot } from "../bot";
import { collection } from "../lib/db";

export const name = "show";

export const description = "現在の命令を表示します。";

export const aliases = [];

export const usages = ["show", "show [プリセット番号]"];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  const preset = _args.at(0);
  if (!preset) {
    const data = await collection.find({ key: "system" }).toArray();
    return message.reply(
      `現在の命令は次の通りです。\n${data.map((d) => {
        const content = d.content;
        if (content.length <= 100) {
          return `プリセット${d.preset}:\`\`\`${content}\`\`\``;
        }
        return `プリセット${d.preset}:\`\`\`${d.content.slice(0, 100)}...\`\`\``;
      }).join("\n")}`
    );
  }

  const data = await collection.findOne({ key: "system", preset: preset });
  if (!data) {
    return message.reply(`プリセット「${preset}」は存在しません。`);
  }
  return message.reply(
    `プリセット「${preset}」。現在の命令は次の通りです。\n\`\`\`${data?.content}\`\`\``,
  );
}
