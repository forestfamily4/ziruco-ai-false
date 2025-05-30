import OpenAI from "openai";
import {
  ChatCompletionContentPart,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { Answer, Model, System } from "./api";

const endpoint = "https://models.github.ai/inference";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: process.env.GITHUB_TOKEN,
});

export async function runGitHubOpenAI(
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
  const tool: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "get_result",
        description: system.systemMessage ?? "",
        parameters: {
          type: "object",
          properties: {
            reaction: {
              type: "string",
              description:
                "リアクションの絵文字。リアクションをしたくない場合は空文字列を指定すること。",
              examples: ["👍", "👎", "😄", "😢", "😡", "😱"],
            },
            response: {
              type: "string",
              description: "AIの返答。",
            },
          },
        },
      },
    },
  ];
  let response: string | undefined = undefined;
  let reaction: string | undefined = undefined;
  let errorMessage = "error";
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "user", content: system.systemMessage ?? "" },
        ..._messages,
      ],
      model: model,
      tools: tool,
    });
    type ToolCall = {
      reaction: string;
      response: string;
    };
    const res_tool = chatCompletion?.choices[0].message.tool_calls?.at(0);
    if (!res_tool) {
      throw new Error("no tool call");
    }
    const tool_parsed = JSON.parse(res_tool.function.arguments) as ToolCall;
    response = tool_parsed.response;
    reaction = tool_parsed.reaction;
  } catch (e: unknown) {
    errorMessage = String(e);
  }
  return {
    content: response,
    reaction: reaction,
    error: errorMessage,
  };
}
