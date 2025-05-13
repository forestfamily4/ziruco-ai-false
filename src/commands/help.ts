import type { Message } from "discord.js";
import { Bot } from "../bot";

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
  message.reply(
    client.commands
      .map(
        (c) =>
          `${c.name} - ${c.usages?.map((u) => `${client.prefix}${u}`)} - ${c.description}`,
      )
      .join("\n"),
  );
}

export default { name, description, aliases, usages, exec };
