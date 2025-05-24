"use strict";
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
exports.logClientConsentFunction = void 0;
// functions/src/logClientConsent.ts
const functions = __importStar(require("firebase-functions/v1"));
const adminSdk_1 = require("./common/adminSdk"); // Import adminApp and db
exports.logClientConsentFunction = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        functions.logger.warn("Unauthenticated attempt to log consent.");
        throw new functions.https.HttpsError("unauthenticated", "Authentication required to log consent.");
    }
    const authenticatedTherapistId = context.auth.uid;
    const { consentVersion, sessionId } = data;
    if (typeof consentVersion !== "string" || !consentVersion.trim()) {
        throw new functions.https.HttpsError("invalid-argument", "Consent version must be a non-empty string.");
    }
    const logEntry = {
        therapistId: authenticatedTherapistId,
        consentVersion,
        sessionId: sessionId || `consent_${Date.now()}`,
        timestamp: adminSdk_1.adminApp.firestore.FieldValue.serverTimestamp(), // Use adminApp
    };
    try {
        const docRef = await adminSdk_1.db.collection("consents").add(logEntry);
        functions.logger.info("Consent logged successfully", { logId: docRef.id, therapistId: authenticatedTherapistId, sessionId: logEntry.sessionId });
        return { success: true, message: "Consent logged successfully.", logId: docRef.id };
    }
    catch (error) {
        let errorMessage = "Consent logging failed.";
        if (error instanceof Error)
            errorMessage = error.message;
        functions.logger.error("Consent logging failed for therapist:", authenticatedTherapistId, error);
        throw new functions.https.HttpsError("internal", `Consent logging failed: ${errorMessage}`);
    }
});
