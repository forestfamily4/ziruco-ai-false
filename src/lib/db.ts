import { MongoClient } from "mongodb";

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
  key: "currentMessage" | "system" | "model";
  preset: string;
  content: string;
}>("ai");

export const stateCollection = db.collection<{
  currentPreset: string;
}>("state");

export async function getPreset(){
  const state = await stateCollection.findOne();
  if(!state){
    await stateCollection.insertOne({currentPreset: "0"});
    return "0";
  }
  return state.currentPreset;
}

export async function setPreset(preset:string){
  await stateCollection.updateOne({},{$set:{currentPreset:preset}});
}