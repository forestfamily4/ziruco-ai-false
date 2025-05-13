import { AttachmentBuilder, type Message } from "discord.js";
import { collection, getPreset } from "../lib/db";

export const name = "show";

export const description = "現在の命令を表示します。";

export const aliases = [];

export const usages = ["show", "show [プリセット番号]"];

export async function exec(message: Message, _args: string[]) {
  const preset = _args.at(0);
  if (!preset) {
    const currentPreset = await getPreset();
    const data = await collection.findOne({
      key: "system",
      preset: currentPreset,
    });
    return message.reply(
      `現在のプリセットは「${currentPreset}」。命令は次の通りです。\n\`\`\`${data?.content}\`\`\``,
    );
  }

  const data = await collection.findOne({ key: "system", preset: preset });
  if (!data) {
    return message.reply(`プリセット「${preset}」は存在しません。`);
  }
  const size = data?.content.length;
  if (size <= 1900) {
    return message.reply(
      `プリセット「${preset}」。現在の命令は次の通りです。\n\`\`\`${data?.content}\`\`\``,
    );
  } else {
    const buffer = Buffer.from(data?.content);
    return message.reply({
      content: `プリセット「${preset}」。現在の命令は次の通りです。`,
      files: [
        new AttachmentBuilder(buffer, {
          name: `data.txt`,
        }),
      ],
    });
  }
}

export default { name, description, aliases, usages, exec };
