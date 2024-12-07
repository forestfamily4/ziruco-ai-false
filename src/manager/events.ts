import { Base, BaseManager } from "./base";
import { getModule } from "../lib/getModule";
import { type Bot } from "../bot";

export class Event extends Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(manager: EventManager, module: any) {
    super(manager, module);
    manager.client[module.once ? "once" : "on"](module.name, (...x) =>
      module.exec(...x, this.manager.client),
    );
  }
  reload() {
    this.manager.set(
      this.name,
      new Event(this.manager as EventManager, getModule(this.path)),
    );
  }
}

export class EventManager extends BaseManager<Event> {
  constructor(client: Bot) {
    super("events", client);
  }
  async loadAll() {
    (await this.getAll()).map((x) => new Event(this, x));
  }
}
