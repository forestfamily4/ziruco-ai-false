import { ZirucoMessage } from './../lib/ZirucoMessage';
import type { Message } from "discord.js";
import { Bot } from "../bot";

async function exec(message: Message, client:Bot): Promise<string> {
    if(!message.isZiruco()){return "";}
    const a=await message.replyWithTimeout(3000,"このbot優秀だな 僕の発言をどこから学習してるんだろう")
    return a.id;    
}

export default new ZirucoMessage(exec);