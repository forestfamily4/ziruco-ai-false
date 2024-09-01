import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";
import { runAI } from "../ai/api";

export const name = "ask";

export const description = "お話";

export const aliases = [];

export const usages = [];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  const data = await runAI([
    {
      username: message.author.username,
      content: arg,
      timestamp: message.createdTimestamp,
    },
  ]);
  const { response, error } = data;
  message.reply(
    !response
      ? `\`${error}\``
      : (response.message.content ??
          response.message.refusal ??
          response.finish_reason),
  );
}