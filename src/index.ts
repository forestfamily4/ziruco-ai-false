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
client.token="MTA0NTUxNDk3MDE5ODE4Mzk3Ng.GK_HoR.aYqdZvMt1ipDfYpqhT6SfQ8ouMJMIjEDvdU-lQ";
const server = new Server(client);

const debug = client.debug;

client.start().then(() => server.start());

process.on("uncaughtException", (err) => debug(err));

process.on("unhandledRejection", (err) => debug(err));
