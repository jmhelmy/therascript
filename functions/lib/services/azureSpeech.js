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
exports.transcribePCMWithAzure = transcribePCMWithAzure;
const functions = __importStar(require("firebase-functions/v1"));
const SpeechSDK = __importStar(require("microsoft-cognitiveservices-speech-sdk"));
/**
 * Transcribe a PCM buffer (16 kHz, mono, s16le) via Azure Speech SDK.
 */
async function transcribePCMWithAzure(pcmBuffer) {
    const key = functions.config().azurespeech?.key;
    const region = functions.config().azurespeech?.region;
    if (!key || !region) {
        throw new Error("Azure Speech SDK credentials not configured.");
    }
    functions.logger.info("AzureSpeech: Starting transcription", {
        bufferLength: pcmBuffer.length,
    });
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechRecognitionLanguage = "en-US";
    const pushStream = SpeechSDK.AudioInputStream.createPushStream(SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1));
    pushStream.write(pcmBuffer);
    pushStream.close();
    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    return new Promise((resolve, reject) => {
        let transcript = "";
        recognizer.recognized = (_s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                transcript += e.result.text + " ";
                // Changed verbose → info
                functions.logger.info("AzureSpeech: Partial result", {
                    text: e.result.text,
                });
            }
        };
        recognizer.sessionStopped = () => {
            recognizer.stopContinuousRecognitionAsync(() => {
                recognizer.close();
                const final = transcript.trim();
                functions.logger.info("AzureSpeech: Session stopped", {
                    transcriptLength: final.length,
                });
                resolve(final);
            }, (err) => {
                recognizer.close();
                functions.logger.error("AzureSpeech: Error stopping session", {
                    error: err,
                });
                reject(new Error(`Error stopping recognition: ${err}`));
            });
        };
        recognizer.canceled = (_s, e) => {
            recognizer.close();
            const reason = SpeechSDK.CancellationReason[e.reason];
            functions.logger.error("AzureSpeech: Recognition canceled", {
                reason,
                detail: e.errorDetails,
            });
            reject(new Error(`Transcription canceled (${reason}): ${e.errorDetails}`));
        };
        recognizer.startContinuousRecognitionAsync(() => functions.logger.info("AzureSpeech: Recognition started"), (err) => {
            functions.logger.error("AzureSpeech: Failed to start recognition", {
                error: err,
            });
            reject(new Error(`Failed to start recognition: ${err}`));
        });
    });
}
