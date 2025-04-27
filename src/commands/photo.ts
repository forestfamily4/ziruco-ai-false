import { ChannelType, type Collection, type Message } from "discord.js";

export const name = "photo";

export const description = "";

export const aliases = [];

export const usages = [""];

type Photo = {
  url: string;
  id: string;
  timestamp: number;
};

export async function exec(message: Message, _args: string[], arg: string) {
  const channelId = _args.at(0);
  if (!message.channel.isSendable()) return;
  if (!channelId) {
    return message.channel.send("チャンネルIDを指定してください");
  }
  const channel = message.guild?.channels.cache.get(channelId);
  if (!channel || channel.type !== ChannelType.GuildText) {
    return message.channel.send("チャンネルが見つかりません");
  }
  message.channel.send("取得..");
  let afterChannelId: string | undefined = "0";
  const photos: Photo[] = [];
  while (true) {
    if (!afterChannelId) {
      throw new Error("afterChannelId is undefined");
    }
    console.log(`Fetching messages after ${afterChannelId}`);
    const messages: Collection<string, Message> = await channel.messages.fetch({
      limit: 100,
      after: afterChannelId,
    });
    if (messages.size === 0) {
      break;
    }
    afterChannelId = messages.firstKey();
    console.log(`Found ${messages.size} messages`);
    messages.forEach((m) => {
      const content = m.content;
      //contentに画像のURLが含まれているか
      const regex =
        /(https?:\/\/[^\s]*\.(?:png|jpg|jpeg|gif|mp4|webm|mov|avi|wmv|flv|mkv)(?:\?[^\s]*)?)/gi;
      const match = content.match(regex);
      match?.forEach((url, i) => {
        photos.push({
          url: url,
          id: `${m.id}-${i}`,
          timestamp: m.createdTimestamp,
        });
      });
      m.attachments.forEach((a) => {
        photos.push({
          url: a.url,
          id: a.id,
          timestamp: m.createdTimestamp,
        });
      });
    });
    console.log(`Found ${photos.length} photos`);
  }
  console.log(`Found ${photos.length} photos`);
  message.channel.send(`Found ${photos.length} photos`);
  fs.writeFileSync("./photos.json", JSON.stringify(photos));

  if (message.author.id === "835036688849043468") {
    const failedDownloads: Photo[] = [];
    for (const photo of photos) {
      try {
        await download(photo);
      } catch (e) {
        console.error(e);
        failedDownloads.push(photo);
      }
    }
    fs.writeFileSync("./failedDownloads.json", JSON.stringify(failedDownloads));
    console.error(
      `Failed to download\n ${failedDownloads.map((p) => p.url).join("\n")}`,
    );
  }

  return message.channel.send("完了");
}

import fs from "fs";

async function download(photo: Photo) {
  const date = new Date(photo.timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const folder = `./photos/${year}-${month}-${day}`;
  //"url": "https://cdn.discordapp.com/attachments/963667366863044698/1252429990851645521/IMG20240616084705.jpg?ex=67aaa352&is=67a951d2&hm=9e44b124dfb0469fe601c42ec53316f9302cc1c31d5c7475dee075831cccdcd8&"
  const ext =
    photo.url.split("/").pop()?.split("?")[0]?.split(".").pop() ?? "jpg";
  const filename = `${folder}/${photo.id}.${ext}`;
  //既にあるならスキップ
  if (fs.existsSync(filename)) {
    //console.log(`Skip: ${filename}`);
    return;
  }

  const response = await fetch(photo.url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${filename}`);
  }

  const buffer = await response.arrayBuffer();
  //save buffer to folder depending on date

  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(filename, Buffer.from(buffer));
  console.log(`Saved: ${filename}`);
}
