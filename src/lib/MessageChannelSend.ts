import { Message } from "discord.js";

/*
export  class MessageChannelSend {
  public static async SendWithTimeout(message: Message, timeout: number) {
    message.channel.sendTyping();
    setTimeout(async () => {}, timeout);
  }
}
*/
export {};

declare module "discord.js" {
  interface Message {
    sendWithTimeout(timeout: number,content:string): Promise<Message>;
  }  
  
}

Message.prototype.sendWithTimeout = async function (timeout: number,content:string) {
    this.channel.sendTyping();
    setTimeout(async () => {
      return await this.channel.send(content);
    }, timeout);
    return this;
  };

