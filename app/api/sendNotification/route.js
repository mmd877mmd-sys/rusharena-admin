import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing text" }),
        { status: 400 }
      );
    }

    const message = {
      notification: {
        title: "Rush Arena",
        body: text,
      },
      topic: "all",
    };

    const response = await admin.messaging().send(message);

    return new Response(JSON.stringify({ success: true, result: response }), {
      status: 200,
    });
  } catch (err) {
    console.error("FCM send error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
