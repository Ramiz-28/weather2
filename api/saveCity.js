import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("weatherDB");

      const { city } = req.body;

      if (!city) {
        return res.status(400).json({ error: "City required" });
      }

      await db.collection("cities").insertOne({ city });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log("SAVE CITY ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // ✅ ADD THIS (VERY IMPORTANT)
  return res.status(405).json({ error: "Method not allowed" });
}