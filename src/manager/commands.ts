import { type Bot } from "../bot";
import { getModule } from "../lib/getModule";
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
  reload() {
    this.manager.set(
      this.name,
      new Command(this.manager as CommandManager, getModule(this.path)),
    );
  }
}

export class CommandManager extends BaseManager<Command> {
  constructor(client: Bot) {
    super("commands", client);
  }
  async loadAll() {
    (await this.getAll()).map((x) => new Command(this, x));
  }
}
