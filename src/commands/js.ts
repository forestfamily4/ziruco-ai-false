import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";

export const name = "js";

export const description = "jsのコードを実行します。";

export const aliases = ["javascript", "node"];

export const usages = ["[コード]"];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  if (
    !["898576967136337970", "852470347907334204"].includes(
      message.guildId ?? "",
    )
  ) {
    return;
  }
  return run(message, Lang.JS, client, arg);
}

export default { name, description, aliases, usages, exec };
