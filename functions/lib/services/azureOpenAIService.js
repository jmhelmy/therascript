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
exports.generateSOAPNote = generateSOAPNote;
const functions = __importStar(require("firebase-functions/v1"));
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Generates a SOAP note from a transcript using Azure OpenAI via REST API.
 */
async function generateSOAPNote(transcript) {
    const cfg = functions.config().azure?.openai;
    const apiKey = cfg?.key;
    const endpoint = cfg?.endpoint;
    const deploymentName = cfg?.deployment_name;
    const apiVersion = cfg?.api_version;
    if (!apiKey || !endpoint || !deploymentName || !apiVersion) {
        functions.logger.error("Azure OpenAI configuration missing.", cfg);
        throw new functions.https.HttpsError("internal", "Azure OpenAI service not configured on server.");
    }
    const systemPrompt = "You are an AI assistant helping a therapist write clinical session notes in SOAP format.";
    const userPrompt = `Transcript:\n"""${transcript}"""\n\nGenerate a SOAP note:`;
    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    try {
        functions.logger.info("Calling Azure OpenAI for SOAP note generation...", {
            deploymentName,
            endpoint,
            apiVersion,
        });
        const response = await (0, node_fetch_1.default)(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                max_tokens: 800,
                temperature: 0.5,
            }),
        });
        const data = await response.json(); // ✅ Fix: Explicitly cast to any
        if (!response.ok) {
            functions.logger.error("Azure OpenAI API Error:", data);
            throw new functions.https.HttpsError("internal", `Azure OpenAI API Error (${response.status}): ${data.error?.message || "Unknown error"}`);
        }
        const note = data?.choices?.[0]?.message?.content?.trim();
        if (!note) {
            throw new Error("Azure OpenAI returned an empty note.");
        }
        functions.logger.info("Azure OpenAI SOAP note generation complete.", {
            length: note.length,
        });
        return note;
    }
    catch (err) {
        functions.logger.error("Unexpected error during Azure OpenAI call:", err);
        throw new functions.https.HttpsError("internal", err?.message || "Unknown error");
    }
}
