import type { Message } from "discord.js";
import { Bot } from "../bot";

export async function exec(message: Message, client:Bot) {
    message.sendWithTimeout(1000,"yoro")
    return;
    
}