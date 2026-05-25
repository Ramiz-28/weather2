// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

const options = {};

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("Please add MONGO_URI");
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;