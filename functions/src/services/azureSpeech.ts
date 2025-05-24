import * as functions from "firebase-functions/v1";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

/**
 * Transcribe a PCM buffer (16 kHz, mono, s16le) via Azure Speech SDK.
 */
export async function transcribePCMWithAzure(pcmBuffer: Buffer): Promise<string> {
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

  const pushStream = SpeechSDK.AudioInputStream.createPushStream(
    SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
  );
  pushStream.write(pcmBuffer);
  pushStream.close();

  const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise<string>((resolve, reject) => {
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
      recognizer.stopContinuousRecognitionAsync(
        () => {
          recognizer.close();
          const final = transcript.trim();
          functions.logger.info("AzureSpeech: Session stopped", {
            transcriptLength: final.length,
          });
          resolve(final);
        },
        (err) => {
          recognizer.close();
          functions.logger.error("AzureSpeech: Error stopping session", {
            error: err,
          });
          reject(new Error(`Error stopping recognition: ${err}`));
        }
      );
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

    recognizer.startContinuousRecognitionAsync(
      () => functions.logger.info("AzureSpeech: Recognition started"),
      (err) => {
        functions.logger.error("AzureSpeech: Failed to start recognition", {
          error: err,
        });
        reject(new Error(`Failed to start recognition: ${err}`));
      }
    );
  });
}
