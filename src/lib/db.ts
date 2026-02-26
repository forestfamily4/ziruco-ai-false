import { MongoClient } from "mongodb";
import dns from "node:dns";
type State = {
  currentPreset: string;
  currentMessageTimestamp: string;
  autoDeleteChannelIds: string[];
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
      autoDeleteChannelIds: [],
    });
    return {
      currentPreset: "0",
      currentMessageTimestamp: "0",
      autoDeleteChannelIds: [],
    };
  }
  const nextState: State = {
    currentPreset: state.currentPreset ?? "0",
    currentMessageTimestamp: state.currentMessageTimestamp ?? "0",
    autoDeleteChannelIds: state.autoDeleteChannelIds ?? [],
  };
  await stateCollection.updateOne({}, { $set: nextState }, { upsert: true });
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

export async function addAutoDeleteChannel(channelId: string) {
  await stateCollection.updateOne(
    {},
    { $addToSet: { autoDeleteChannelIds: channelId } },
    { upsert: true },
  );
}

export async function isAutoDeleteChannel(channelId: string): Promise<boolean> {
  return (await getState()).autoDeleteChannelIds.includes(channelId);
}

export async function removeAutoDeleteChannel(channelId: string) {
  await stateCollection.updateOne(
    {},
    { $pull: { autoDeleteChannelIds: channelId } },
    { upsert: true },
  );
}

