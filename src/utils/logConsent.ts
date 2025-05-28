import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

/**
 * Logs therapist consent prior to recording.
 * @param consentVersion A string like "v1.0"
 * @param sessionId Optional session ID to associate with the consent
 */
export async function logConsent(consentVersion: string, sessionId?: string): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be signed in to log consent.");
  }

  const functions = getFunctions();
  const logConsentFn = httpsCallable(functions, "logClientConsent");

  const result = await logConsentFn({
    consentVersion,
    sessionId: sessionId || `session_${Date.now()}`,
  });

  if (!result.data || !(result.data as any).success) {
    throw new Error("Consent logging failed.");
  }

  console.log("✅ Consent logged:", result.data);
}
