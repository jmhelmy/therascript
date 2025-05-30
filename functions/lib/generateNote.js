"use strict";
// functions/src/generateNote.ts
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
const functions = __importStar(require("firebase-functions/v1"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Utility/service imports
const authenticate_1 = require("./utils/authenticate");
const storage_1 = require("./services/storage");
const whisperService_1 = require("./services/whisperService");
const azureOpenAIService_1 = require("./services/azureOpenAIService");
const firestoreService_1 = require("./services/firestoreService");
const auditService_1 = require("./services/auditService");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.post("/", authenticate_1.authenticate, async (req, res) => {
    let therapistId;
    let audioFileName;
    try {
        // @ts-ignore — set by authenticate middleware
        const userToken = req.user;
        therapistId = userToken.uid;
        const body = req.body;
        audioFileName = body.audioFileName;
        const sessionDate = body.sessionDate;
        if (!therapistId) {
            functions.logger.error("Auth failed: no UID");
            res
                .status(403)
                .json({ success: false, error: "Not authenticated." });
            return;
        }
        functions.logger.info(`Starting generateNote for ${therapistId}, file ${audioFileName}`);
        // 1. Transcribe via Whisper
        functions.logger.info("Transcriber: calling Whisper service");
        const transcript = await (0, whisperService_1.transcribeWithWhisper)(audioFileName);
        if (!transcript)
            throw new Error("Empty transcript");
        functions.logger.info("Transcription complete.");
        // 2. Delete raw audio immediately
        await (0, storage_1.deleteAudio)(audioFileName);
        functions.logger.info(`Deleted original audio: ${audioFileName}`);
        // 3. Generate SOAP note via OpenAI
        const structuredContent = await (0, azureOpenAIService_1.generateSOAPNote)(transcript);
        if (!structuredContent)
            throw new Error("Empty SOAP note");
        functions.logger.info("SOAP note generated.");
        // 4. Persist note in Firestore
        const noteId = await (0, firestoreService_1.saveNote)({
            therapistId,
            sessionDate,
            transcript,
            structuredContent,
            originalAudioFileName: audioFileName,
        });
        // 5. Audit log
        await (0, auditService_1.logAudit)("generateNote", therapistId, noteId);
        functions.logger.info("Note saved with ID:", noteId);
        res
            .status(200)
            .json({ success: true, noteId, message: "Note generated and saved." });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Internal error";
        functions.logger.error("generateNote error:", {
            msg,
            therapistId,
            audioFileName,
            err,
        });
        res.status(500).json({ success: false, error: msg });
    }
});
exports.generateNoteHttpFunction = functions
    .runWith({ timeoutSeconds: 540, memory: "1GB" })
    .https.onRequest(app);
