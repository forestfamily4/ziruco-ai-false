import { Answer, Model, System } from "./api";
import {
  ReqApiChatCompletions,
  ResApiChatCompletions,
  ResApiModels,
} from "./openWebUI.type";

const host = process.env.OPENWEBUI_URL;
const token = process.env.OPENWEBUI_TOKEN;

async function fetchOpenWebUI(data: {
  method: string;
  path: string;
  body: unknown;
}) {
  const { method, body, path } = data;
  return fetch(`${host}/api${path}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// eslint-disable-next-line unused-imports/no-unused-vars
async function getModels() {
  const res = await fetchOpenWebUI({
    method: "GET",
    path: "/models",
    body: null,
  });
  return (await res.json()) as ResApiModels;
}

async function postChatCompletions(data: ReqApiChatCompletions) {
  const res = await fetchOpenWebUI({
    method: "POST",
    path: "/chat/completions",
    body: data,
  });
  return (await res.json()) as ResApiChatCompletions;
}

export async function runOpenWebUI(
  model: Model,
  messages: { username: string; content: string; timestamp: number }[],
  system: System,
): Promise<Answer> {
  const _messages = messages.map((message) => ({
    role: "user",
    content: `name:${message.username} timestamp:${message.timestamp} content:${message.content}`,
  }));
  let response: ResApiChatCompletions | null = null;
  let errorMessage = "error";
  try {
    response = await postChatCompletions({
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
    content: response?.choices[0].message.content ?? undefined,
    error: errorMessage,
  };
}
