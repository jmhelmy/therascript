// src/app/session/record/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Removed unused useCallback
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';

// PRIMARY_COLOR_HEX and CaduceusIcon were removed as they were not used in the page layout you provided.
// If you intend to use them, you can re-add them.

const RecordSessionPage = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const router = useRouter();

  const {
    isRecording,
    recordingDuration,
    audioBlob,
    startRecording,
    stopRecording,
    statusMessage: recorderStatus,
    setStatusMessage: setRecorderStatus,
  } = useAudioRecorder();

  const {
    isProcessing,
    uploadProgress,
    processAudio,
    statusMessage: processorStatus,
    // setStatusMessage: setProcessorStatus, // Expose if needed from useAudioProcessor
  } = useAudioProcessor();

  // Combined status message
  const displayStatus = processorStatus || recorderStatus;

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        if (setRecorderStatus) {
            setRecorderStatus('Redirecting to login...');
        }
        router.push('/login');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router, setRecorderStatus]);

  const handleProcessAudio = () => {
    console.log("RecordSessionPage: handleProcessAudio called"); // DEBUG LOG
    if (audioBlob && user) {
      console.log("RecordSessionPage: Conditions met, calling processAudio hook.");
      processAudio(audioBlob, user.uid, (success, message, noteId) => {
        console.log(`RecordSessionPage: processAudio onComplete callback - Success: ${success}, Message: ${message}, NoteID: ${noteId}`);
        if (success) {
          setTimeout(() => {
            if (noteId) {
              router.push(`/notes/${noteId}`);
            } else {
              router.push('/dashboard');
            }
          }, 2000);
        }
        // Status messages (success or error) are expected to be set by useAudioProcessor hook
      });
    } else {
      console.warn("RecordSessionPage: handleProcessAudio called but audioBlob or user is missing.", { audioBlobExists: !!audioBlob, userExists: !!user });
      // Optionally set a status message here if conditions aren't met
      // if (setProcessorStatus) setProcessorStatus("Cannot process: Audio or user data is missing.");
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-slate-100">
        <p className="p-4 text-lg text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-slate-100">
        <p className="p-4 text-lg text-gray-700">User not authenticated. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-8 font-sans md:p-8 bg-gradient-to-br from-slate-100 to-sky-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-center md:text-3xl text-sky-700">
            Record New Session
          </h1>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 text-sm font-medium text-sky-600 hover:text-sky-800"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {displayStatus && (
          <p
            className={`p-3 mb-6 text-center rounded-md text-sm ${
              displayStatus.toLowerCase().includes('error') || displayStatus.toLowerCase().includes('failed')
                ? 'bg-red-100 text-red-700'
                : 'bg-sky-100 text-sky-700'
            }`}
          >
            {displayStatus}
          </p>
        )}

        <div className="flex flex-col items-center mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-center">
          {!isRecording ? (
            <button
              onClick={startRecording} // This will call the startRecording from useAudioRecorder
              disabled={isProcessing || isRecording}
              className="w-full px-6 py-3 text-lg font-semibold text-white transition-colors duration-150 ease-in-out bg-green-500 rounded-md hover:bg-green-600 focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 md:w-auto"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording} // This will call the stopRecording from useAudioRecorder
              disabled={isProcessing}
              className="w-full px-6 py-3 text-lg font-semibold text-white transition-colors duration-150 ease-in-out bg-red-500 rounded-md hover:bg-red-600 focus:ring-4 focus:ring-red-300 md:w-auto"
            >
              Stop Recording
            </button>
          )}
        </div>

        {isRecording && (
          <p className="mb-6 text-lg font-medium text-center text-gray-700">
            Recording Time: {formatDuration(recordingDuration)}
          </p>
        )}

        {audioBlob && !isRecording && (
          <div className="p-4 mt-6 border border-gray-200 rounded-md">
            <h2 className="mb-3 text-xl font-semibold text-center text-gray-800">Review Audio</h2>
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mb-4"></audio>
            <button
              onClick={handleProcessAudio} // This calls your local handleProcessAudio
              disabled={isProcessing || !audioBlob}
              className="w-full px-6 py-3 text-lg font-semibold text-white transition-colors duration-150 ease-in-out rounded-md bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 disabled:bg-gray-400"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {processorStatus || `Processing (${Math.round(uploadProgress)}%)...`} 
                </span>
              ) : (
                'Process & Generate Note'
              )}
            </button>
          </div>
        )}

        {isProcessing && uploadProgress > 0 && (
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-sky-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordSessionPage;