import { connectDB } from "@/lib/connectDB";
import admin from "@/lib/firebaseAdmin";
import Tokens from "@/models/Tokens";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Title and message are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to DB
    await connectDB();

    // Get all tokens
    const tokens = await Tokens.find().select("token -_id");
    const tokenList = tokens.map((t) => t.token);

    if (tokenList.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No tokens found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create message payload
    const payload = {
      notification: {
        title,
        body: message,
      },
    };

    // Send notification
    const response = await admin.messaging().sendToDevice(tokenList, payload);

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending notification:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
