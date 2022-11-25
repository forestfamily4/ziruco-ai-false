import express from "express";
import { type Bot } from "../bot";
import { RouteManager } from "../manager/web";

export class Server {
  app: express.Application;
  client?: Bot;
  manager: RouteManager;
  constructor(client: Bot) {
    this.client = client;
    this.app = express();
    this.manager = new RouteManager(this.client, this.app);
  }
  async start() {
    await this.manager.loadAll();
    return this.app.listen(3344);
  }
}
