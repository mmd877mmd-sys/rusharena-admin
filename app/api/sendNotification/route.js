import admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
      fs.readFileSync(
        path.join(process.cwd(), "firebase-service-account.json"),
        "utf8"
      )
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text)
      return new Response(
        JSON.stringify({ success: false, message: "Missing text" }),
        { status: 400 }
      );

    const message = {
      notification: {
        title: "Rush Arena",
        body: text,
      },
      topic: "all", // ✅ Send to all devices subscribed to topic "all"
    };

    const response = await admin.messaging().send(message);

    return new Response(JSON.stringify({ success: true, result: response }), {
      status: 200,
    });
  } catch (err) {
    console.error("FCM send error", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
