import { PermissionsBitField, type Message } from "discord.js";
import {
  DEFAULT_AUTODELETE_MS,
  isAutoDeleteChannel,
  removeAutoDeleteChannel,
  setAutoDeleteChannel,
} from "../lib/db";

export const name = "autodelete";

export const description =
  "このチャンネルの自動削除を登録/解除します。時間指定もできます。";

export const aliases = [];

export const usages = [
  "autodelete",
  "autodelete [時間(例: 30m, 12h, 2d, 45s)]",
];

const MAX_TIMEOUT_MS = 2_147_483_647;

function parseDeleteAfterMs(raw: string | undefined): number | null {
  if (!raw) return DEFAULT_AUTODELETE_MS;
  const match = raw.trim().match(/^(\d+)(s|m|h|d)?$/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const unit = (match[2] ?? "h").toLowerCase();
  const unitMs =
    unit === "s"
      ? 1000
      : unit === "m"
        ? 60 * 1000
        : unit === "h"
          ? 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;
  const deleteAfterMs = amount * unitMs;
  if (deleteAfterMs <= 0 || deleteAfterMs > MAX_TIMEOUT_MS) {
    return null;
  }
  return deleteAfterMs;
}

function formatDuration(ms: number): string {
  if (ms % (24 * 60 * 60 * 1000) === 0) return `${ms / (24 * 60 * 60 * 1000)}d`;
  if (ms % (60 * 60 * 1000) === 0) return `${ms / (60 * 60 * 1000)}h`;
  if (ms % (60 * 1000) === 0) return `${ms / (60 * 1000)}m`;
  return `${ms / 1000}s`;
}

export async function exec(message: Message, args: string[]) {
  const rawDuration = args.at(0);
  const alreadyEnabled = await isAutoDeleteChannel(message.channelId);
  const isDisableRequest = alreadyEnabled && !rawDuration;

  if (!isDisableRequest) {
    const deleteAfterMs = parseDeleteAfterMs(rawDuration);
    if (deleteAfterMs === null) {
      if (!message.channel.isSendable()) return;
      await message.channel.send(
        "時間指定が不正です。`30m`, `12h`, `2d`, `45s` の形式で指定してください。",
      );
      return;
    }

    if (message.inGuild()) {
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
    await setAutoDeleteChannel(message.channelId, deleteAfterMs);
    if (!message.channel.isSendable()) return;
    const reply = await message.channel.send(
      alreadyEnabled
        ? `設定時間を${formatDuration(deleteAfterMs)}に更新しました。`
        : `登録しました。削除時間: ${formatDuration(deleteAfterMs)}`,
    );
    setTimeout(() => {
      reply.delete().catch(() => undefined);
    }, 5000);
    return;
  }

  await removeAutoDeleteChannel(message.channelId);
  if (!message.channel.isSendable()) return;
  const reply = await message.channel.send("登録を解除しました。");
  setTimeout(() => {
    reply.delete().catch(() => undefined);
  }, 5000);
}

export default { name, description, aliases, usages, exec };
