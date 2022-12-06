import { writeFileSync, readFileSync,existsSync } from "fs";

export class cacheMap<K, V> extends Map {
  private cachePath: string = "./cache.json";
  private data = {
    key: [],
    value: [],
  };
  private reloadtime:number=0

  constructor(path: string, reloadtime:number) {
    super();
    this.cachePath=path;
    this.reloadtime=reloadtime;
  }
  set(key: any, value: any): this {
    super.set(key, value);
    this.data.key.push(key as string as never);
    this.data.value.push(value as string as never);
    return this;
  }

  backup() {
    writeFileSync(this.cachePath, JSON.stringify(this.data));
  }
  async load() {
    if(!existsSync(this.cachePath))return;
    this.data = JSON.parse(readFileSync(this.cachePath).toString());
    for (let i = 0; i < this.data.key.length; i++) {
      this.set(this.data.key[i], this.data.value[i]);
    }
  }

  reloadData() {
    setInterval(() => {
      this.backup();
    }, this.reloadtime);
  }
}
