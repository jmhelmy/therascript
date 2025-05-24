// functions/src/generateNote.ts
import * as functions from "firebase-functions/v1";
import express from "express";
import corsMiddleware from "cors";

// Import your utility and service functions
import { authenticate } from "./utils/authenticate"; // This will use adminApp.auth()
import { downloadAudio, deleteAudio } from "./services/storage"; // These use defaultBucket from adminSdk
import { transcodeWebMtoPCM } from "./services/transcoder";
import { transcribePCMWithAzure } from "./services/azureSpeechService";
import { generateSOAPNote } from "./services/azureOpenAIService";
import { saveNote } from "./services/firestoreService"; // This will use adminApp.firestore.Timestamp
import { GenerateNoteData, GenerateNoteResult } from "./types";

const app = express();
app.use(corsMiddleware({ origin: true }));
app.use(express.json());

app.post(
  "/",
  authenticate,
  async (req: express.Request, res: express.Response): Promise<void> => {
    // ... (Your existing, refactored orchestrator logic from response #145) ...
    // This logic calls the service functions which now use adminApp internally
    let therapistIdFromAuth: string | undefined;
    let audioFileNameFromRequest: string | undefined;

    try {
      // @ts-ignore user is attached by the authenticate middleware
      const firebaseUser: admin.auth.DecodedIdToken = req.user; // admin type here is from global firebase-admin
      therapistIdFromAuth = firebaseUser.uid;

      const { audioFileName, sessionDate } = req.body as GenerateNoteData;
      audioFileNameFromRequest = audioFileName;

      if (!therapistIdFromAuth) {
        functions.logger.error("Authentication failed, therapistId not found.");
        res.status(403).json({ success: false, error: "Authentication failed." } as GenerateNoteResult);
        return;
      }
      // ... (rest of the input validation) ...

      functions.logger.info(`Http Trigger: Starting generateNote for therapist: ${therapistIdFromAuth}, audioFile: ${audioFileNameFromRequest}`);

      const rawAudioBuffer = await downloadAudio(audioFileNameFromRequest);
      functions.logger.info("Audio downloaded successfully.");

      const pcmBuffer = await transcodeWebMtoPCM(rawAudioBuffer);
      functions.logger.info("Audio transcoded to PCM successfully.");

      await deleteAudio(audioFileNameFromRequest); 
      functions.logger.info("Original audio file deleted after transcoding.");

      const transcript = await transcribePCMWithAzure(pcmBuffer);
      if (!transcript) throw new Error("Transcription returned empty result.");
      functions.logger.info("Transcription successful.");

      const structuredContent = await generateSOAPNote(transcript);
      if (!structuredContent) throw new Error("Note generation returned empty result.");
      functions.logger.info("SOAP note generated successfully.");

      const noteId = await saveNote({
        therapistId: therapistIdFromAuth,
        sessionDate,
        transcript,
        structuredContent: structuredContent,
        originalAudioFileName: audioFileNameFromRequest,
      });
 
      functions.logger.info("Note ID received from saveNote service:", noteId);
      res.status(200).json({ success: true, noteId, message: "Note generated and saved successfully." } as GenerateNoteResult);
    
    } catch (err: unknown) { 
      const errorMessage = (err instanceof Error && err.message) ? err.message : "An internal error occurred during note processing.";
      functions.logger.error("Error in generateNote main try/catch:", { 
        errorMessage, 
        originalError: err,
        therapistId: therapistIdFromAuth || "N/A", 
        audioFile: audioFileNameFromRequest || "N/A"
      });
      res.status(500).json({ success: false, error: errorMessage } as GenerateNoteResult);
    }
  }
);

export const generateNoteHttpFunction = functions
  .runWith({ timeoutSeconds: 540, memory: "1GB" })
  .https.onRequest(app);