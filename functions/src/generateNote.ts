// functions/src/generateNote.ts

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import express from "express";
import corsMiddleware from "cors";

// Utility/service imports
import { authenticate } from "./utils/authenticate";
import { downloadAudio, deleteAudio } from "./services/storage";
import { transcodeWebMtoPCM } from "./services/transcoder";
import { transcribePCMWithAzure } from "./services/azureSpeechService";
import { generateSOAPNote } from "./services/azureOpenAIService";
import { saveNote } from "./services/firestoreService";
import { db } from "./common/adminSdk";
import { GenerateNoteData, GenerateNoteResult } from "./types";

const app = express();
app.use(corsMiddleware({ origin: true }));
app.use(express.json());

app.post(
  "/",
  authenticate,
  async (req: express.Request, res: express.Response): Promise<void> => {
    let therapistId: string | undefined;
    let audioFileName: string | undefined;

    try {
      // @ts-ignore — set by authenticate middleware
      const userToken = req.user as admin.auth.DecodedIdToken;
      therapistId = userToken.uid;

      const body = req.body as GenerateNoteData;
      audioFileName = body.audioFileName;
      const sessionDate = body.sessionDate;

      if (!therapistId) {
        functions.logger.error("Auth failed: no UID");
        res.status(403).json({ success: false, error: "Not authenticated." } as GenerateNoteResult);
        return;
      }

      functions.logger.info(`Starting generateNote for ${therapistId}, file ${audioFileName}`);

      // 1. Download raw audio
      const rawAudio = await downloadAudio(audioFileName);
      functions.logger.info("Audio downloaded.");

      // 2. Transcode to PCM
      const pcmBuffer = await transcodeWebMtoPCM(rawAudio);
      functions.logger.info("Transcoded to PCM.");

      // 3. Delete raw audio immediately
      await deleteAudio(audioFileName);
      functions.logger.info(`Deleted original audio: ${audioFileName}`);

      // 4. Transcribe via Azure
      const transcript = await transcribePCMWithAzure(pcmBuffer);
      if (!transcript) throw new Error("Empty transcript");
      functions.logger.info("Transcription complete.");

      // 5. Generate SOAP note via OpenAI
      const structuredContent = await generateSOAPNote(transcript);
      if (!structuredContent) throw new Error("Empty SOAP note");
      functions.logger.info("SOAP note generated.");

      // 6. Persist note in Firestore
      const noteId = await saveNote({
        therapistId,
        sessionDate,
        transcript,
        structuredContent,
        originalAudioFileName: audioFileName,
      });

      functions.logger.info("Note saved with ID:", noteId);

      await db.collection('auditLogs').add({
        userId: therapistId,
        action: 'generateNote',
        targetId: noteId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ success: true, noteId, message: "Note generated and saved." } as GenerateNoteResult);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Internal error";
      functions.logger.error("generateNote error:", { msg, therapistId, audioFileName, err });
      res.status(500).json({ success: false, error: msg } as GenerateNoteResult);
    }
  }
);

export const generateNoteHttpFunction = functions
  .runWith({ timeoutSeconds: 540, memory: "1GB" })
  .https.onRequest(app);
  