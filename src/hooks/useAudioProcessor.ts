// src/hooks/useAudioProcessor.ts
import { useState } from 'react';
import { ref as storageRef, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { httpsCallable, HttpsCallable } from 'firebase/functions';
import { v4 as uuidv4 } from 'uuid';
import { storage, functions } from '@/lib/firebaseConfig'; // Corrected imports

interface GenerateNoteData {
  audioFileName: string;
  sessionDate: number;
}

interface GenerateNoteResult {
  success: boolean;
  message?: string;
  noteId?: string;
}

// It's good practice to define the callable function once if it's always the same
// Or pass 'functions' instance if it could vary, but usually it's constant.
const generateNoteCallable: HttpsCallable<GenerateNoteData, GenerateNoteResult> =
  httpsCallable(functions, 'generateNote');

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
      setStatusMessage("Audio data or therapist ID missing.");
      if (onComplete) onComplete(false, "Audio data or therapist ID missing.");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setStatusMessage('Preparing to upload audio...');

    const uniqueId = uuidv4();
    const audioFileName = `sessions/${therapistId}/${uniqueId}.webm`;
    const fileRef = storageRef(storage, audioFileName);

    const uploadTask = uploadBytesResumable(fileRef, audioBlob);

    uploadTask.on('state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        setStatusMessage(`Uploading: ${Math.round(progress)}%`);
      },
      (error) => {
        console.error('Upload failed:', error);
        setStatusMessage(`Upload failed: ${error.message}. Please try again.`);
        setIsProcessing(false);
        setUploadProgress(0);
        if (onComplete) onComplete(false, `Upload failed: ${error.message}`);
      },
      async () => {
        setStatusMessage('Upload complete! Processing note...');
        console.log('File uploaded successfully. Path:', audioFileName);

        try {
          const sessionDate = Date.now();
          const result = await generateNoteCallable({
            audioFileName: audioFileName,
            sessionDate: sessionDate,
          });

          if (result.data.success) {
            setStatusMessage(`Note generation started! Note ID: ${result.data.noteId || 'N/A'}`);
            console.log("generateNote function call success:", result.data);
            if (onComplete) onComplete(true, result.data.message, result.data.noteId);
          } else {
            throw new Error(result.data.message || "Failed to process note via function.");
          }
        } catch (error: any) {
          console.error("Error calling generateNote function:", error);
          let detailMessage = error.message;
          if (error.details) {
            console.error("Error details:", error.details);
            detailMessage = `${error.message} (Details: ${JSON.stringify(error.details)})`;
          }
          setStatusMessage(`Error processing note: ${detailMessage}`);
          if (onComplete) onComplete(false, `Error processing note: ${detailMessage}`);
        } finally {
          setIsProcessing(false);
          // Keep uploadProgress at 100 or reset after a delay if preferred
          // setUploadProgress(0); // Or reset after success message displayed for a bit
        }
      }
    );
  };

  return {
    isProcessing,
    uploadProgress,
    statusMessage,
    setStatusMessage, // Expose setter if needed
    processAudio,
  };
};