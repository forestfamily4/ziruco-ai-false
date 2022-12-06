import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";

export const name = "js";

export const description = "jsのコードを実行します";

export const aliases = ["javascript", "node"];

export const usages = ["[コード]"];

export async function exec(message: Message, _args: string[], arg: string,client:Bot) {
  console.log(client.botauthor)
	if(!client.botauthor.includes(message.author.id)){return message.channel.send("なんかあなたにはeval使わせたくないです");}
  return run(message, Lang.JS, client,arg);
}