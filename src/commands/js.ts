import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";

export async function exec(message: Message, _args: string[], arg: string) {
  return run(message, Lang.JS, arg);
}