"use strict";
// functions/src/index.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logClientConsent = exports.helloWorld = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK only once
if (admin.apps.length === 0) {
    admin.initializeApp();
}
// HTTP function for testing
exports.helloWorld = functions.https.onRequest((req, res) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    res.send("Hello from Firebase Functions!");
});
// Callable function to log client consent
exports.logClientConsent = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }
    const { sessionId, consentVersion } = data;
    if (!sessionId || typeof sessionId !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "sessionId must be a string.");
    }
    const therapistId = context.auth.uid;
    const logEntry = {
        therapistId,
        sessionId,
        consentVersion: consentVersion || "MVP1.0",
        timestamp: admin.firestore.Timestamp.now(),
    };
    try {
        await admin.firestore().collection("consentLogs").add(logEntry);
        functions.logger.info("Logged consent:", logEntry);
        return { success: true, message: "Consent logged." };
    }
    catch (error) {
        functions.logger.error("Consent logging failed", error);
        throw new functions.https.HttpsError("internal", "Logging failed.");
    }
});
