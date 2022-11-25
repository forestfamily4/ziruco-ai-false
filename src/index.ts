/*declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV?: "development";
      readonly PREFIX: string;
      readonly DISCORD_TOKEN: string;
    }
  }
}
*/
require("dotenv").config();

import { Bot } from "./bot";
import { Server } from "./web/server";

const client = new Bot({ prefix: ["z!"] });
client.token=process.env.DISCORD_TOKEN??"";
const server = new Server(client);

const debug = client.debug;

client.start().then(() => server.start());

process.on("uncaughtException", (err) => debug(err));

process.on("unhandledRejection", (err) => debug(err));
