import { ZirucoMessage } from '../lib/ZirucoMessage';
import type { Message } from "discord.js";
import { Bot } from "../bot";


export default new ZirucoMessage(
  exec
)

async function exec(message: Message, client: Bot): Promise<string> {
  return (await message.sendWithTimeout(1000, "あなたはyoroに返信したかもしれません。")).id;
}