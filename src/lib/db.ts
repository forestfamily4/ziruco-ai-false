import { MongoClient } from "mongodb";
import dns from "node:dns";

export const DEFAULT_AUTODELETE_MS = 24 * 60 * 60 * 1000;
type AutoDeleteChannel = {
  channelId: string;
  deleteAfterMs: number;
};

type State = {
  currentPreset: string;
  currentMessageTimestamp: string;
  autoDeleteChannels: AutoDeleteChannel[];
  autoDeleteChannelIds?: string[];
};

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

// Some local resolvers refuse SRV queries used by mongodb+srv.
// Force reliable public resolvers unless overridden.
if (process.env.MONGO_DNS_SERVERS) {
  dns.setServers(
    process.env.MONGO_DNS_SERVERS.split(",").map((v) => v.trim()),
  );
} else {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}
const client = new MongoClient(process.env.MONGO_URI);
client.on("error", console.error);
client.on("open", () => {
  console.log("Connected to MongoDB");
});
export const db = client.db("zrai");

export async function connectDb() {
  await client.connect();
}

export const collection = db.collection<{
  key: "system" | "model";
  preset: string;
  content: string;
}>("ai");

export const stateCollection = db.collection<State>("state");

async function getState(): Promise<State> {
  const state = await stateCollection.findOne();
  if (!state) {
    await stateCollection.insertOne({
      currentPreset: "0",
      currentMessageTimestamp: "0",
      autoDeleteChannels: [],
    });
    return {
      currentPreset: "0",
      currentMessageTimestamp: "0",
      autoDeleteChannels: [],
    };
  }
  const legacyIds = state.autoDeleteChannelIds ?? [];
  const autoDeleteMap = new Map<string, number>();
  for (const config of state.autoDeleteChannels ?? []) {
    if (!config?.channelId) continue;
    if (!Number.isFinite(config.deleteAfterMs) || config.deleteAfterMs <= 0) {
      continue;
    }
    autoDeleteMap.set(config.channelId, config.deleteAfterMs);
  }
  for (const channelId of legacyIds) {
    if (!autoDeleteMap.has(channelId)) {
      autoDeleteMap.set(channelId, DEFAULT_AUTODELETE_MS);
    }
  }
  const nextState: State = {
    currentPreset: state.currentPreset ?? "0",
    currentMessageTimestamp: state.currentMessageTimestamp ?? "0",
    autoDeleteChannels: Array.from(autoDeleteMap, ([channelId, deleteAfterMs]) => ({
      channelId,
      deleteAfterMs,
    })),
  };
  await stateCollection.updateOne(
    {},
    { $set: nextState, $unset: { autoDeleteChannelIds: "" } },
    { upsert: true },
  );
  return nextState;
}

export async function getPreset(): Promise<string> {
  return (await getState()).currentPreset;
}

export async function getCurrentMessageTimestamp(): Promise<number> {
  const t = (await getState()).currentMessageTimestamp;
  const num = Number(t);
  if (Number.isNaN(num)) {
    setCurrentMessageTimestamp("0");
    return NaN;
  }
  return num;
}

export async function setPreset(preset: string) {
  await stateCollection.updateOne({}, { $set: { currentPreset: preset } });
}

export async function setCurrentMessageTimestamp(timestamp: string) {
  await stateCollection.updateOne(
    {},
    { $set: { currentMessageTimestamp: timestamp } },
  );
}

export async function setAutoDeleteChannel(channelId: string, deleteAfterMs: number) {
  const state = await getState();
  const autoDeleteChannels = state.autoDeleteChannels.filter(
    (config) => config.channelId !== channelId,
  );
  autoDeleteChannels.push({ channelId, deleteAfterMs });
  await stateCollection.updateOne(
    {},
    { $set: { autoDeleteChannels } },
    { upsert: true },
  );
}

export async function isAutoDeleteChannel(channelId: string): Promise<boolean> {
  return (await getState()).autoDeleteChannels.some(
    (config) => config.channelId === channelId,
  );
}

export async function getAutoDeleteMs(channelId: string): Promise<number | null> {
  const config = (await getState()).autoDeleteChannels.find(
    (entry) => entry.channelId === channelId,
  );
  return config?.deleteAfterMs ?? null;
}

export async function removeAutoDeleteChannel(channelId: string) {
  await stateCollection.updateOne(
    {},
    { $pull: { autoDeleteChannels: { channelId } } },
    { upsert: true },
  );
}

