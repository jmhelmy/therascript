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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNoteHttpFunction = void 0;
// functions/src/generateNote.ts
const functions = __importStar(require("firebase-functions/v1"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Import your utility and service functions
const authenticate_1 = require("./utils/authenticate"); // This will use adminApp.auth()
const storage_1 = require("./services/storage"); // These use defaultBucket from adminSdk
const transcoder_1 = require("./services/transcoder");
const azureSpeechService_1 = require("./services/azureSpeechService");
const azureOpenAIService_1 = require("./services/azureOpenAIService");
const firestoreService_1 = require("./services/firestoreService"); // This will use adminApp.firestore.Timestamp
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.post("/", authenticate_1.authenticate, async (req, res) => {
    // ... (Your existing, refactored orchestrator logic from response #145) ...
    // This logic calls the service functions which now use adminApp internally
    let therapistIdFromAuth;
    let audioFileNameFromRequest;
    try {
        // @ts-ignore user is attached by the authenticate middleware
        const firebaseUser = req.user; // admin type here is from global firebase-admin
        therapistIdFromAuth = firebaseUser.uid;
        const { audioFileName, sessionDate } = req.body;
        audioFileNameFromRequest = audioFileName;
        if (!therapistIdFromAuth) {
            functions.logger.error("Authentication failed, therapistId not found.");
            res.status(403).json({ success: false, error: "Authentication failed." });
            return;
        }
        // ... (rest of the input validation) ...
        functions.logger.info(`Http Trigger: Starting generateNote for therapist: ${therapistIdFromAuth}, audioFile: ${audioFileNameFromRequest}`);
        const rawAudioBuffer = await (0, storage_1.downloadAudio)(audioFileNameFromRequest);
        functions.logger.info("Audio downloaded successfully.");
        const pcmBuffer = await (0, transcoder_1.transcodeWebMtoPCM)(rawAudioBuffer);
        functions.logger.info("Audio transcoded to PCM successfully.");
        await (0, storage_1.deleteAudio)(audioFileNameFromRequest);
        functions.logger.info("Original audio file deleted after transcoding.");
        const transcript = await (0, azureSpeechService_1.transcribePCMWithAzure)(pcmBuffer);
        if (!transcript)
            throw new Error("Transcription returned empty result.");
        functions.logger.info("Transcription successful.");
        const structuredContent = await (0, azureOpenAIService_1.generateSOAPNote)(transcript);
        if (!structuredContent)
            throw new Error("Note generation returned empty result.");
        functions.logger.info("SOAP note generated successfully.");
        const noteId = await (0, firestoreService_1.saveNote)({
            therapistId: therapistIdFromAuth,
            sessionDate,
            transcript,
            structuredContent: structuredContent,
            originalAudioFileName: audioFileNameFromRequest,
        });
        functions.logger.info("Note ID received from saveNote service:", noteId);
        res.status(200).json({ success: true, noteId, message: "Note generated and saved successfully." });
    }
    catch (err) {
        const errorMessage = (err instanceof Error && err.message) ? err.message : "An internal error occurred during note processing.";
        functions.logger.error("Error in generateNote main try/catch:", {
            errorMessage,
            originalError: err,
            therapistId: therapistIdFromAuth || "N/A",
            audioFile: audioFileNameFromRequest || "N/A"
        });
        res.status(500).json({ success: false, error: errorMessage });
    }
});
exports.generateNoteHttpFunction = functions
    .runWith({ timeoutSeconds: 540, memory: "1GB" })
    .https.onRequest(app);
