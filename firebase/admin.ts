import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Debug: Check environment variables at module load time
console.log("=== Firebase Admin SDK Environment Check ===");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID ? "SET" : "NOT SET");
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL ? "SET" : "NOT SET");
console.log("FIREBASE_PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "SET" : "NOT SET");
console.log("===========================================");

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  // Check if credentials are available
  const hasCredentials =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

  if (!hasCredentials) {
    console.error("Firebase Admin SDK: Missing credentials", {
      projectId: !!process.env.FIREBASE_PROJECT_ID,
      clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    });
    return {
      auth: null,
      db: null,
    };
  }

  if (!apps.length) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;
      // Handle escaped newlines in the private key
      const formattedPrivateKey = privateKey
        ?.replace(/\\n/g, '\n')
        .replace(/"/g, '')
        .trim();
      
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedPrivateKey,
      };
      
      console.log("Firebase Admin SDK: Initializing with", {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        hasPrivateKey: !!serviceAccount.privateKey,
        privateKeyLength: serviceAccount.privateKey?.length,
      });
      
      initializeApp({
        credential: cert(serviceAccount),
      });
      
      console.log("Firebase Admin SDK: Initialized successfully");
    } catch (error) {
      console.error("Firebase Admin SDK: Initialization failed", error);
      return {
        auth: null,
        db: null,
      };
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
