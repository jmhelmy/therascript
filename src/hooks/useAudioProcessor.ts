// src/hooks/useAudioProcessor.ts
'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebaseConfig';               // ← your initialized Firebase Auth
import { saveTherapySessionNote } from '@/lib/saveTherapySessionNote';

type SoapNote = {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

type AudioResult = {
  transcript: string;
  soapNote: SoapNote;
};

export const useAudioProcessor = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  /**
   * processAudio()
   *  1. Sends the Blob to Whisper (EC2) for transcription
   *  2. Sends the transcript to your /api/generate-soap-note route
   *  3. Persists both transcript + SOAP note to Firestore
   */
  const processAudio = async (
    audioBlob: Blob,
    therapistId: string,
    sessionId?: string, 
    onComplete?: (
      success: boolean,
      result?: AudioResult,
      noteId?: string | null,
      errorMessage?: string
    ) => void
  ) => {
    // ─── Input validation ───────────────────────────────────────────────
    if (!audioBlob) {
      const err = 'Processing failed: audioBlob is missing.';
      console.error(err);
      setStatusMessage(err);
      onComplete?.(false, undefined, null, err);
      return;
    }
    if (!therapistId) {
      const err = 'Processing failed: therapistId is missing.';
      console.error(err);
      setStatusMessage(err);
      onComplete?.(false, undefined, null, err);
      return;
    }
    if (!sessionId) {
      const err = 'Processing failed: sessionId is missing or invalid.';
      console.error(err);
      setStatusMessage(err);
      onComplete?.(false, undefined, null, err);
      return;
    }

    // ─── Begin processing ───────────────────────────────────────────────
    setIsProcessing(true);
    setUploadProgress(0);
    setStatusMessage('Sending audio to transcriber…');

    try {
      // 1️⃣ Wrap the Blob in a File so we have a .name property
      const defaultFileName = 'session-audio.mp3';
      const file = new File([audioBlob], defaultFileName, { type: audioBlob.type });

      console.log('📤 Uploading to Whisper with file.name:', file.name);
      setUploadProgress(10);

      // 2️⃣ Send to Whisper for transcription
      const formData = new FormData();
      formData.append('file', file);

      const whisperResponse = await fetch(
        'http://ec2-18-219-113-46.us-east-2.compute.amazonaws.com:8000/transcribe',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!whisperResponse.ok) {
        const errText = await whisperResponse.text();
        throw new Error(`Transcription error: ${whisperResponse.status} - ${errText}`);
      }

      const whisperResult = await whisperResponse.json();
      const transcript: string = whisperResult.text;
      console.log('✅ Whisper transcript:', transcript);

      setStatusMessage('Transcript received. Sending to OpenAI…');
      setUploadProgress(40);

      // 3️⃣ Send transcript to /api/generate-soap-note for SOAP generation
      const aiResponse = await fetch('/api/generate-soap-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        throw new Error(`SOAP note generation error: ${aiResponse.status} - ${errText}`);
      }

      const aiData = await aiResponse.json();
      const soapNote: SoapNote = aiData.soapNote;
      console.log('✅ Received SOAP note:', soapNote);

      setStatusMessage('Saving transcript and SOAP note…');
      setUploadProgress(70);

      // 4️⃣ Check that the user is still authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user. Please log in again.');
      }

      // 5️⃣ Build a safe filename (never undefined)
      //    If file.name somehow were undefined, fallback to defaultFileName:
      const safeFilename = file.name ?? defaultFileName;
      console.log('▶️ Final originalAudioFileName to write:', safeFilename);

      // 6️⃣ Write to Firestore
      const noteId = await saveTherapySessionNote(
        transcript,
        soapNote,
        new Date(),
        safeFilename,  // ✅ guaranteed to be a non‐undefined string
        sessionId     // must be a real string
      );

      console.log('✅ Therapy session note saved with ID:', noteId);
      setStatusMessage('Saved successfully.');
      setUploadProgress(100);

      onComplete?.(true, { transcript, soapNote }, noteId);
    } catch (err: any) {
      const errorMsg = `Processing failed: ${err.message}`;
      console.error(errorMsg);
      setStatusMessage(errorMsg);
      onComplete?.(false, undefined, null, errorMsg);
    } finally {
      setIsProcessing(false);
      setUploadProgress(100);
    }
  };

  return {
    isProcessing,
    uploadProgress,
    statusMessage,
    processAudio,
    setStatusMessage,
  };
};
