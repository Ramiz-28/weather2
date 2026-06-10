import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("weatherDB");

      const { city } = req.body;

      await db.collection("cities").deleteOne({ city });

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}