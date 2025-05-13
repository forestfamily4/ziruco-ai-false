import { type Bot } from "../bot";
import commands from "../commands";
import { Base, BaseManager } from "./base";

export class Command extends Base {
  usages: string[];
  aliases: string[];
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(manager: CommandManager, module: any) {
    super(manager, module);
    this.usages = module.usages;
    this.aliases = module.aliases;
    this.description = module.description;
  }
}

export class CommandManager extends BaseManager<Command> {
  constructor(client: Bot) {
    super("commands", client);
  }
  async loadAll() {
    commands.map((x) => new Command(this, x));
  }
}
