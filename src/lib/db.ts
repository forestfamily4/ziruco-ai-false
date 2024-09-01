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

export const collection = db.collection<{ key: "currentMessage"|"system"; content: string }>("ai");
