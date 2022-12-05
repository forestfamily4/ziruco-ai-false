import { readdir } from "node:fs/promises";
import { Client, Collection, IntentsBitField } from "discord.js";
import { CommandManager } from "./manager/commands";
import { EventManager } from "./manager/events";
import { createDebug } from "./lib/createDebug";

interface BotConfig {
  prefix: string[];
}

export class Bot extends Client implements BotConfig {
  prefix: string[];
  commands: CommandManager;
  events: EventManager;
  debug: any;
  thinkings: Array<any>;
  zirucos: Array<any>;
  isDEV: Boolean;
  author:Array<string>;
  constructor(config: BotConfig) {
    super({
      intents: [new IntentsBitField(131071)],
      allowedMentions: { repliedUser: false, users: [], roles: [] },
    });
    this.prefix = config.prefix;
    this.author=config.author;
    this.commands = new CommandManager(this);
    this.events = new EventManager(this);
    this.debug = createDebug(this);
    //load thinking directory exec()
    this.thinkings = new Array<any>();
    readdir("./dist/thinkings").then((files) => {
      files.forEach((file) => {
        console.log(file);
        if (!file.endsWith(".js")) return;
        const thinking = require(`./thinkings/${file}`);
        this.thinkings.push(thinking);
      });
    });

    this.zirucos = new Array<any>();
    readdir("./dist/ziruco").then((files) => {
      files.forEach((file) => {
        console.log(file);
        if (!file.endsWith(".js")) return;
        const ziruco = require(`./ziruco/${file}`);
        this.zirucos.push(ziruco);
      });
    });

    this.isDEV=process.env.ISDEV==="true";
    console.log(this.isDEV);
  }
  async start() {
    this.commands.loadAll();
    this.events.loadAll();
    return await this.login();
  }
}
