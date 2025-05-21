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
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setRecordingDuration(0);
  }, []);

  // Ensure stream is cleaned up on hook unmount if still active
  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  const startRecording = async () => {
    if (isRecording) return;

    setAudioBlob(null);
    setStatusMessage('Requesting microphone permission...');
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatusMessage('Microphone access granted. Starting recording...');

      mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType: 'audio/webm; codecs=opus' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const completeBlob = new Blob(audioChunksRef.current, { type: 'audio/webm; codecs=opus' });
        setAudioBlob(completeBlob);
        setIsRecording(false);
        setStatusMessage('Recording stopped. Ready to process.');
        cleanupStream();
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setStatusMessage('Error during recording. Please try again.');
        setIsRecording(false);
        cleanupStream();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setStatusMessage('Recording...');
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setStatusMessage('Could not access microphone. Please ensure permission is granted and try again.');
      cleanupStream();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop(); // onstop handler will do the rest
    } else if (recordingIntervalRef.current) { // Safety clear if somehow recording state is off but interval is running
        clearInterval(recordingIntervalRef.current)
    }
  };

  return {
    isRecording,
    recordingDuration,
    audioBlob,
    statusMessage,
    setStatusMessage, // Expose setter if external components need to update it
    startRecording,
    stopRecording,
  };
};