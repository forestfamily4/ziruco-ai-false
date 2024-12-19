import { System, Answer, Model } from "./api";
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const token = process.env.CEREBRAS_API_KEY;

const client = new Cerebras({
  apiKey: token
});

export async function runCerebras(
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
  type Response=Awaited<ReturnType<typeof client.chat.completions.create>>;
  let response: Response | null = null;
  let errorMessage = "error";
  try {
    response = await client.chat.completions.create({
      messages: [
        { role: "system", content: system.systemMessage ?? "" },
        ..._messages,
      ],
      model: model,
      temperature: 1,
    });
    console.log(response);
  } catch (e: unknown) {
    errorMessage = String(e);
  }
  const content=(response?.choices as unknown as {message:string}[])[0]?.message;
  return {
    content:content ?? undefined,
    error: errorMessage,
  };
}


