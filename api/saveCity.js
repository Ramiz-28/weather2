import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔑 Get token
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // 🔐 Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    console.log("USER:", user);

    if (userError || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 📦 Get city
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: "City required" });
    }

    // 💾 Insert with user_id
    const { data, error } = await supabase
      .from("cities")
      .insert([
        {
          city,
          user_id: user.id, // 🔥 REQUIRED
        },
      ])
      .select(); // ✅ helps debug

    if (error) {
      console.log("INSERT ERROR:", error);
      throw error;
    }

    console.log("INSERTED:", data);

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.log("SAVE CITY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}