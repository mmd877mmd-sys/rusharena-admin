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

    await connectDB();

    const tokens = await Tokens.find().select("token -_id");
    const tokenList = tokens.map((t) => t.token);

    if (tokenList.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No tokens found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use sendMulticast for multiple tokens
    const messagePayload = {
      notification: { title, body: message },
      tokens: tokenList,
    };

    const response = await admin.messaging().sendMulticast(messagePayload);

    // Optionally: remove invalid tokens
    // const invalidTokens = response.responses
    //   .map((resp, idx) => (!resp.success ? tokenList[idx] : null))
    //   .filter(Boolean);

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
