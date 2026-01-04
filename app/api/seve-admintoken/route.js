import { connectDB } from "@/lib/connectDB";
import adminTokens from "@/models/adminTokens";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const result = await adminTokens.findOneAndUpdate(
      { token }, // find by token
      {
        $setOnInsert: { token }, // insert only if not exists
      },
      {
        upsert: true,
        new: false, // false → tells us if it already existed
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: result ? "Token already exists" : "New token saved",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error saving token:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
