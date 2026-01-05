import { NextResponse } from "next/server";

import { connectDB } from "@/lib/connectDB";
import Tokens from "@/models/Tokens";
import { fcm } from "@/lib/firebaseAdmin";
import matches from "@/models/matches";

// Fixed title for all notifications
const FIXED_TITLE = "Rush Arena";

export async function POST(request) {
  try {
    const { message, matchId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    await connectDB();

    // 1. Get all stored device tokens
    // const records = await Tokens.find({});
    // const tokens = records.map((item) => item.token).filter(Boolean);
    if (!matchId) {
      return;
    }
    const match = await matches.findById(matchId);
    const players = match.joinedPlayers;

    const playerId = players.map((player) => player.authId);

    const tokenList = await Tokens.find({
      userId: { $in: playerId },
    });
    const tokens = tokenList.map((item) => item.token);

    if (tokens.length === 0) {
      return NextResponse.json({ error: "No tokens found" }, { status: 404 });
    }

    // 2. Prepare the notification payload
    const payload = {
      notification: {
        title: FIXED_TITLE,
        body: message,
      },
    };

    // 3. Send to all tokens (multicast)
    const response = await fcm.sendEachForMulticast({
      tokens,
      ...payload,
    });
    // console.log(tokens);

    return NextResponse.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (err) {
    console.error("FCM error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
