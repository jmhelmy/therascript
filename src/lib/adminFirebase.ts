// src/lib/adminFirebase.ts
console.log(
  '🔥 ENV vars:', 
  'FIRESTORE_EMULATOR_HOST=', process.env.FIRESTORE_EMULATOR_HOST,
  'FIREBASE_AUTH_EMULATOR_HOST=', process.env.FIREBASE_AUTH_EMULATOR_HOST
);


import * as admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const serviceAccountKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!admin.apps.length) {
  // 1) LOCAL EMULATORS
  if (process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
    console.log(
      '🔧 (Next.js Server) Initializing Firebase Admin SDK for EMULATOR use. ' +
      'Ensure FIRESTORE_EMULATOR_HOST, FIREBASE_AUTH_EMULATOR_HOST, etc. are set.'
    );
    admin.initializeApp({ projectId, storageBucket });
  }
  // 2) SERVICE ACCOUNT (local or CI)
  else if (serviceAccountKeyPath) {
    console.log('🔧 (Next.js Server) Initializing Firebase Admin SDK with Service Account.');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKeyPath),
      storageBucket,
    });
  }
  // 3) PROD / ADC
  else {
    console.log(
      '🔧 (Next.js Server) Initializing Firebase Admin SDK with Application Default Credentials.'
    );
    admin.initializeApp({ projectId, storageBucket });
  }
} else {
  console.log('🔧 (Next.js Server) Firebase Admin SDK already initialized.');
}

export const dbAdmin = admin.firestore();
export const authAdmin = admin.auth();
export const storageAdmin = admin.storage();
