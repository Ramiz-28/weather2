import supabase from "../lib/supabase.js";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("cities")
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}