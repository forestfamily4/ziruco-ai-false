import { ZirucoMessage } from "./../lib/ZirucoMessage";
import { type Message } from "discord.js";
import { type Bot } from "../bot";
import MathAd from "../lib/MathAd";

export const name = "messageCreate";

export async function exec(message: Message, client: Bot) {
  if (!message.content || message.author?.bot) return;


  console.log("------------------------------------------");
  console.log(client.thinkings_cache);
  console.log(client.zirucos_cache);
  console.log(client.others_cache);
  console.log("------------------------------------------");

  const mid = message.reference?.messageId;
  console.log("referenceid:" + mid);

  const tcache:string = client.thinkings_cache.get(mid ?? "a");
  if (tcache) {
    client.thinkings.forEach(a=>{
      if(a.name==tcache){
        a.exec(message,client)
      }
    })
    return;
  }
  const zcache:string = client.zirucos_cache.get(mid ?? "a");
  
  if (zcache) {
    client.zirucos.forEach((a) => {
      if (a.name === zcache) {
        a.exec(message, client);
      }
    });
    return;
  }

  const ocache:string = client.others_cache.get(mid ?? "a");
  if (ocache) {
    client.others.forEach(a=>{
      console.log(a.name)
      if(a.name===ocache){
        console.log(a.name)
        a.exec(message,client)
      }
    })
    return;
  }

  client.thinkings.forEach((a: ZirucoMessage) => {
    try {
      a.exec(message, client)
    } catch (e) {
      console.log(e);
    }
  });

  const zirucof = () => {
    if (!message.content.match(/ *ziruco|ジルコ|ジル子*/)) {
      return null;
    }
    const num = client.zirucos.length;
    const ziruco = client.zirucos[Math.floor(Math.random() * num)];
    return ziruco;
  };

  try {
    const b = zirucof();
    if (b) {
      b.exec(message, client);
    }
  } catch (e) {
    console.log(e);
  }

  //コマンド処理

  const p = client.prefix.find((x) => message.content.startsWith("z!"));
  if (!p) return;
  let arg = message.content.slice(p.length);
  const args = arg.split(/[ 　\n]+/g);
  const cmd = (args.shift() as string).toLowerCase();
  arg = arg.slice(cmd.length).trim();
  const command = client.commands.find((x) => x.name === cmd);
  if (command) {
    try {
      await command.exec(message, args, arg, client);
    } catch (err) {
      client.debug(err);
      message.reply("error hassei");
    }
  }
}
