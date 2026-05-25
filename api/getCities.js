import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("weatherApp");

    const cities = await db
      .collection("cities")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
}