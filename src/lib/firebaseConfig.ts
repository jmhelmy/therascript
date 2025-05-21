// src/lib/firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, Functions } from "firebase/functions";
import { getStorage, connectStorageEmulator, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);
export const functions: Functions = getFunctions(app);
export const storage: FirebaseStorage = getStorage(app);

if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  if (typeof window !== 'undefined') {
    // Client-side ngrok URLs
    try {
      const authEmulatorUrl = process.env.NEXT_PUBLIC_NGROK_AUTH!;
      const firestoreEmulatorHost = process.env.NEXT_PUBLIC_NGROK_FIRESTORE!;
      const functionsEmulatorHost = process.env.NEXT_PUBLIC_NGROK_FUNCTIONS!;
      const storageEmulatorHost = process.env.NEXT_PUBLIC_NGROK_STORAGE!;

      console.log(`[🔥] FirebaseConfig (Client): Connecting to emulators via ngrok.`);
      connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
      connectFirestoreEmulator(firestore, firestoreEmulatorHost, 8080);
      connectFunctionsEmulator(functions, functionsEmulatorHost, 5001);
      connectStorageEmulator(storage, storageEmulatorHost, 9199);
      console.log(`[🔥] FirebaseConfig (Client): Emulator connections configured.`);
    } catch (error: any) {
      console.error("[🔥] FirebaseConfig (Client): Error configuring emulators", error);
    }
  } else {
    // Server-side localhost fallback
    const emulatorHost = '127.0.0.1';
    try {
      console.log(`[🔥] FirebaseConfig (Server): Connecting to local emulators.`);
      connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
      connectFirestoreEmulator(firestore, emulatorHost, 8080);
      connectFunctionsEmulator(functions, emulatorHost, 5001);
      connectStorageEmulator(storage, emulatorHost, 9199);
      console.log(`[🔥] FirebaseConfig (Server): Emulator connections configured.`);
    } catch (error: any) {
      console.error("[🔥] FirebaseConfig (Server): Error configuring emulators", error);
    }
  }
} else if (process.env.NODE_ENV === 'development') {
  console.log("[⚠️] FirebaseConfig: Dev mode without emulators — using live Firebase.");
} else {
  console.log("[ℹ️] FirebaseConfig: Production mode — using live Firebase services.");
}

export default app;
