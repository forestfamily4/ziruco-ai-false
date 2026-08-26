import z from "zod";
import { Model, System, Answer } from "./api";
import { Codex } from "@openai/codex-sdk";
import { existsSync, readdirSync, readlinkSync } from "node:fs";
import { basename, join } from "node:path";

existsSync("/codex-home/packages/standalone") || console.log("codex-home not found. Please mount your codex-home to /codex-home");
const path=join("/codex-home/packages/standalone/releases",basename(readlinkSync("/codex-home/packages/standalone/current")),"bin","codex");
console.log("codex path:",path);

const codex = new Codex({
  codexPathOverride: path,
  config: {
    features: {
      shell_tool: false,
      multi_agent: false,
    },
  },
});
const thread = codex.startThread({
  approvalPolicy: "never",
  sandboxMode: "read-only",
  model: "gpt-5.6-sol",
});

export async function runCodex(
  model: Model,
  messages: { username: string; content: string; timestamp: number }[],
  system: System,
): Promise<Answer> {
  const _messages = messages
    .map(
      (message) =>
        `name:${message.username} timestamp:${message.timestamp} content:${message.content}`,
    )
    .join("\n");
  let response: Awaited<ReturnType<typeof thread.run>> | null = null;
  let errorMessage = "error";
  try {
    const schema = {
      type: "object",
      properties: {
        content: { type: "string" },
        reaction: { type: "string" },
      },
      required: ["content", "reaction"],
      additionalProperties: false,
    } as const;
    response = await thread.run(system.systemMessage + _messages, {
      outputSchema: schema,
    });
    console.log(response);
  } catch (e: unknown) {
    errorMessage = String(e);
  }
  const r = JSON.parse(response?.finalResponse ?? "{}") as {
    content?: string;
    reaction?: string;
  };
  return {
    content: r.content ?? undefined,
    reaction: r.reaction ?? undefined,
    error: errorMessage,
  };
}
