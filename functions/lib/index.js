"use strict";
// functions/src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNote = exports.logClientConsent = void 0;
// 1. Ensure the Storage emulator host is set before any firebase-admin import
//    This tells the Admin SDK to route Storage calls to your local emulator.
process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= "127.0.0.1:9199";
// 2. Initialize the Admin SDK (via our helper) with the correct bucket
require("./common/adminSdk");
// 3. Import Cloud Function handlers
const logClientConsent_1 = require("./logClientConsent");
const generateNote_1 = require("./generateNote");
// 4. Re-export them under the names your client expects
//    These names match the HTTP trigger URLs you'll call from the front-end.
exports.logClientConsent = logClientConsent_1.logClientConsentFunction;
exports.generateNote = generateNote_1.generateNoteHttpFunction;
