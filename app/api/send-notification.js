// /pages/api/send-notification.js
import { admin } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    try {
      const message = {
        notification: { title, body },
        topic: "all-users", // this sends to all devices subscribed
      };

      const response = await admin.messaging().send(message);
      res.status(200).json({ success: true, response });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send notification" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
