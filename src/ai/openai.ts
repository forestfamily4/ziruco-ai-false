import { Answer, Model, System } from "./api";
import OpenAI from "openai";
import { collection } from "../lib/db";

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
        { role: "system", content: system.systemMessage ?? "" },
        ..._messages,
      ],
      model: model,
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
    });
    console.log(response);
  } catch (e: any) {
    errorMessage = e.toString();
  }
  return {
    content: response?.choices[0].message.content ?? undefined,
    error: errorMessage,
  };
}
