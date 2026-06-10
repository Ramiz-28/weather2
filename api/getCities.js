export default async function handler(req, res) {
  try {
    return res.status(200).json({
      message: "API working",
      env: process.env.MONGO_URI ? "ENV FOUND ✅" : "ENV MISSING ❌"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}