import { writeFileSync, readFileSync } from "fs";

export class cacheMap<K, V> extends Map {
  private cachePath: string = "./cache.json";
  private data = {
    key: [],
    value: [],
  };

  constructor(path: string){
    super();
    this.cachePath=path;
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
  load() {
    this.data = JSON.parse(readFileSync(this.cachePath).toString());
    for (let i = 0; i < this.data.key.length; i++) {
      this.set(this.data.key[i], this.data.value[i]);
    }
  }

  reload() {
    setInterval(() => {
      this.backup();
    }, 1000 * 20);
  }
}
