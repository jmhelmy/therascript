import * as functions from "firebase-functions/v1";
import fetch from "node-fetch";

/**
 * Generates a SOAP note from a transcript using Azure OpenAI via REST API.
 */
export async function generateSOAPNote(transcript: string): Promise<string> {
  const cfg = functions.config().azure?.openai;
  const apiKey         = cfg?.key;
  const endpoint       = cfg?.endpoint;
  const deploymentName = cfg?.deployment_name;
  const apiVersion     = cfg?.api_version;

  if (!apiKey || !endpoint || !deploymentName || !apiVersion) {
    functions.logger.error("Azure OpenAI configuration missing.", cfg);
    throw new functions.https.HttpsError(
      "internal",
      "Azure OpenAI service not configured on server."
    );
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

    const response = await fetch(url, {
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

    const data: any = await response.json(); // ✅ Fix: Explicitly cast to any

    if (!response.ok) {
      functions.logger.error("Azure OpenAI API Error:", data);
      throw new functions.https.HttpsError(
        "internal",
        `Azure OpenAI API Error (${response.status}): ${data.error?.message || "Unknown error"}`
      );
    }

    const note = data?.choices?.[0]?.message?.content?.trim();
    if (!note) {
      throw new Error("Azure OpenAI returned an empty note.");
    }

    functions.logger.info("Azure OpenAI SOAP note generation complete.", {
      length: note.length,
    });

    return note;

  } catch (err: any) {
    functions.logger.error("Unexpected error during Azure OpenAI call:", err);
    throw new functions.https.HttpsError(
      "internal",
      err?.message || "Unknown error"
    );
  }
}
