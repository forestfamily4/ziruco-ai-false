import { type Interaction, InteractionType, type Message } from "discord.js";

export const name = "interactionCreate";

export async function exec(i: Interaction) {
  if (i.type !== InteractionType.MessageComponent) return;
}