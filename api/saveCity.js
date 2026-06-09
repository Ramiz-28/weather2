import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("rameezshakeel67_db_user");

      const { city } = req.body;

      if (!city) {
        return res.status(400).json({ error: "City required" });
      }

      await db.collection("cities").insertOne({ city });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log("SAVE CITY ERROR:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // ✅ ADD THIS (VERY IMPORTANT)
  return res.status(405).json({ error: "Method not allowed" });
}