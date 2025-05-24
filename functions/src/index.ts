// functions/src/index.ts

// 1. Ensure the Storage emulator host is set before any firebase-admin import
//    This tells the Admin SDK to route Storage calls to your local emulator.
process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= "127.0.0.1:9199";

// 2. Initialize the Admin SDK (via our helper) with the correct bucket
import "./common/adminSdk";

// 3. Import Cloud Function handlers
import { logClientConsentFunction } from "./logClientConsent";
import { generateNoteHttpFunction } from "./generateNote";

// 4. Re-export them under the names your client expects
//    These names match the HTTP trigger URLs you'll call from the front-end.
export const logClientConsent = logClientConsentFunction;
export const generateNote      = generateNoteHttpFunction;