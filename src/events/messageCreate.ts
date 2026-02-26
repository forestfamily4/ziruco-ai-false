import { type Message } from "discord.js";
import { type Bot } from "../bot";
import { isAutoDeleteChannel } from "../lib/db";
import { replyToMessageMentioned } from "./messageMentioned";
import { execMessageRegularly } from "./messageRegularly";

export const name = "messageCreate";
const AUTODELETE_TIME = 5 * 1000;

function scheduleAutoDelete(message: Message) {
  isAutoDeleteChannel(message.channelId)
    .then((enabled) => {
      if (!enabled) return;
      setTimeout(() => {
        message.delete().catch(console.error);
      }, AUTODELETE_TIME);
    })
    .catch((err: unknown) => {
      console.error(err);
    });
}

export async function exec(message: Message, client: Bot) {
  scheduleAutoDelete(message);

  if (!message.content || message.author?.bot) return;

  if (message.mentions.has(client.userId)) {
    return replyToMessageMentioned(message, client);
  }

  execMessageRegularly(message, client);
  //コマンド処理

  const p = client.prefix.find(() => message.content.startsWith("z!"));
  if (!p) return;
  let arg = message.content.slice(p.length);
  // eslint-disable-next-line no-irregular-whitespace
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

export default { name, exec };
