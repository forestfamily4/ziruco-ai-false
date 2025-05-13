import { type Interaction, InteractionType } from "discord.js";

export const name = "interactionCreate";

export async function exec(i: Interaction) {
  if (i.type !== InteractionType.MessageComponent) return;
}

export default { name, exec };
