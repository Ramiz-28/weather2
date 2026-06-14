import supabase from "../lib/supabase.js";

export default async function handler(req, res) {
  try {
    const { city } = req.body;

    const { error } = await supabase
      .from("cities")
      .delete()
      .eq("city", city);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}