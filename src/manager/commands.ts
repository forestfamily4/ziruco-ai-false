import { type Bot } from "../bot";
import { getModule } from "../lib/getModule";
import { Base, BaseManager } from "./base";

export class Command extends Base {
  constructor(manager: CommandManager, module: any) {
    super(manager, module);
  }
  reload() {
    this.manager.set(
      this.name,
      new Command(this.manager as CommandManager, getModule(this.path))
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
