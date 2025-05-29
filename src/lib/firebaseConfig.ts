// src/lib/firebaseConfig.ts

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, initializeFirestore, Firestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, Functions } from "firebase/functions";
import { getStorage, connectStorageEmulator, FirebaseStorage } from "firebase/storage";

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfigValues);

// Initialize core services
export const auth: Auth = getAuth(app);
export const functions: Functions = getFunctions(app);
export const storage: FirebaseStorage = getStorage(app);

let fsInstance: Firestore;

// Conditional emulator setup
if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
  // Auth emulator
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  auth.settings.appVerificationDisabledForTesting = true;

  // Firestore emulator
  fsInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
  });
  connectFirestoreEmulator(fsInstance, "127.0.0.1", 8080);

  // Functions emulator
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);

  // Storage emulator
  connectStorageEmulator(storage, "127.0.0.1", 9199);
} else {
  // Production Firestore
  fsInstance = getFirestore(app);
}

export const firestore = fsInstance;
export default app;
