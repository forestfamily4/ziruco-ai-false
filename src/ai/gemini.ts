import { ChatCompletionContentPart } from "openai/resources/chat/completions";
import { Answer, Model, System } from "./api";
import OpenAI from "openai";

const endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: process.env.GEMINI_API_KEY,
});

export async function runGemini(
  model: Model,
  messages: { username: string; content: string; timestamp: number; imageUrl?: string }[],
  system: System,
): Promise<Answer> {
  const messagePromises = messages.map<Promise<{
    role: "user";
    content: ChatCompletionContentPart[];
  }>>(async(message) => {
    const imageUrl = message.imageUrl ? (await encodeImage(message.imageUrl)) : "";
    return {
      role: "user",
      content: [
        {
          type: "text",
          text: `name:${message.username} timestamp:${message.content} content:${message.content}`,
        },
        ...(message.imageUrl
          ? [
            {
              type: "image_url" as const,
              image_url: {
                url: imageUrl,
              },
            },
          ]
          : []),
      ],
    }
  });
  const _messages = await Promise.all(messagePromises);
  console.log(_messages.map(m=>m.content.map(c=>JSON.stringify(c))));
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

async function encodeImage(imageUrl: string) {
  const response = await fetch(imageUrl);
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.startsWith("image/")) {
    throw new Error("画像のMIMEタイプを取得できませんでした。");
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const data = buffer.toString("base64");
  return `data:${contentType};base64,${data}`;
}