import { Message } from "discord.js";
export {};

declare module "discord.js" {
  interface Message {
    sendWithTimeout(
      timeout: number,
      content: string,
      callback?: (message: Message) => {},
    ): any;
    replyWithTimeout(
      timeout: number,
      content: string,
      callback?: (message: Message) => {},
    ): any;
    isZiruco(): Boolean;
  }
}

Message.prototype.sendWithTimeout = async function (
  timeout: number,
  content: string,
  callback?: (message: Message) => {},
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
  callback?: (message: Message) => {},
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
