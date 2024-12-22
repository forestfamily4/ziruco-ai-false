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
  messages: {
    username: string;
    content: string;
    timestamp: number;
    image?: {
      contentType?: string;
      url: string;
    };
  }[],
  system: System,
): Promise<Answer> {
  const messagePromises = messages.map<
    Promise<{
      role: "user";
      content: ChatCompletionContentPart[];
    }>
  >(async (message) => {
    const imageUrl =
      message.image &&
      (await encodeImage(message.image.url, message.image.contentType));
    return {
      role: "user" as const,
      content: [
        {
          type: "text",
          text: `name:${message.username} timestamp:${message.timestamp} content:${message.content}`,
        },
        ...(message.image
          ? [
              {
                type: "image_url" as const,
                image_url: {
                  url: imageUrl ?? "",
                },
              },
            ]
          : []),
      ],
    };
  });
  const _messages = await Promise.all(messagePromises);
  console.log(_messages.map((m) => m.content));
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
    console.error(e);
  }
  return {
    content: response?.choices[0].message.content ?? undefined,
    error: errorMessage,
  };
}

async function encodeImage(imageUrl: string, contentType?: string) {
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  const data = buffer.toString("base64");
  if (!contentType) {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("画像のMIMEタイプを取得できませんでした。");
    }
    return `data:${contentType};base64,${data}`;
  }
  return `data:${contentType};base64,${data}`;
}
