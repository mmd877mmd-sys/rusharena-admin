import { connectDB } from "@/lib/connectDB";
import admin from "@/lib/firebaseAdmin";
import Tokens from "@/models/Tokens";

export async function POST(request) {
  try {
    const { title, message } = await request.json();

    if (!title || !message)
      return new Response(
        JSON.stringify({
          success: false,
          message: "Title and message required",
        }),
        { status: 400 }
      );

    await connectDB();

    const tokens = await Tokens.find().select("token -_id");
    const tokenList = tokens.map((t) => t.token);

    if (!tokenList.length)
      return new Response(
        JSON.stringify({ success: false, message: "No tokens found" }),
        { status: 400 }
      );

    const response = await admin.messaging().sendMulticast({
      tokens: tokenList,
      notification: { title, body: message },
    });

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error sending notification:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
