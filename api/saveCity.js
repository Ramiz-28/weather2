import supabase from "../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: "City required" });
    }

    const { error } = await supabase
      .from("cities")
      .insert([{ city }]);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}