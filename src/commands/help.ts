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
          `${c.name} - ${c.usages?.map((u) => `z!${u}`)} - ${c.description}`,
      )
      .join("\n"),
  );
}
