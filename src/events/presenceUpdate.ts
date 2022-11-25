import {
  type TextChannel, Presence,
  resolveColor,
  EmbedBuilder,
  PresenceUpdateStatus,
} from "discord.js";
import { type Bot } from "../bot";

export const name = "presenceUpdate";

export async function exec(
  before: Presence | null,
  after: Presence,
  client: Bot
) {
  /*
  if (before?.status === after.status) return;
  return (
    client.channels.resolve(process.env.STATUS_CHANNEL) as TextChannel | null
  )?.send({
    embeds: [
      new EmbedBuilder()
        .setAuthor({
          name: after.user?.tag || "不明",
          iconURL: after.user?.displayAvatarURL({
            extension: "png",
            size: 4096,
          }),
        })
        .setDescription(`${before?.status || "offline"} => ${after.status}`)
        .setColor(resolveColor("Aqua")),
    ],
  });*/

  if(before?.user?.id!=="742347739018297346"){return;}
  if(after.status=="offline"){
    client.user?.setStatus("online")
  }
  else if(after.status=="online"){
    client.user?.setStatus("invisible")
  }
}
