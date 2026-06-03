import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("weatherDB");

    const cities = await db.collection("cities").find({}).toArray();

    res.status(200).json(cities);
  } catch (error) {
    console.log("GET CITIES ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
}