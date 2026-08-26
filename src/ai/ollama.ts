import { Model, System, Answer } from "./api";
import ollama, { ChatResponse } from "ollama";

export async function runOllama(
  model: Model,
  messages: { username: string; content: string; timestamp: number }[],
  system: System,
): Promise<Answer> {
  const _messages = messages.map((message) => ({
    role: "user",
    content: `name:${message.username} timestamp:${message.timestamp} content:${message.content}`,
  }));
  let response: ChatResponse | null = null;
  let errorMessage = "error";
  try {
    response = await ollama.chat({
      messages: [
        { role: "user", content: system.systemMessage ?? "" },
        ..._messages,
      ],
      model: model,
    });
  } catch (e: unknown) {
    errorMessage = String(e);
  }
  return {
    content: response?.message.content ?? undefined,
    error: errorMessage,
  };
}
