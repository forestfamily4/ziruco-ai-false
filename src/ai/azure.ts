import ModelClient, { ChatCompletionsOutput } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { Answer, Model, System } from "./api";

const token = process.env.GITHUB_TOKEN;
if (!token) {
  throw new Error("GITHUB_TOKEN is not defined");
}
const endpoint = "https://models.inference.ai.azure.com";
const client = ModelClient(endpoint, new AzureKeyCredential(token));

export async function runAzure(
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

  let error: string | undefined;
  let content: string | undefined;
  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: system.systemMessage ?? "" },
        ..._messages,
      ],
      model: model,
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
    },
  });
  type A = typeof response.body;
  type B = Exclude<A, ChatCompletionsOutput>;
  if (response.status !== "200") {
    const body = response.body as B;
    error = body.error.message;
  } else {
    const body = response.body as ChatCompletionsOutput;
    content = body.choices[0].message.content ?? undefined;
  }

  return {
    content,
    error,
  };
}
