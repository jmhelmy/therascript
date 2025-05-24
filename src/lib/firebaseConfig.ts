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

// Initialize all services
export const auth: Auth = getAuth(app);
let fsInstance: Firestore; // Temporary variable for Firestore due to conditional initialization
export const functions: Functions = getFunctions(app);
export const storage: FirebaseStorage = getStorage(app);


if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
  console.log("✅ LOCAL DEVELOPMENT: Emulators enabled. Connecting...");
  try {
    // --- AUTH EMULATOR ---
    if (!auth.emulatorConfig) { 
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        auth.settings.appVerificationDisabledForTesting = true; 
        console.log("Auth emulator configured for http://127.0.0.1:9099 (App Verification Disabled)");
    }
    
    // --- FIRESTORE EMULATOR ---
    console.log("Firestore: Initializing with emulator settings (force long polling).");
    fsInstance = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,    
    });
    connectFirestoreEmulator(fsInstance, "127.0.0.1", 8080);
    console.log("Firestore emulator configured for http://127.0.0.1:8080");
    
    // --- FUNCTIONS EMULATOR ---
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    console.log("Functions emulator configured for http://127.0.0.1:5001");

    // --- STORAGE EMULATOR ---
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    console.log("Storage emulator configured for http://127.0.0.1:9199");

    console.log("All local emulator connection attempts made.");

  } catch (error: unknown) { 
    let errorMessage = "Unknown error during emulator connection.";
    if (error instanceof Error) errorMessage = error.message;
    console.error("Error connecting to local emulators:", errorMessage, error);
  }
} else {
  console.log("🚀 Production mode: Initializing Firebase services for production.");
  fsInstance = getFirestore(app); 
  // No connectEmulator calls needed for production
}

export const firestore = fsInstance; // Export the correctly initialized instance

export default app;