import type { Message } from "discord.js";
import { Bot } from "../bot";
import "../lib/MathAd";
import MathAd from "../lib/MathAd";
import "../lib/MessageChannelSend";

export async function exec(message: Message,client:Bot) {
  if(message.content==="🤔"&& MathAd.Random(30)){
    (await message.sendWithTimeout(5000,"🤔")).react("🤔");
  }
    return;
}
