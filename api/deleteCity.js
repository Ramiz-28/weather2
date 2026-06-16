import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { city } = req.body;

    const { error } = await supabase
      .from("cities")
      .delete()
      .eq("city", city)
      .eq("user_id", user.id); // 🔥 IMPORTANT

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}