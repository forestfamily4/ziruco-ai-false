/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from "discord.js";
export {};

declare module "discord.js" {
  interface Message {
    sendWithTimeout(
      timeout: number,
      content: string,
      callback?: (message: Message) => object,
    ): any;
    replyWithTimeout(
      timeout: number,
      content: string,
      callback?: (message: Message) => object,
    ): any;
    isZiruco(): boolean;
  }
}

Message.prototype.sendWithTimeout = async function (
  timeout: number,
  content: string,
  callback?: (message: Message) => object,
) {
  this.channel.sendTyping();
  setTimeout(async () => {
    this.channel.send(content).then((message) => {
      if (callback) {
        callback(message);
        return;
      }
    });
  }, timeout);
};

Message.prototype.replyWithTimeout = async function (
  timeout: number,
  content: string,
  callback?: (message: Message) => object,
) {
  this.channel.sendTyping();
  setTimeout(async () => {
    this.reply(content).then((message) => {
      if (callback) {
        callback(message);
        return;
      }
    });
  }, timeout);
};

Message.prototype.isZiruco = function () {
  return this.author.id === "742347739018297346";
};
