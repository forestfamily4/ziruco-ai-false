import { Presence } from "discord.js";
import { type Bot } from "../bot";

export const name = "presenceUpdate";

export async function exec(
  before: Presence | null,
  after: Presence,
  client: Bot,
) {
  if (before?.user?.id !== "742347739018297346") {
    return;
  }
  if (after.status === "offline") {
    client.user?.setStatus("online");
  } else {
    client.user?.setStatus("invisible");
  }
}
