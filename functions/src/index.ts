// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";
// import path from "path"; // Not currently used, can remove if not needed later

// Initialize Firebase Admin SDK ONCE.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const gcs = new Storage(); // Renamed for clarity to avoid conflict with Firebase Storage Client SDK if ever used
// Get the default storage bucket associated with your Firebase project
const defaultBucket = admin.storage().bucket(); // Simpler way to get the default bucket

// --- Secure API Key Management (Reminder) ---
// These will be set via Firebase CLI:
// firebase functions:config:set openai.apikey="YOUR_AZURE_OPENAI_KEY" openai.endpoint="YOUR_AZURE_OPENAI_ENDPOINT" openai.deploymentname="YOUR_AZURE_OPENAI_DEPLOYMENT_NAME"
// firebase functions:config:set assemblyai.apikey="YOUR_ASSEMBLYAI_API_KEY"
// Access them like: functions.config().openai.apikey

// Define interfaces for callable function data payloads
interface LogClientConsentData {
  // therapistId is derived from context.auth.uid on the backend for security
  consentVersion: string;
  sessionId?: string; // Optional: if client wants to pass a session identifier for the log
}

interface GenerateNoteData {
  audioFileName: string; // Full path in Firebase Storage, e.g., sessions/therapistId/uuid.webm
  sessionDate: number; // Timestamp in milliseconds from client
}

// ----- logClientConsent Callable Function -----
export const logClientConsent = functions.https.onCall(
  async (data: LogClientConsentData, context: functions.https.CallableContext) => {
    if (!context.auth) {
      functions.logger.warn("Unauthenticated attempt to log consent.");
      throw new functions.https.HttpsError("unauthenticated", "Authentication required to log consent.");
    }

    const authenticatedTherapistId = context.auth.uid;
    const { consentVersion, sessionId } = data; // sessionId is now optional based on interface

    if (typeof consentVersion !== "string" || consentVersion.trim() === "") {
      throw new functions.https.HttpsError("invalid-argument", "Consent version must be a non-empty string.");
    }

    // Note: The client-sent `therapistId` check was removed from data as we rely on context.auth.uid

    const logEntry = {
      therapistId: authenticatedTherapistId,
      consentVersion,
      sessionId: sessionId || `consent_${Date.now()}`, // Use provided sessionId or generate one for the log
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      const docRef = await db.collection("consents").add(logEntry);
      functions.logger.info("Consent logged successfully", { logId: docRef.id, therapistId: authenticatedTherapistId, sessionId: logEntry.sessionId });
      return { success: true, message: "Consent logged successfully.", logId: docRef.id };
    } catch (error) {
      functions.logger.error("Consent logging failed for therapist:", authenticatedTherapistId, error);
      throw new functions.https.HttpsError("internal", "Consent logging failed. Please try again.");
    }
  }
);

