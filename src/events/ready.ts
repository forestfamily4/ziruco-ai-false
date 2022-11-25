import type { TextChannel } from "discord.js";
import { type Bot } from "../bot";
import { ActivityMap } from "../lib/ActivityMap";

export const name = "ready";
export const once = true;
export async function exec(client: Bot) {
  console.log(`Ready as ${client.user?.tag}`);
  (
    client.channels.cache.get(
      "927852521815437312" as string
    ) as TextChannel
  ).send("botが起動しました");
  ActivityMap(client, ["アズゴアファンクラブ"]);
}
