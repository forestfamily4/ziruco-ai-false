import { collection, getPreset } from "../lib/db";
import { runAzure } from "./azure";
import { runCerebras } from "./cerebras";
import { runGemini } from "./gemini";
import { runGitHubAI } from "./githubAI";
import { runGitHubOpenAI } from "./githubOpenAI";
import { runMistral } from "./mistral";
import { runOpenAI } from "./openai";
import { runOpenWebUI } from "./openWebUI";

export const models = [
  "gpt-4o-mini",
  "gpt-4o",
  "meta-llama-3.1-405b-instruct",
  "Phi-3-medium-128k-instruct",
  "meta-llama-3.1-70b-instruct",
  "cohere-command-r-plus",
  "Mistral-large-2407",
  "Ministral-3B",
  "o1-preview",
  "o1-mini",
  "Phi-3.5-MoE-instruct",
  "Cohere-command-r-plus-08-2024",
  "gpt-4-turbo-preview",
  "mistral-large-2407",
  "entropix-any",
  "gemma2-9b-it",
  "llama3.3-70b",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash-exp",
  "o3-mini",
  "DeepSeek-R1",
  "openai/gpt-4.1",
  "openai/gpt-4.1-nano",
  "openai/gpt-4.1-mini",
  "cohere/cohere-command-a",
  "xai/grok-3",
  "xai/grok-3-mini",
  ///
  "openai/o3",
  "openai/o4-mini",
] as const;
export type Model = (typeof models)[number];
const initModel: Model = "gpt-4o";
export type System = {
  systemMessage?: string;
  model: Model;
};

export type Input = {
  username: string;
  content: string;
  timestamp: number;
  images: {
    contentType: string | null;
    url: string;
  }[];
}[];

export type Answer = {
  content?: string;
  reaction?: string;
  error?: string;
};

export async function getSystem(): Promise<System> {
  const preset = await getPreset();
  const systemData = await collection.findOne({
    key: "system",
    preset: preset,
  });
  const modelData = await collection.findOne({ key: "model", preset: preset });
  const model = modelData?.content ?? initModel;
  return {
    systemMessage: systemData?.content,
    model: models.map((m) => m.toString()).includes(model)
      ? (model as Model)
      : initModel,
  };
}

export async function runAI(messages: Input): Promise<Answer> {
  const system = await getSystem();
  const model = system.model;
  if (!model) {
    return { error: "モデルが見つかりませんでした。" };
  } else if (
    model === "gpt-4o" ||
    model === "gpt-4o-mini" ||
    model === "o1-mini" ||
    model === "o1-preview" ||
    model === "o3-mini"
  ) {
    return runOpenAI(model, messages, system);
  } else if (model === "Mistral-large-2407") {
    return runMistral(model, messages, system);
  } else if (
    [
      "gpt-4-turbo-preview",
      "mistral-large-2407",
      "entropix-any",
      "gemma2-9b-it",
    ].includes(model)
  ) {
    return runOpenWebUI(model, messages, system);
  } else if (model === "llama3.3-70b") {
    return runCerebras(model, messages, system);
  } else if (
    [
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-2.0-flash-exp",
    ].includes(model)
  ) {
    return runGemini(model, messages, system);
  } else if (
    ["openai/gpt-4.1", "openai/gpt-4.1-nano", "openai/gpt-4.1-mini"].includes(
      model,
    )
  ) {
    return runGitHubAI(model, messages, system, true);
  } else if (
    ["cohere/cohere-command-a", "xai/grok-3", "xai/grok-3-mini"].includes(model)
  ) {
    return runGitHubAI(model, messages, system, false);
  } else if (["openai/o3", "openai/o4-mini"].includes(model)) {
    return runGitHubOpenAI(model, messages, system);
  } else {
    return runAzure(model, messages, system);
  }
}