// ----- generateNote Callable Function -----
export const generateNote = functions.https.onCall(
  async (data: GenerateNoteData, context: functions.https.CallableContext) => {
    if (!context.auth) {
      functions.logger.warn("Unauthenticated attempt to generate note.");
      throw new functions.https.HttpsError("unauthenticated", "Authentication required to generate note.");
    }

    const therapistId = context.auth.uid;
    const { audioFileName, sessionDate } = data;

    // Validate inputs
    if (!audioFileName || typeof audioFileName !== "string" || audioFileName.trim() === "") {
      throw new functions.https.HttpsError("invalid-argument", "Valid audioFileName is required.");
    }
    if (typeof sessionDate !== "number" || sessionDate <= 0) {
      throw new functions.https.HttpsError("invalid-argument", "Valid sessionDate (Unix timestamp in ms) is required.");
    }

    functions.logger.info(`Starting generateNote for therapist: ${therapistId}, audioFile: ${audioFileName}`);

    const file = defaultBucket.file(audioFileName); // Use the default bucket reference
    let audioBuffer: Buffer;

    // 1. Download Audio from Firebase Storage
    try {
      const [fileContents] = await file.download();
      audioBuffer = fileContents;
      functions.logger.info(`Audio file downloaded successfully: ${audioFileName}`, { therapistId });
    } catch (error) {
      functions.logger.error(`Failed to download audio file: ${audioFileName} for therapist: ${therapistId}`, error);
      throw new functions.https.HttpsError("internal", "Failed to download audio for processing. Please try again.");
    }

    // 2. Transcription
    let transcript: string = ""; // Initialize to prevent potential issues
    try {
      // TODO: Replace with actual API call to Azure OpenAI Whisper or AssemblyAI
      // Ensure you use functions.config().your_service.apikey for secure key management
      // Example: const transcriptionResult = await callTranscriptionService(audioBuffer, functions.config().assemblyai.apikey);
      // transcript = transcriptionResult.text;

      // TEMP: Dummy transcript for MVP development - REMOVE FOR PRODUCTION
      transcript = `Client discussed feelings of anxiety regarding work pressures. Mentioned difficulty sleeping for the past three nights. Expressed interest in learning new coping mechanisms. Spoke about a recent positive interaction with a family member. Session lasted approximately 50 minutes.`;
      functions.logger.info(`Dummy transcription complete for: ${audioFileName}`, { therapistId });
      if (!transcript) { // Basic check even for dummy
          throw new Error("Transcription result was empty (dummy).");
      }
    } catch (transcriptionError) {
      functions.logger.error(`Transcription failed for: ${audioFileName}, therapist: ${therapistId}`, transcriptionError);
      // CRITICAL: Attempt to delete the audio file even if transcription fails to minimize PHI exposure
      try {
        await file.delete();
        functions.logger.info(`Audio file deleted after transcription failure: ${audioFileName}`, { therapistId });
      } catch (deleteFailError) {
        functions.logger.error(`CRITICAL: FAILED TO DELETE audio file ${audioFileName} after transcription error. MANUAL INTERVENTION REQUIRED.`, { therapistId, deleteFailError });
        // Consider adding an alert mechanism here for manual intervention
      }
      throw new functions.https.HttpsError("internal", "Audio transcription failed. Please try again later.");
    }

    // 3. Secure Audio Deletion (CRITICAL - after successful transcription, before returning to client)
    try {
      await file.delete();
      functions.logger.info(`Audio file deleted successfully after transcription: ${audioFileName}`, { therapistId });
    } catch (deleteError) {
      functions.logger.error(`CRITICAL: FAILED TO DELETE audio file ${audioFileName} after successful transcription. MANUAL INTERVENTION REQUIRED.`, { therapistId, deleteError });
      // This is a serious issue. The note might still be generated, but the raw PHI (audio) remains.
      // For MVP, we log it critically. Production might require halting or specific alerting.
      // For now, we will proceed to generate the note if transcription was successful, but this logged error is vital.
    }

    // 4. Note Generation (AI Summarization)
    let structuredContent: string = ""; // Or your structured object type
    try {
      // TODO: Replace with actual API call to Azure OpenAI GPT model
      // Ensure you use functions.config().openai.apikey etc.
      // Example prompt structure (refine heavily):
      // const prompt = `Generate a structured SOAP note from the following therapy session transcript:\n\nTranscript:\n"""${transcript}"""\n\nSOAP Note:\nS: [Client's subjective report]\nO: [Therapist's objective observations]\nA: [Therapist's assessment]\nP: [Plan for next steps, homework, next session]`;
      // const llmResponse = await callLLMService(prompt, functions.config().openai.apikey);
      // structuredContent = llmResponse.choices[0].message.content;

      // TEMP: Dummy note content for MVP development - REMOVE FOR PRODUCTION
      structuredContent = `S: Client reported feeling anxious about work pressures and mentioned difficulty sleeping.\nO: Appeared slightly restless during the session, speech was coherent.\nA: Demonstrates symptoms consistent with generalized anxiety. Motivated to learn coping skills.\nP: Introduce CBT techniques for managing anxiety. Discuss sleep hygiene next session. Follow-up in 1 week.`;
      functions.logger.info(`Dummy summarization complete for therapist: ${therapistId}`);
      if (!structuredContent) { // Basic check even for dummy
          throw new Error("Summarization result was empty (dummy).");
      }
    } catch (summarizationError) {
      functions.logger.error(`Summarization failed for therapist: ${therapistId}, transcript from: ${audioFileName}`, summarizationError);
      throw new functions.https.HttpsError("internal", "Note generation failed. Please try again later.");
    }

    // 5. Save Note to Firestore
    try {
      const noteData = {
        therapistId,
        sessionDate: admin.firestore.Timestamp.fromMillis(sessionDate),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        structuredContent,
        originalAudioFileName: audioFileName, // For traceability
        status: "completed", // Or "pending_review" etc.
      };

      const noteRef = await db.collection("therapySessionNotes").add(noteData);
      functions.logger.info(`Note saved successfully for therapist: ${therapistId}`, { noteId: noteRef.id });

      // 6. Return Success Response
      return { success: true, noteId: noteRef.id, message: "Note generated successfully." };
    } catch (dbError) {
      functions.logger.error(`Failed to save note to Firestore for therapist: ${therapistId}, from audio: ${audioFileName}`, dbError);
      throw new functions.https.HttpsError("internal", "Failed to save the generated note. Please try again.");
    }
  }
);