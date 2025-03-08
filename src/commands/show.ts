import { AttachmentBuilder, type Message } from "discord.js";
import { collection } from "../lib/db";

export const name = "show";

export const description = "現在の命令を表示します。";

export const aliases = [];

export const usages = ["show", "show [プリセット番号]"];

export async function exec(message: Message, _args: string[]) {
  const preset = _args.at(0);
  if (!preset) {
    const data = await collection.find({ key: "system" }).toArray();
    const maxNum = 50;
    return message.reply(
      `現在の命令は次の通りです。\n${data
        .map((d) => {
          const content = d.content;
          if (content.length <= maxNum) {
            return `プリセット${d.preset}:\`\`\`${content}\`\`\``;
          }
          return `プリセット${d.preset}:\`\`\`${d.content.slice(0, maxNum)}...\`\`\``;
        })
        .join("\n")}`,
    );
  }

  const data = await collection.findOne({ key: "system", preset: preset });
  if (!data) {
    return message.reply(`プリセット「${preset}」は存在しません。`);
  }
  const size=data?.content.length;
  if(size<=1900){
    return message.reply(
      `プリセット「${preset}」。現在の命令は次の通りです。\n\`\`\`${data?.content}\`\`\``,
    );
  }else{
    const buffer=Buffer.from(data?.content);
    return message.reply(
      {
        "content":`プリセット「${preset}」。現在の命令は次の通りです。`,
        "files":[new AttachmentBuilder(buffer,{
          name:`data.txt`
        })]
      }
    );
  }
  
}
