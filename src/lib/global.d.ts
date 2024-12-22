declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI?: string;
    DISCORD_TOKEN?: string;
    CACHE_TIME?: string;
    ISDEV?: boolean;
    GITHUB_TOKEN?: string;
    OPENWEBUI_URL?: string;
    OPENWEBUI_TOKEN?: string;
    CEREBRAS_API_KEY?: string;
    GEMINI_API_KEY?: string;
  }
}
