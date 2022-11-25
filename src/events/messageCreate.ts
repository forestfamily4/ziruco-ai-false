import { type Message } from "discord.js";
import { type Bot } from "../bot";
import didYouMean, { ReturnTypeEnums } from "didyoumean2";
import MathAd from "../lib/MathAd";

export const name = "messageCreate";

export async function exec(message: Message, client: Bot) {
  if (!message.content || message.author?.bot) return;

  client.thinkings.forEach((a: any) => {
    try {
      a.exec(message, client);
    } catch (e) {
      console.log(e);
    }
  });

  const zirucof = () => {
    if(!message.content.match(/ *ziruco|ジルコ|ジル子*/)){
      return null;
    }    
    const num = client.zirucos.length;
    const ziruco = client.zirucos[Math.floor(Math.random() * num)];
    return ziruco;
  };

  try {
    zirucof()?.exec(message, client);
  } catch (e) {
    console.log(e);
  }

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
