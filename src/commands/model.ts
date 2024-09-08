import type { Message } from "discord.js";
import didYouMean, { ReturnTypeEnums } from "didyoumean2";
import { Bot } from "../bot";
import { collection } from "../lib/db";
import { Model, models } from "../ai/api";

export const name = "model";

export const description = "modelを確認";

export const aliases = [];

export const usages = ["[コード]"];

const nicknames: Map<Model, string> = new Map([
  ["gpt-4o-mini", "ジルコGPTカス"],
  ["gpt-4o", "ジルコGPT"],
  ["meta-llama-3.1-405b-instruct", "ジルコラマ405号"],
  ["Phi-3-medium-128k-instruct", "ジルコファイさん"],
  ["meta-llama-3.1-70b-instruct", "ジルコラマ70号"],
  ["cohere-command-r-plus", "ジルコヒア"],
  ["Mistral-large", "ジルコストラル"]
]);

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
    const modelSuggestion = didYouMean(arg, models,{
      "returnType": ReturnTypeEnums.ALL_CLOSEST_MATCHES,
      "threshold": 0.1
    })?.[0];
    console.log(modelSuggestion);
    if (!modelSuggestion) {
      message.reply(`モデルが見つかりませんでした 使用可能なモデルは${models.map((s) => s.toString()).join(", ")}です`);
      return;
    }
    collection.updateOne(
      { key: "model" },
      { $set: { content: modelSuggestion[0] } },
      { upsert: true },
    );
    message.reply(`${modelSuggestion}を使用します\n使用可能なモデルは${models.map((s) => s.toString()).join(", ")}です`);
    const nickname = nicknames.get(modelSuggestion);
    nickname && message.guild?.members.me?.setNickname(nickname);
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
