import type { Message } from "discord.js";
import { Lang, run } from "../lib/compile";
import { Bot } from "../bot";
import { collection } from "../lib/db";
import { models } from "../ai/api";

export const name = "model";

export const description = "modelを確認";

export const aliases = [];

export const usages = ["[コード]"];

export async function exec(
  message: Message,
  _args: string[],
  arg: string,
  client: Bot,
) {
  if (message.guildId !== "852470347907334204") {
    return;
  }

  if (_args.length > 0) {
    const model = arg;
    if (models.map((s) => s.toString()).includes(model)) {
      collection.updateOne(
        { key: "model" },
        { $set: { content: model } },
        { upsert: true },
      );
      message.reply(`${model}を使用します`);
    } else {
      message.reply(
        `使用可能なモデルは${models.map((s) => s.toString()).join(", ")}です`,
      );
    }
  } else {
    collection.findOne({ key: "model" }).then((doc) => {
      message.reply(
        doc?.content
          ? `${doc?.content}を使用中 使用可能なモデルは${models.map((s) => s.toString()).join(", ")}です`
          : "モデルが見つかりませんでした",
      );
    });
  }
}
