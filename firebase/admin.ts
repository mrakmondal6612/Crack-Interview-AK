import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  // Check if credentials are available
  const hasCredentials =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

  if (!apps.length && hasCredentials) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace newlines in the private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    } catch (error) {
      console.warn("⚠️  Firebase Admin SDK initialization failed:", error);
    }
  }

  try {
    return {
      auth: getAuth(),
      db: getFirestore(),
    };
  } catch (error) {
    console.warn(
      "⚠️  Firebase Admin SDK not initialized. Using fallback mode."
    );
    // Return null objects to prevent crashes
    return {
      auth: null,
      db: null,
    };
  }
}

export const { auth, db } = initFirebaseAdmin();
