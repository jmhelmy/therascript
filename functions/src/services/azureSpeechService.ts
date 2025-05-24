// functions/src/services/azureSpeechService.ts

import * as functions from "firebase-functions/v1";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

/**
 * Transcribes a PCM buffer (16 kHz, mono, s16le) via Azure Speech SDK in one shot.
 */
export async function transcribePCMWithAzure(pcmBuffer: Buffer): Promise<string> {
  const key = functions.config().azurespeech?.key;
  const region = functions.config().azurespeech?.region;
  if (!key || !region) {
    functions.logger.error("Azure Speech SDK credentials not configured.");
    throw new Error("Azure Speech service not configured.");
  }

  functions.logger.info("AzureSpeech: Beginning single‐shot transcription", {
    bufferLength: pcmBuffer.length,
  });

  // Configure the Speech SDK
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
  speechConfig.speechRecognitionLanguage = "en-US";

  // Create a push stream and feed in the PCM buffer
  const pushStream = SpeechSDK.AudioInputStream.createPushStream(
    SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
  );
  pushStream.write(pcmBuffer);
  pushStream.close();

  const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise<string>((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
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
      },
      (err) => {
        recognizer.close();
        functions.logger.error("AzureSpeech: recognizeOnceAsync error", { error: err });
        reject(new Error(`Speech SDK error: ${err}`));
      }
    );
  });
}
