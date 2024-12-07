import { Mistral } from "@mistralai/mistralai";
import { System, Answer, Model } from "./api";
import { ChatCompletionResponse } from "@mistralai/mistralai/models/components";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const client = new Mistral({
  apiKey: token,
  serverURL: endpoint,
});

export async function runMistral(
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
  let response: ChatCompletionResponse | null = null;
  let errorMessage = "error";
  try {
    response = await client.chat.complete({
      messages: [
        { role: "system", content: system.systemMessage ?? "" },
        ..._messages,
      ],
      model: model,
      temperature: 1,
      maxTokens: 1000,
      topP: 1,
    });
    console.log(response);
  } catch (e: unknown) {
    errorMessage = String(e);
  }
  return {
    content: response?.choices?.[0].message.content ?? undefined,
    error: errorMessage,
  };
}
