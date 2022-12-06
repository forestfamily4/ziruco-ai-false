import { ZirucoMessage } from './lib/ZirucoMessage';

import { readdir } from "node:fs/promises";
import { Client, Collection, IntentsBitField } from "discord.js";
import { CommandManager } from "./manager/commands";
import { EventManager } from "./manager/events";
import { createDebug } from "./lib/createDebug";
import { cacheMap } from './lib/cacheSystem';

interface BotConfig {
  prefix: string[];
  botauthor: string[];
}

export class Bot extends Client implements BotConfig {
  prefix: string[];
  commands: CommandManager;
  events: EventManager;
  debug: any;
  thinkings: Array<ZirucoMessage>;
  thinkings_cache: cacheMap<string,string>;
  zirucos: Array<ZirucoMessage>;
  zirucos_cache: cacheMap<string,string>;
  isDEV: Boolean;
  others:Array<ZirucoMessage>
  others_cache: cacheMap<string,string>;
  botauthor:Array<string>;
  constructor(config: BotConfig) {
    super({
      intents: [new IntentsBitField(131071)],
      allowedMentions: { repliedUser: false, users: [], roles: [] },
    });
    this.prefix = config.prefix;
    this.botauthor=config.botauthor;
    this.commands = new CommandManager(this);
    this.events = new EventManager(this);
    this.debug = createDebug(this);
    //load thinking directory exec()
    this.thinkings = new Array<any>();
    readdir("./dist/thinkings").then((files) => {
      files.forEach((file) => {
        console.log(file+"読み込み");
        if (!file.endsWith(".js")) return;
        const thinking = require(`./thinkings/${file}`).default as ZirucoMessage
        thinking.name = "thinkings/"+file;
        this.thinkings.push(thinking);
      });
    });

    this.zirucos = new Array<any>();
    readdir("./dist/ziruco").then((files) => {
      files.forEach((file) => {
        console.log(file+"読み込み");
        if (!file.endsWith(".js")) return;
        const ziruco = require(`./ziruco/${file}`).default as ZirucoMessage;
        ziruco.name = "ziruco/"+file;
        this.zirucos.push(ziruco);
      });
    });

    this.others = new Array<any>();
    ["replys"].forEach((path)=>{
      readdir("./dist/"+path).then((files) => {
      files.forEach((file) => {
        console.log(file+"読み込み");
        if (!file.endsWith(".js")) return;
        const other = require(`./${path}/${file}`).default as ZirucoMessage;
        other.name = "others/"+file;
        this.others.push(other);
      })
    });
    })
    const reloadtime:number=process.env.CACHE_TIME?parseInt(process.env.CACHE_TIME):1000*60*60*24*7;
    this.thinkings_cache = new cacheMap<string,string>("cache_thi.json",reloadtime);
    this.zirucos_cache = new cacheMap<string,string>("cache_zir.json",reloadtime);
    this.others_cache = new cacheMap<string,string>("cache_oth.json",reloadtime);
    

    

    this.isDEV=process.env.ISDEV==="true";
    console.log(this.isDEV?"これはでヴです":"これは本番環境です");

  }
  async start() {
    this.commands.loadAll();
    this.events.loadAll();
    await this.thinkings_cache.load();
    await this.zirucos_cache.load();
    await this.others_cache.load();


    this.thinkings_cache.reloadData();
    this.others_cache.reloadData();
    this.zirucos_cache.reloadData();
    return await this.login();
  }

  async cache_thinking(id:string,classname:ZirucoMessage){
    this.thinkings_cache.set(id,classname.name??"a")
  }

  async cache_ziruco(id:string,classname:ZirucoMessage){
    this.zirucos_cache.set(id,classname.name??"a")
  }

  async cache_other(id:string,classname:ZirucoMessage){
    this.others_cache.set(id,classname.name??"a")
  }
}
