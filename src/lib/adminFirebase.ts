// src/lib/adminFirebase.ts

import * as admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const serviceAccountKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!admin.apps.length) {
  // Use local emulators if any emulator host is set
  if (
    process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.FIREBASE_STORAGE_EMULATOR_HOST
  ) {
    admin.initializeApp({ projectId, storageBucket });
  }
  // Use service account key if provided
  else if (serviceAccountKeyPath) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKeyPath),
      storageBucket,
    });
  }
  // Fallback to Application Default Credentials
  else {
    admin.initializeApp({ projectId, storageBucket });
  }
}

export const dbAdmin = admin.firestore();
export const authAdmin = admin.auth();
export const storageAdmin = admin.storage();