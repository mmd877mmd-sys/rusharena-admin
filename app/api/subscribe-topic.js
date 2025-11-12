// /pages/api/subscribe-topic.js
import { admin } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token, topic } = req.body;

    if (!token || !topic) {
      return res.status(400).json({ error: "Token and topic are required" });
    }

    try {
      await admin.messaging().subscribeToTopic(token, topic);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to subscribe to topic" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
