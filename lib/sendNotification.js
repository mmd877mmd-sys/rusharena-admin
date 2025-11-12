import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });
}

export async function sendGlobalNotification(title, body) {
  // Hardcoded logo
  const image = "https://www.rusharena.club/images/logo.jpg";

  const message = {
    topic: "all_users", // broadcast topic
    notification: {
      title: String(title),
      body: String(body),
      image,
    },
    android: {
      notification: {
        title: String(title),
        body: String(body),
        image,
      },
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: String(title),
            body: String(body),
          },
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image,
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Broadcast sent:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Notification error:", error);
    return { success: false, error: error.message };
  }
}
