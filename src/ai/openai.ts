import OpenAI from "openai";
import { ChatCompletionContentPart } from "openai/resources/chat/completions";
import { Answer, Model, System } from "./api";

const endpoint = "https://models.inference.ai.azure.com";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: process.env.GITHUB_TOKEN,
});

export async function runOpenAI(
  model: Model,
  messages: {
    username: string;
    content: string;
    timestamp: number;
    images: {
      contentType: string | null;
      url: string;
    }[];
  }[],
  system: System,
): Promise<Answer> {
  const _messages = messages.map<{
    role: "user";
    content: ChatCompletionContentPart[];
  }>((message) => ({
    role: "user",
    content: [
      {
        type: "text",
        text: `name:${message.username} timestamp:${message.timestamp} content:${message.content}`,
      },
      ...(message.images.map((i) => ({
        type: "image_url" as const,
        image_url: {
          url: i.url,
        },
      })) ?? []),
    ],
  }));
  console.log(_messages);
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
