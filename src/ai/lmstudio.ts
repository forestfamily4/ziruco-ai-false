import { Model, System, Answer } from "./api";
import { ChatLike, LLM, LMStudioClient, PredictionResult } from "@lmstudio/sdk";
const modelName = "google/gemma-4-12b-qat";
const client = new LMStudioClient();
let modelClient: LLM | null = null;

export async function load() {
  if (modelClient) {
    return modelClient;
  }
  modelClient = await client.llm.load(
    modelName,
    // {
    // "config":{
    //     ""
    // }
  );
}

export async function runLMStudio(
  model: Model,
  messages: { username: string; content: string; timestamp: number }[],
  system: System,
): Promise<Answer> {
  if (!modelClient) {
    await load();
  }
  const _messages: ChatLike = messages.map((message) => ({
    role: "user",
    content: `name:${message.username} timestamp:${message.timestamp} content:${message.content}`,
  }));
  let response: PredictionResult | undefined = undefined;
  let errorMessage = "error";
  try {
    response = await modelClient?.respond([
      { role: "system", content: system.systemMessage ?? "" },
      ..._messages,
    ]);
  } catch (e: unknown) {
    errorMessage = String(e);
  }
  return {
    content: response?.content ?? undefined,
    error: errorMessage,
  };
}
