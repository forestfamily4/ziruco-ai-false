import { type Message } from "discord.js";
import { type Bot } from "../bot";
import { getModule } from "../lib/getModule";

export const name = "messageCreate";

export async function exec(message: Message, client: Bot) {
  if (!message.content || message.author?.bot) return;
  command(message, client);

  

  
}


async function command(message: Message, client: Bot){
  const p = client.prefix.find((x) => message.content.startsWith(x));
  if (!p) return;
  let arg = message.content.slice(p.length);
  const args = arg.split(/[ 　\n]+/g);
  const cmd = (args.shift() as string).toLowerCase();
  arg = arg.slice(cmd.length).trim();
  const command = client.commands.find(
    (x) => x.name === cmd 
  );
  if (command) {
    try {
      await command.exec(message, args, arg);
    } catch (err) {
      client.debug(err);
      message.reply("エラーが発生しました");
    }
  }
}
