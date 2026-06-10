import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  console.log("❌ MONGO_URI missing");
  throw new Error("MONGO_URI is missing");
}

console.log("✅ MONGO_URI FOUND");

let client = new MongoClient(uri);

async function connectDB() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ MongoDB connected");
    return client;
  } catch (error) {
    console.log("❌ MONGO CONNECT ERROR:", error);
    throw error;
  }
}

export default connectDB();