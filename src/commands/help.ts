import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";
import { runAI } from "../ai/api";

export const name = "help";

export const description = "help";

export const aliases = [];

export const usages = [];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  message.reply(`
    コマンド一覧
    \`\`\`
    ask [内容]
    edit [命令]
    js [コード]
    show
    model
    model [モデル]
   \`\`\` `);
}
