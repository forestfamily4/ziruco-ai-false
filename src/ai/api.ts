import OpenAI from "openai";
import { collection } from "../lib/db";
import { runOpenAI } from "./openai";
import { runAzure } from "./azure";
import { runMistral } from "./mistral";

export const models = [
  "gpt-4o-mini",
  "gpt-4o",
  "meta-llama-3.1-405b-instruct",
  "Phi-3-medium-128k-instruct",
  "meta-llama-3.1-70b-instruct",
  "cohere-command-r-plus",
  "Mistral-large",
] as const;
export type Model = (typeof models)[number];
const initModel: Model = "gpt-4o";
export type System = {
  systemMessage?: string;
  model: Model;
};
export type Answer = {
  content?: string;
  error?: string;
};

export async function getSystem(): Promise<System> {
  const systemData = await collection.findOne({ key: "system" });
  const modelData = await collection.findOne({ key: "model" });
  const model = modelData?.content ?? initModel;
  return {
    systemMessage: systemData?.content,
    model: models.map((m) => m.toString()).includes(model)
      ? (model as Model)
      : initModel,
  };
}

export async function runAI(
  messages: { username: string; content: string; timestamp: number }[],
): Promise<Answer> {
  const system = await getSystem();
  const model = system.model;
  if (model === "gpt-4o" || model === "gpt-4o-mini") {
    return runOpenAI(model, messages, system);
  } else if (model === "Mistral-large") {
    return runMistral(model, messages, system);
  } else {
    return runAzure(model, messages, system);
  }
}
