// functions/src/common/adminSdk.ts
import admin from "firebase-admin"; // Use the namespaced import
import * as functions from "firebase-functions/v1"; // For functions.config()

// Initialize Admin SDK exactly once
if (!admin.apps.length) {
  // Attempt to get storageBucket from Firebase config, fallback to your project's default
  const firebaseProjectConfig = functions.config().firebase || {};
  const bucketName = firebaseProjectConfig.storageBucket || "therascript-45b62.appspot.com"; // Your default

  admin.initializeApp({
    storageBucket: bucketName,
    // projectId: firebaseProjectConfig.projectId, // Usually auto-detected
  });
  console.log("🔧 Admin SDK initialized (namespaced). Using storageBucket:", admin.app().options.storageBucket);
} else {
  console.log("🔧 Admin SDK already initialized (namespaced). Using storageBucket:", admin.app().options.storageBucket);
}

// Export the initialized admin instance (as adminApp for clarity if you prefer)
// and specific services for convenience.
export const adminApp = admin;
export const db = admin.firestore();
export const defaultBucket = admin.storage().bucket();