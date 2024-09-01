import OpenAI from "openai";
import { collection } from "../lib/db";
import { OpenAIError } from "openai/error";

const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: process.env.GITHUB_TOKEN,
});

async function getSystem() {
  const data = await collection.findOne({ key: "system" });
  return {
    systemMessage: data?.content,
  };
}

export async function runAI(
  messages: { username: string; content: string; timestamp: number }[],
) {
  const system = await getSystem();
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
      model: modelName,
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
    });
    console.log(response);
  } catch (e: any) {
    errorMessage = e.toString();
  }
  return {
    response: response?.choices[0],
    error: errorMessage,
  };
}
