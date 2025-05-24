// src/hooks/useAudioProcessor.ts
import { useState } from 'react';
import { 
  ref as storageRef, 
  uploadBytesResumable, 
  UploadTaskSnapshot, 
  getDownloadURL // For optional download URL logging
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage, auth as firebaseAuth } from '@/lib/firebaseConfig';

interface GenerateNoteDataClient {
  audioFileName: string; // Full path in Firebase Storage
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
    console.log("useAudioProcessor: processAudio called with blob:", audioBlob, "therapistId:", therapistId);
    if (!audioBlob || !therapistId) {
      const errorMsg = "Audio data or therapist ID missing.";
      console.error("useAudioProcessor: " + errorMsg);
      setStatusMessage(errorMsg);
      if (onComplete) onComplete(false, errorMsg);
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setStatusMessage('Preparing to upload audio...');

    const uniqueFileId = uuidv4();
    // Make file extension dynamic based on the blob's type
    const typeParts = audioBlob.type.split('/'); // e.g., "audio/webm" -> ["audio", "webm"]
    const extension = typeParts[1] ? typeParts[1].split(';')[0] : 'bin'; // Fallback to .bin if subtype is complex or missing
    
    const audioFilePath = `sessions/${therapistId}/${uniqueFileId}.${extension}`;
    
    console.log(`useAudioProcessor: Determined file extension: .${extension}, Full path for upload: ${audioFilePath}`);
    
    const fileReference = storageRef(storage, audioFilePath);
    console.log(`useAudioProcessor: Uploading to Bucket: ${fileReference.bucket}, Full Path: ${fileReference.fullPath}`);

    const metadata = {
      contentType: audioBlob.type || 'audio/webm', // Use blob's type, fallback if necessary
    };

    const uploadTask = uploadBytesResumable(fileReference, audioBlob, metadata);

    uploadTask.on('state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        setStatusMessage(`Uploading audio: ${Math.round(progress)}%`);
      },
      (error) => {
        console.error('useAudioProcessor: Firebase Storage: Upload failed:', error);
        const userErrorMessage = `Audio upload failed: ${error.code || error.message}. Please check connection or storage rules.`;
        setStatusMessage(userErrorMessage);
        setIsProcessing(false);
        setUploadProgress(0);
        if (onComplete) onComplete(false, userErrorMessage);
      },
      async () => { // Upload completed successfully
        setStatusMessage('Upload complete! Generating session note...');
        console.log('useAudioProcessor: Firebase Storage: File uploaded successfully. Path:', audioFilePath);

        // Optional: Log download URL as a sanity check from client side
        try {
          const downloadUrl = await getDownloadURL(fileReference);
          console.log('useAudioProcessor: Firebase Storage: Accessible download URL:', downloadUrl);
        } catch (urlError) {
          console.warn('useAudioProcessor: Firebase Storage: Could not get download URL for uploaded file (this is okay if function uses Admin SDK):', urlError);
        }

        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) {
          const errorMsg = "User not authenticated. Cannot process note.";
          console.error("useAudioProcessor: " + errorMsg);
          setStatusMessage(errorMsg);
          setIsProcessing(false);
          if (onComplete) onComplete(false, errorMsg);
          return;
        }

        let idToken;
        try {
          idToken = await currentUser.getIdToken();
        } catch (tokenError) {
          console.error("useAudioProcessor: Error getting ID token:", tokenError);
          const errorMsg = "Authentication error. Could not get user token.";
          setStatusMessage(errorMsg);
          setIsProcessing(false);
          if (onComplete) onComplete(false, errorMsg);
          return;
        }
        
        const sessionTimestamp = Date.now();
        const payload: GenerateNoteDataClient = {
          audioFileName: audioFilePath, // This is the full path used for upload
          sessionDate: sessionTimestamp,
        };

        console.log(`useAudioProcessor: Calling 'generateNote' HTTP function with URL construction details:`);
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const functionRegion = 'us-central1'; 
        const functionName = 'generateNote'; 

        const functionUrl = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true'
          ? `http://127.0.0.1:5001/${projectId}/${functionRegion}/${functionName}`
          : `https://${functionRegion}-${projectId}.cloudfunctions.net/${functionName}`;
        
        console.log(`useAudioProcessor: Target Function URL: ${functionUrl}`);
        console.log(`useAudioProcessor: Payload for generateNote:`, payload);
        console.log(`useAudioProcessor: ID Token (first 20 chars):`, idToken ? idToken.substring(0, 20) + "..." : "No ID Token");


        try {
          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(payload),
          });

          const responseText = await response.text(); // Get raw response text for debugging
          console.log(`useAudioProcessor: Raw response from ${functionName}:`, responseText);

          let resultData: GenerateNoteResultServer;
          try {
            resultData = JSON.parse(responseText); // Try to parse as JSON
          } catch (parseError) {
            console.error(`useAudioProcessor: Failed to parse JSON response from ${functionName}:`, parseError, "Raw text was:", responseText);
            const errorMsg = `Failed to process note: Server returned an invalid response (HTTP ${response.status})`;
            setStatusMessage(errorMsg);
            if (onComplete) onComplete(false, errorMsg);
            setIsProcessing(false); // Ensure processing is set to false
            return;
          }
          
          if (response.ok && resultData.success) {
            const successMsg = resultData.message || `Note generated! Note ID: ${resultData.noteId || 'N/A'}`;
            setStatusMessage(successMsg);
            console.log(`useAudioProcessor: HTTP Function '${functionName}' call successful:`, resultData);
            if (onComplete) onComplete(true, successMsg, resultData.noteId);
          } else {
            const errorMsg = resultData.error || resultData.message || `Failed to process note (HTTP ${response.status})`;
            console.error(`useAudioProcessor: HTTP Function '${functionName}' call failed (${response.status}):`, resultData);
            setStatusMessage(errorMsg);
            if (onComplete) onComplete(false, errorMsg);
          }
        } catch (error: unknown) {
          console.error(`useAudioProcessor: Network or other error calling '${functionName}' HTTP function:`, error);
          let detailMessage = "An unexpected network error occurred while calling the generate note function.";
          if (error instanceof TypeError && error.message === "Failed to fetch") { // More specific for fetch failure
            detailMessage = "Network request to processing service failed. Check server logs and connectivity.";
          } else if (error instanceof Error) {
            detailMessage = error.message;
          }
          setStatusMessage(`Error processing note: ${detailMessage}`);
          if (onComplete) onComplete(false, `Error processing note: ${detailMessage}`);
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
    setStatusMessage,
    processAudio,
  };
};