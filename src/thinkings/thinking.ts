import { ZirucoMessage } from './../lib/ZirucoMessage';
import type { Message } from "discord.js";
import { Bot } from "../bot";
import "../lib/MathAd";
import MathAd from "../lib/MathAd";
import "../lib/MessageAd";


export default  new ZirucoMessage(
  async(message: Message,client:Bot)=>{
    if(message.content==="🤔"&& MathAd.Random(30)){
      await message.sendWithTimeout(5000,"🤔",async(m:Message)=>{m.react('🤔')})      
    } 
  }
)

