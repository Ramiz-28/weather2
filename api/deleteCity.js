import clientPromise from "/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { city } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("weatherApp");

    await db.collection("cities").deleteOne({ city });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
}