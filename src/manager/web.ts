import { Base, BaseManager } from "./base";
import { getModule } from "../lib/getModule";
import { type Bot } from "../bot";
import { type Application } from "express";

export class Route extends Base {
  constructor(manager: RouteManager, module: any) {
    super(manager, module);
    manager.app.use(module._path, module);
  }
  reload() {
    this.manager.set(
      this.name,
      new Route(this.manager as RouteManager, getModule(this.path))
    );
  }
}

export class RouteManager extends BaseManager<Route> {
  app: Application;
  constructor(client: Bot, app: Application) {
    super("routes", client);
    this.app = app;
  }
  async loadAll() {
    (await this.getAll()).map((x) => new Route(this, x));
  }
}
