declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI?: string;
    DISCORD_TOKEN?: string;
    CACHE_TIME?: string;
    ISDEV?: boolean;
    GITHUB_TOKEN?: string;
  }
}
