"use strict";
// functions/src/services/azureSpeechService.ts
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
const speechCfg = functions.config().azure?.speech || {};
functions.logger.info("Azure Speech Config:", speechCfg);
if (!speechCfg.key || !speechCfg.region) {
    functions.logger.error("Missing Azure Speech config:", speechCfg);
    throw new Error("Azure Speech service not configured.");
}
// your existing transcription function below, using speechCfg.key & speechCfg.region
async function transcribePCMWithAzure(pcmBuffer) {
    const { key, region } = speechCfg;
    functions.logger.info("AzureSpeech: Beginning transcription, bufferLength=", pcmBuffer.length);
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechRecognitionLanguage = "en-US";
    // Create a push stream and feed in the PCM buffer
    const pushStream = SpeechSDK.AudioInputStream.createPushStream(SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1));
    pushStream.write(pcmBuffer);
    pushStream.close();
    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    return new Promise((resolve, reject) => {
        recognizer.recognizeOnceAsync((result) => {
            recognizer.close();
            switch (result.reason) {
                case SpeechSDK.ResultReason.RecognizedSpeech: {
                    const text = result.text.trim();
                    functions.logger.info("AzureSpeech: Recognized text", { length: text.length });
                    return resolve(text);
                }
                case SpeechSDK.ResultReason.NoMatch: {
                    functions.logger.warn("AzureSpeech: No speech could be recognized.");
                    return reject(new Error("No speech recognized in audio."));
                }
                case SpeechSDK.ResultReason.Canceled: {
                    const cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
                    functions.logger.error("AzureSpeech: Recognition canceled", {
                        reason: cancelDetails.reason,
                        errorDetails: cancelDetails.errorDetails,
                    });
                    return reject(new Error(`Transcription canceled: ${cancelDetails.errorDetails}`));
                }
                default: {
                    functions.logger.error("AzureSpeech: Unknown recognition result reason", { reason: result.reason });
                    return reject(new Error(`Transcription failed with reason: ${result.reason}`));
                }
            }
        }, (err) => {
            recognizer.close();
            functions.logger.error("AzureSpeech: recognizeOnceAsync error", { error: err });
            reject(new Error(`Speech SDK error: ${err}`));
        });
    });
}
