import didYouMean, { ReturnTypeEnums } from "didyoumean2";
import type { Message } from "discord.js";
import { Model, models } from "../ai/api";
import { collection, getPreset } from "../lib/db";

export const name = "model";

export const description = "modelを確認します。modelを変更します。";

export const aliases = [];

export const usages = ["model [モデル名]", "model"];

const nicknames: Map<Model, string> = new Map([
  ["gpt-4o-mini", "ジルコGPTカス"],
  ["gpt-4o", "ジルコGPT"],
  ["meta-llama-3.1-405b-instruct", "ジルコラマ405号"],
  ["Phi-3-medium-128k-instruct", "ジルコファイさん"],
  ["meta-llama-3.1-70b-instruct", "ジルコラマ70号"],
  ["cohere-command-r-plus", "ジルコヒア"],
  ["Cohere-command-r-plus-08-2024", "ジルコヒア2024年生まれ"],
  ["Mistral-large-2407", "ジルコストラル"],
  ["o1-mini", "ジルコGPTミニ"],
  ["o1-preview", "ジルコGPTプロトタイプ"],
  ["Phi-3.5-MoE-instruct", "ジルコファイ萌"],
  ["Ministral-3B", "ジルコストラルB"],
  ["gpt-4-turbo-preview", "ジルコGPTターボプロトタイプ"],
  ["mistral-large-2407", "ジルコストラル(neodyland)"],
  ["entropix-any", "ジルコエントロピックス"],
  ["gemma2-9b-it", "ジルコジェマ2"],
  ["DeepSeek-R1", "鋯深度求索"],
  // "openai/gpt-4.1",
  // "openai/gpt-4.1-nano",
  // "openai/gpt-4.1-mini",
  // "cohere/cohere-command-a",
  // "xai/grok-3",
  // "xai/grok-3-mini",
  // ///
  // "openai/o3",
  // "openai/o4-mini",
  ["openai/gpt-4.1", "ジルコGPT4.1"],
  ["openai/gpt-4.1-nano", "ジルコGPT4.1NANO"],
  ["openai/gpt-4.1-mini", "ジルコGPT4.1ミニ"],
  ["cohere/cohere-command-a", "ジルココヒアA"],
  ["xai/grok-3", "ジルコロック3"],
  ["xai/grok-3-mini", "ジルコロック3ミニ"],
  ["openai/o3", "ジルコO3"],
  ["openai/o4-mini", "ジルコO4ミニ"],
  ["openai/gpt-5-nano", "ジルコGPT5ナノ"],
  ["openai/gpt-5-mini", "ジルコGPT5ミニ"],
  ["openai/gpt-5-chat", "ジルコGPT5チャット"],
  ["openai/gpt-5", "ジルコGPT5"],
]);

export async function exec(message: Message, _args: string[], arg: string) {
  if (message.guildId !== "852470347907334204") {
    return;
  }
  const preset = await getPreset();
  if (_args.length > 0) {
    const modelSuggestion = didYouMean(arg, models, {
      returnType: ReturnTypeEnums.ALL_CLOSEST_MATCHES,
      threshold: 0.1,
    })?.[0];
    console.log(modelSuggestion);
    if (!modelSuggestion) {
      message.reply(
        `プリセット「${preset}」。モデルが見つかりませんでした。使用可能なモデルは${models.map((s) => s.toString()).join(", ")}です。`,
      );
      return;
    }
    collection.updateOne(
      { key: "model" },
      { $set: { content: modelSuggestion, preset: preset } },
      { upsert: true },
    );
    message.reply(
      `プリセット「${preset}」。${modelSuggestion}を使用します。\n使用可能なモデルは${models.map((s) => s.toString()).join(", ")}です。`,
    );
    const nickname = nicknames.get(modelSuggestion);
    if (nickname) {
      message.guild?.members.me?.setNickname(nickname);
    }
  } else {
    collection.findOne({ key: "model", preset: preset }).then((doc) => {
      message.reply(
        doc?.content
          ? `プリセット「${preset}」。${doc?.content}を使用中です。\n使用可能なモデルは${models.map((s) => s.toString()).join(", ")}です。`
          : `プリセット「${preset}」。モデルが見つかりませんでした`,
      );
    });
  }
}

export default { name, description, aliases, usages, exec };
