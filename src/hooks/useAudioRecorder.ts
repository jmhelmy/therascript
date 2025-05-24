// src/hooks/useAudioRecorder.ts
import { useState, useRef, useCallback, useEffect } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      console.log("useAudioRecorder: Stream cleaned up."); // Optional: log cleanup
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    // setRecordingDuration(0); // Usually reset when starting a new recording
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  const startRecording = async () => {
    console.log("useAudioRecorder: startRecording called"); // DEBUG LOG
    if (isRecording) {
      console.log("useAudioRecorder: Already recording, returning.");
      return;
    }

    setAudioBlob(null); // Clear previous blob
    setStatusMessage('Requesting microphone permission...');
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatusMessage('Microphone access granted. Starting recording...');
      console.log("useAudioRecorder: Microphone access granted.");
    
      // Let the browser choose the supported mimeType
      mediaRecorderRef.current = new MediaRecorder(streamRef.current); 
      console.log("useAudioRecorder: MediaRecorder started with mimeType:", mediaRecorderRef.current.mimeType); // Log what Safari chose
    
      audioChunksRef.current = [];
    
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
    
      mediaRecorderRef.current.onstop = () => {
        console.log("useAudioRecorder: mediaRecorder.onstop called");
        // Use the mimeType the recorder actually used
        const recordedMimeType = mediaRecorderRef.current?.mimeType || 'audio/mp4'; // Fallback if needed
        const completeBlob = new Blob(audioChunksRef.current, { type: recordedMimeType });
        setAudioBlob(completeBlob);
        setIsRecording(false);
        setStatusMessage('Recording stopped. Ready to process or record again.');
        cleanupStream();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0); // Reset duration
      setStatusMessage('Recording...');
      console.log("useAudioRecorder: Recording started.");
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('useAudioRecorder: Error accessing microphone:', err);
      let message = 'Could not access microphone. Please ensure permission is granted and try again.';
      if (err instanceof Error && err.name === 'NotAllowedError') {
        message = 'Microphone permission was denied. Please enable it in your browser settings.';
      } else if (err instanceof Error && err.name === 'NotFoundError') {
        message = 'No microphone found. Please ensure a microphone is connected and enabled.';
      }
      setStatusMessage(message);
      cleanupStream(); // Ensure cleanup on error
    }
  };

  const stopRecording = () => {
    console.log("useAudioRecorder: stopRecording called"); // DEBUG LOG
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop(); // onstop handler will set isRecording to false and cleanup
      console.log("useAudioRecorder: mediaRecorder.stop() issued.");
    } else {
      console.log("useAudioRecorder: stopRecording called but no active recording or mediaRecorder.");
      // If recording was already stopped or didn't start, ensure interval is cleared
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setIsRecording(false); // Ensure state is consistent
      setRecordingDuration(0);
    }
  };

  return {
    isRecording,
    recordingDuration,
    audioBlob,
    statusMessage,
    setStatusMessage,
    startRecording,
    stopRecording,
  };
};