// src/hooks/useAudioProcessor.ts

import { useState } from 'react';
import {
  ref as storageRef,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage, auth as firebaseAuth } from '@/lib/firebaseConfig';

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

    const uniqueFileId = uuidv4();
    const typeParts = audioBlob.type.split('/');
    const extension = typeParts[1] ? typeParts[1].split(';')[0] : 'bin';
    const audioFilePath = `sessions/${therapistId}/${uniqueFileId}.${extension}`;

    const fileReference = storageRef(storage, audioFilePath);
    const metadata = { contentType: audioBlob.type || 'audio/webm' };

    const uploadTask = uploadBytesResumable(fileReference, audioBlob, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        setStatusMessage(`Uploading audio: ${Math.round(progress)}%`);
      },
      (error) => {
        const userErrorMessage = `Audio upload failed: ${error.code || error.message}. Please check connection or storage rules.`;
        setStatusMessage(userErrorMessage);
        setIsProcessing(false);
        setUploadProgress(0);
        onComplete?.(false, userErrorMessage);
      },
      async () => {
        setStatusMessage('Upload complete! Generating session note...');

        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) {
          const errorMsg = "User not authenticated. Cannot process note.";
          setStatusMessage(errorMsg);
          setIsProcessing(false);
          onComplete?.(false, errorMsg);
          return;
        }

        let idToken: string;
        try {
          idToken = await currentUser.getIdToken();
        } catch {
          const errorMsg = "Authentication error. Could not get user token.";
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

        try {
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
            const errorMsg = `Failed to process note: Server returned an invalid response (HTTP ${response.status})`;
            setStatusMessage(errorMsg);
            setIsProcessing(false);
            onComplete?.(false, errorMsg);
            return;
          }

          if (response.ok && resultData.success) {
            const successMsg = resultData.message || `Note generated! Note ID: ${resultData.noteId || 'N/A'}`;
            setStatusMessage(successMsg);
            onComplete?.(true, successMsg, resultData.noteId);
          } else {
            const errorMsg =
              resultData.error ||
              resultData.message ||
              `Failed to process note (HTTP ${response.status})`;
            setStatusMessage(errorMsg);
            onComplete?.(false, errorMsg);
          }
        } catch (error) {
          let detailMessage = "An unexpected network error occurred while calling the generate note function.";
          if (error instanceof TypeError && error.message === "Failed to fetch") {
            detailMessage = "Network request to processing service failed. Check server logs and connectivity.";
          } else if (error instanceof Error) {
            detailMessage = error.message;
          }
          setStatusMessage(`Error processing note: ${detailMessage}`);
          onComplete?.(false, `Error processing note: ${detailMessage}`);
        } finally {
          setIsProcessing(false);
        }
      }
    );
  };

  return {
    isProcessing,
    uploadProgress,
    statusMessage,
    processAudio,
  };
};
