import { Base, BaseManager } from "./base";
import { type Bot } from "../bot";
import events from "../events";

export class Event extends Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(manager: EventManager, module: any) {
    super(manager, module);
    manager.client[module.once ? "once" : "on"](module.name, (...x) =>
      module.exec(...x, this.manager.client),
    );
  }
}

export class EventManager extends BaseManager<Event> {
  constructor(client: Bot) {
    super("events", client);
  }
  async loadAll() {
    events.map((x) => new Event(this, x));
  }
}
