import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { city } = req.body;

    const client = await clientPromise;
    const db = client.db("weatherApp");

    await db.collection("cities").insertOne({
      city,
      createdAt: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "DB error" });
  }
}