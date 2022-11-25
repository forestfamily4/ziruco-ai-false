import { Client, IntentsBitField } from "discord.js";
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
  constructor(config: BotConfig) {
    super({
      intents: [new IntentsBitField(131071)],
      allowedMentions: { repliedUser: false, users: [], roles: [] },
    });
    this.prefix = config.prefix;
    this.commands = new CommandManager(this);
    this.events = new EventManager(this);
    this.debug = createDebug(this);
  }
  async start() {
    this.commands.loadAll();
    this.events.loadAll();
    return await this.login();
  }
}
