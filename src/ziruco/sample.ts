import { ZirucoMessage } from "./../lib/ZirucoMessage";
import type { Message } from "discord.js";
import { Bot } from "../bot";
import sample_reply from "../replys/sample_reply";

export default new ZirucoMessage(exec, (message, client) => {
  return sample_reply;
});

async function exec(message: Message, client: Bot) {
  await message.sendWithTimeout(1000, "yorodev",async(a)=>{client.cache_ziruco(a.id,sample_reply)})  
}
