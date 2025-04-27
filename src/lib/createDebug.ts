import { resolveColor, EmbedBuilder } from "discord.js";
import { inspect } from "node:util";
import { type Bot } from "../bot";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clean(x: any, depth = 0) {
  return typeof x === "string"
    ? x
    : x instanceof Error
      ? (x.stack ?? `${x.name}: ${x.message}`)
      : inspect(x, { depth });
}

export function createDebug(bot: Bot) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (x: any) {
    x = clean(x);
    const ch = bot.channels.resolve("927852521815437312");
    const errd = `\`\`\`js\n${x}\n\`\`\``;
    if (ch?.isSendable()) {
      ch.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("エラー")
            .setColor(resolveColor("Red"))
            .setDescription(
              errd.length < 4000
                ? errd
                : "字数制限によりコンソールに表示しています。",
            ),
        ],
      });
    }
    console.error(x);
  };
}
