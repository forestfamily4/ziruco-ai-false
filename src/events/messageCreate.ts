import { ZirucoMessage } from "./../lib/ZirucoMessage";
import { type Message } from "discord.js";
import { type Bot } from "../bot";
import MathAd from "../lib/MathAd";

export const name = "messageCreate";

export async function exec(message: Message, client: Bot) {
  if (!message.content || message.author?.bot) return;

  console.log(client.thinkings_cache);
  console.log(client.zirucos_cache);

  const mid = message.reference?.messageId;
  console.log("referenceid:" + mid);
  const tcache = client.thinkings_cache.get(mid ?? "a");
  if (tcache) {
    client.thinkings
      .find((a) => {
        a.name === tcache;
      })
      ?.reply?.(message, client)
      .exec(message, client);
    return;
  }
  const zcache = client.zirucos_cache.get(mid ?? "a");
  if (zcache) {
    const c = client.zirucos.find((a) => {
      a.name === zcache;
    });
    const d = c?.reply?.(message, client).exec(message, client);
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
