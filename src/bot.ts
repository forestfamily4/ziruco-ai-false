import { Client, IntentsBitField } from "discord.js";
import { createDebug } from "./lib/createDebug";
import { CommandManager } from "./manager/commands";
import { EventManager } from "./manager/events";
import { connectDb } from "./lib/db";

interface BotConfig {
  prefix: string[];
  botauthor: string[];
}

export class Bot extends Client implements BotConfig {
  prefix: string[];
  commands: CommandManager;
  events: EventManager;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: any;
  isDEV: boolean;
  botauthor: Array<string>;
  userId: string = "";
  constructor(config: BotConfig) {
    super({
      intents: [new IntentsBitField(131071)],
      allowedMentions: { repliedUser: false, users: [], roles: [] },
    });
    this.prefix = config.prefix;
    this.botauthor = config.botauthor;
    this.commands = new CommandManager(this);
    this.events = new EventManager(this);
    this.debug = createDebug(this);

    this.isDEV = !!process.env.ISDEV;
    console.log(this.isDEV ? "これはでヴです" : "これは本番環境です");
  }
  async start() {
    this.commands.loadAll();
    this.events.loadAll();
    await connectDb();
    await this.login();
    this.userId = this.user?.id || "";
  }
}
