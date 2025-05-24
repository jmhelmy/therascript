// functions/src/logClientConsent.ts
import * as functions from "firebase-functions/v1";
import { adminApp, db } from "./common/adminSdk"; // Import adminApp and db
import { LogClientConsentData } from "./types"; // LogClientConsentResult might be needed if you define it

export const logClientConsentFunction = functions.https.onCall(
  async (data: LogClientConsentData, context: functions.https.CallableContext) => {
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
      timestamp: adminApp.firestore.FieldValue.serverTimestamp(), // Use adminApp
    };

    try {
      const docRef = await db.collection("consents").add(logEntry);
      functions.logger.info("Consent logged successfully", { logId: docRef.id, therapistId: authenticatedTherapistId, sessionId: logEntry.sessionId });
      return { success: true, message: "Consent logged successfully.", logId: docRef.id };
    } catch (error: unknown) {
      let errorMessage = "Consent logging failed.";
      if (error instanceof Error) errorMessage = error.message;
      functions.logger.error("Consent logging failed for therapist:", authenticatedTherapistId, error);
      throw new functions.https.HttpsError("internal", `Consent logging failed: ${errorMessage}`);
    }
  }
);