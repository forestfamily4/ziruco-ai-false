import { type Message } from "discord.js";
import { type Bot } from "../bot";
import didYouMean, { ReturnTypeEnums } from "didyoumean2";

export const name = "messageCreate";

export async function exec(message: Message, client: Bot) {
  if (!message.content || message.author?.bot) return;
  const p = client.prefix.find((x) => message.content.startsWith("z!"));
  if (!p) return;
  let arg = message.content.slice(p.length);
  const args = arg.split(/[ 　\n]+/g);
  const cmd = (args.shift() as string).toLowerCase();
  arg = arg.slice(cmd.length).trim();
  const command = client.commands.find(
    (x) => x.name === cmd 
  );
  console.log("thinking"+cmd)
  if (command) {
    console.log("thinking")
    try {
      await command.exec(message, args, arg,client);
    } catch (err) {
      client.debug(err);
      message.reply("error hassei");
    }
  } 
}