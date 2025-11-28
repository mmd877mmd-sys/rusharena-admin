import admin from "firebase-admin";

let app;

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "{}"
  );

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });
} else {
  app = admin.app();
}

export const firebaseAdmin = app;
export const fcm = admin.messaging();
