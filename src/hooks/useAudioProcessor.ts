import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GenerateNoteDataClient {
  audioFileName: string;
  sessionDate: number;
}

interface GenerateNoteResultServer {
  success: boolean;
  message?: string;
  noteId?: string;
  error?: string;
}

export const useAudioProcessor = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const processAudio = async (
    audioBlob: Blob,
    therapistId: string,
    onComplete?: (success: boolean, message?: string, noteId?: string) => void
  ) => {
    if (!audioBlob || !therapistId) {
      const errorMsg = "Audio data or therapist ID missing.";
      setStatusMessage(errorMsg);
      onComplete?.(false, errorMsg);
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setStatusMessage('Preparing to upload audio...');

    try {
      // Dynamic imports to avoid pulling in undici during build
      const { getStorage, ref, uploadBytesResumable } = await import('firebase/storage');
      const { auth } = await import('@/lib/firebaseConfig');

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated. Cannot process note.");
      }

      const uniqueFileId = uuidv4();
      const extension = audioBlob.type.split('/')[1]?.split(';')[0] || 'bin';
      const audioFilePath = `sessions/${therapistId}/${uniqueFileId}.${extension}`;
      const storageInstance = getStorage();
      const fileReference = ref(storageInstance, audioFilePath);
      const metadata = { contentType: audioBlob.type || 'audio/webm' };

      const uploadTask = uploadBytesResumable(fileReference, audioBlob, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          setStatusMessage(`Uploading audio: ${Math.round(progress)}%`);
        },
        (error) => {
          const userErrorMessage = `Audio upload failed: ${error.code || error.message}.`;
          setStatusMessage(userErrorMessage);
          setIsProcessing(false);
          setUploadProgress(0);
          onComplete?.(false, userErrorMessage);
        },
        async () => {
          setStatusMessage('Upload complete! Generating session note...');

          let idToken: string;
          try {
            idToken = await currentUser.getIdToken();
          } catch {
            const errorMsg = "Could not get user token.";
            setStatusMessage(errorMsg);
            setIsProcessing(false);
            onComplete?.(false, errorMsg);
            return;
          }

          const sessionTimestamp = Date.now();
          const payload: GenerateNoteDataClient = {
            audioFileName: audioFilePath,
            sessionDate: sessionTimestamp,
          };

          const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
          const functionRegion = 'us-central1';
          const functionName = 'generateNote';
          const functionUrl =
            process.env.NEXT_PUBLIC_USE_EMULATORS === 'true'
              ? `http://127.0.0.1:5001/${projectId}/${functionRegion}/${functionName}`
              : `https://${functionRegion}-${projectId}.cloudfunctions.net/${functionName}`;

          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify(payload),
          });

          const responseText = await response.text();
          let resultData: GenerateNoteResultServer;
          try {
            resultData = JSON.parse(responseText);
          } catch {
            const errorMsg = `Invalid server response (HTTP ${response.status})`;
            setStatusMessage(errorMsg);
            setIsProcessing(false);
            onComplete?.(false, errorMsg);
            return;
          }

          if (response.ok && resultData.success) {
            const successMsg = resultData.message || `Note generated! ID: ${resultData.noteId}`;
            setStatusMessage(successMsg);
            onComplete?.(true, successMsg, resultData.noteId);
          } else {
            const errorMsg = resultData.error || resultData.message || `Failed to process note`;
            setStatusMessage(errorMsg);
            onComplete?.(false, errorMsg);
          }
        }
      );
    } catch (err) {
      setStatusMessage(`Processing failed: ${(err as Error).message}`);
      onComplete?.(false, `Processing failed: ${(err as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    uploadProgress,
    statusMessage,
    processAudio,
  };
};
