import { AttachmentBuilder, Message } from "discord.js";
import { exec as _exec } from "node:child_process";
import { inspect } from "node:util";
import { Bot } from "../../bot";

export async function run(
  message: Message,
  lang: Lang,
  client: Bot,
  code?: string,
) {
  if (!code) return message.channel.send("plz input code.");
  const result = await runCode(code.trim(), lang, message, client);
  if (result.length > 2000) {
    return await message.channel.send({
      files: [
        new AttachmentBuilder(Buffer.from(result), {
          name: `out.${LangFormat[lang]}`,
        }),
      ],
    });
  }
  return await message.channel.send(
    `\`\`\`${LangFormat[lang]}\n${result}\n\`\`\``,
  );
}

export enum Lang {
  JS = "js",
}

export const LangFormat = {
  [Lang.JS]: "js",
} as const;

export async function runCode(
  code: string,
  lang: Lang,
  message: Message,
  client: Bot,
) {
  return Runner[lang](code, message, client);
}

export async function exec(code: string) {
  return new Promise<string>((resolve, reject) =>
    _exec(code, (er, stdout, stderr) =>
      er
        ? reject(
            stderr.trim().length
              ? stderr.trim()
              : (er.stack ?? er.message ?? inspect(er)),
          )
        : resolve(stdout ? (stderr ? `${stdout}\n${stderr}` : stdout) : stderr),
    ),
  );
}

export const Runner = {
  async [Lang.JS](str: string, message: Message, client: Bot) {
    try {
      return await new Promise<string>((resolve) => resolve(eval(str))).then(
        (x) => inspect(x, { depth: 0 }),
      );
    } catch (error: any) {
      return (
        (error as Error).stack ??
        (error as Error).message ??
        String(error) ??
        "errored!!!"
      );
    }
  },
};
