import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";

export const name = "js";

export const description = "jsのコードを実行します";

export const aliases = ["javascript", "node"];

export const usages = ["[コード]"];

export async function exec(message: Message, _args: string[], arg: string,client:Bot) {
	if(!client.author.includes(message.author.id)){return;}
  return run(message, Lang.JS, client,arg);
}