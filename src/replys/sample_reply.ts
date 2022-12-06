import { ZirucoMessage } from '../lib/ZirucoMessage';
import type { Message } from "discord.js";
import { Bot } from "../bot";


export default new ZirucoMessage(
  async(message: Message, client: Bot) => {
    return (await message.sendWithTimeout(1000, "あなたはyoroに返信したかもしれません。"))
  }
)