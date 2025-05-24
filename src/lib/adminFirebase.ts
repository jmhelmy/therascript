// src/lib/adminFirebase.ts
import * as admin from 'firebase-admin';

// Path to your service account key JSON file for the Next.js server environment
// For local development: you might point this to a local file path.
// IMPORTANT: DO NOT commit your service account key to your Git repository.
// Use environment variables for production.
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!admin.apps.length) {
  if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' && process.env.FIRESTORE_EMULATOR_HOST) {
    // For local development with Next.js server using emulators
    console.log("🔧 (Next.js Server) Initializing Firebase Admin SDK for EMULATOR use...");
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      // No credential needed if FIRESTORE_EMULATOR_HOST (and other emulator hosts) are set
      // and you are only using emulated services from this Admin SDK instance.
    });
  } else if (serviceAccountPath) {
    console.log("🔧 (Next.js Server) Initializing Firebase Admin SDK with Service Account...");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      // If you use Firebase Storage with Admin SDK in Next.js server:
      // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET 
    });
  } else {
    // Fallback for environments like Vercel/Google Cloud Run with Application Default Credentials
    // or if no specific emulator/service account setup is found for Next.js server.
    console.log("🔧 (Next.js Server) Initializing Firebase Admin SDK with Application Default Credentials (or basic for emulator if FIRESTORE_EMULATOR_HOST is set)...");
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
  }
} else {
  console.log("🔧 (Next.js Server) Firebase Admin SDK already initialized.");
}

const dbAdmin = admin.firestore();
const authAdmin = admin.auth(); // If you need admin auth operations

// If using emulators, ensure this Admin SDK instance also targets them.
// The Admin SDK automatically detects FIRESTORE_EMULATOR_HOST, AUTH_EMULATOR_HOST, etc.
// if they are set in the environment where this Next.js server process runs.
// You typically set these when starting `npm run dev`. Example:
// FIRESTORE_EMULATOR_HOST="127.0.0.1:8080" AUTH_EMULATOR_HOST="127.0.0.1:9099" npm run dev

export { admin as adminServer, dbAdmin, authAdmin };