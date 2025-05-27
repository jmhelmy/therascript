// functions/src/services/azureSpeechService.ts

import * as functions from "firebase-functions/v1";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const speechCfg = functions.config().azure?.speech || {};
functions.logger.info("Azure Speech Config:", speechCfg);

if (!speechCfg.key || !speechCfg.region) {
  functions.logger.error("Missing Azure Speech config:", speechCfg);
  throw new Error("Azure Speech service not configured.");
}

// your existing transcription function below, using speechCfg.key & speechCfg.region
export async function transcribePCMWithAzure(pcmBuffer: Buffer): Promise<string> {
  const { key, region } = speechCfg;
  functions.logger.info("AzureSpeech: Beginning transcription, bufferLength=", pcmBuffer.length);
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
