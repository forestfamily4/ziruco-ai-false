import { Answer, Model, System } from "./api";
import OpenAI from "openai";

const endpoint = "https://models.inference.ai.azure.com";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: process.env.GITHUB_TOKEN,
});

export async function runOpenAI(
  model: Model,
  messages: { username: string; content: string; timestamp: number }[],
  system: System,
): Promise<Answer> {
  const _messages = messages.map<{
    role: "user";
    content: string;
  }>((message) => ({
    role: "user",
    content: `name:${message.username} timestamp:${message.content} content:${message.content}`,
  }));
  let response: OpenAI.Chat.Completions.ChatCompletion | null = null;
  let errorMessage = "error";
  try {
    response = await client.chat.completions.create({
      messages: [
        { role: "user", content: system.systemMessage ?? "" },
        ..._messages,
      ],
      model: model,
    });
    console.log(response);
  } catch (e: unknown) {
    errorMessage = String(e);
  }
  return {
    content: response?.choices[0].message.content ?? undefined,
    error: errorMessage,
  };
}
