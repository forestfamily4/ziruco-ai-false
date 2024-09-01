import { Collection } from "discord.js";
import { resolve, join } from "node:path";
import { readdir } from "node:fs/promises";
import { getModule } from "../lib/getModule";
import { type Bot } from "../bot";

export class Base {
  name: string;
  exec: Function;
  path: string;
  manager: BaseManager<Base>;
  constructor(manager: BaseManager<Base>, module: any) {
    this.name = module.name;
    this.exec = module.exec;
    this.path = module.path;
    manager.set(this.name, this);
    this.manager = manager;
  }
}

export class BaseManager<V extends Base> extends Collection<string, V> {
  path: string;
  client: Bot;
  constructor(path: string, client: Bot) {
    super();
    this.path = resolve(
      `./${process.env.NODE_ENV === "development" ? "src" : "dist"}/${path}`,
    );
    this.client = client;
  }
  async getAll() {
    return (await readdir(this.path))
      .map((x) => join(this.path, x))
      .map((x) => getModule(x));
  }
}
