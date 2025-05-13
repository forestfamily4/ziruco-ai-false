import { Collection } from "discord.js";
import { type Bot } from "../bot";

export class Base {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  exec: Function;
  path: string;
  manager: BaseManager<Base>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(manager: BaseManager<Base>, module: any) {
    this.name = module.name;
    this.exec = module.exec;
    this.path = module.path;
    manager.set(this.name, this);
    this.manager = manager;
  }
}

export class BaseManager<V extends Base> extends Collection<string, V> {
  client: Bot;
  constructor(path: string, client: Bot) {
    super();
    this.client = client;
  }
}
