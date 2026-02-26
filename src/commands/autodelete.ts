import { PermissionsBitField, type Message } from "discord.js";
import {
  addAutoDeleteChannel,
  isAutoDeleteChannel,
  removeAutoDeleteChannel,
} from "../lib/db";

export const name = "autodelete";

export const description =
  "このチャンネルのメッセージを24時間後に自動削除する対象として登録します。";

export const aliases = [];

export const usages = ["autodelete"];

export async function exec(message: Message) {
  const alreadyEnabled = await isAutoDeleteChannel(message.channelId);

  if (!alreadyEnabled && message.inGuild()) {
    const me = message.guild?.members.me;
    const permissions = me
      ? message.channel.permissionsFor(me)
      : message.member?.permissions;
    if (!permissions?.has(PermissionsBitField.Flags.ManageMessages)) {
      if (!message.channel.isSendable()) return;
      await message.channel.send(
        "メッセージ削除権限がないため登録できません。",
      );
      return;
    }
  }

  if (alreadyEnabled) {
    await removeAutoDeleteChannel(message.channelId);
  } else {
    await addAutoDeleteChannel(message.channelId);
  }
  if (!message.channel.isSendable()) return;
  const reply = await message.channel.send(
    alreadyEnabled ? "登録を解除しました。" : "登録しました。",
  );
  setTimeout(() => {
    reply.delete().catch(() => undefined);
  }, 5000);
}

export default { name, description, aliases, usages, exec };
