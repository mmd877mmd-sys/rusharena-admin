import admin from "firebase-admin";
import path from "path";

// Resolve the path to your JSON file
const serviceAccountPath = path.resolve("../firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

export default admin;
