import { MongoClient } from "mongodb";
type State = {
  currentPreset: string;
  currentMessageTimestamp: string;
};

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
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
    });
    return { currentPreset: "0", currentMessageTimestamp: "0" };
  }
  return state;
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
