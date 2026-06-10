import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  try {
    console.log("API HIT"); // 👈 ADD THIS

    const client = await clientPromise;
    console.log("Mongo connected"); // 👈 ADD THIS

    const db = client.db("weatherDB");

    const cities = await db.collection("cities").find({}).toArray();

    res.status(200).json(cities);
  } catch (error) {
    console.log("GET CITIES ERROR:", error); // 👈 IMPORTANT
    res.status(500).json({ error: error.message });
  }
}