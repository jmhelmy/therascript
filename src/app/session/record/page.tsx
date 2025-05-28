'use client';
import styles from './RecordSessionPage.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';

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
  } = useAudioProcessor();

  const displayStatus = processorStatus || recorderStatus;

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
    if (audioBlob && user) {
      processAudio(audioBlob, user.uid, (success, message, noteId) => {
        if (success) {
          setTimeout(() => {
            if (noteId) {
              router.push(`/notes/${noteId}`);
            } else {
              router.push('/dashboard');
            }
          }, 2000);
        }
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.statusText}>Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.statusText}>User not authenticated. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Record New Session</h1>
          <Link href="/dashboard" className={styles.backLink}>
            &larr; Back to Dashboard
          </Link>
        </div>

        {displayStatus && (
          <p
            className={`${styles.statusBox} ${displayStatus.toLowerCase().includes('error') || displayStatus.toLowerCase().includes('failed') ? styles.errorStatus : styles.successStatus}`}
          >
            {displayStatus}
          </p>
        )}

        <div className={styles.buttonGroup}>
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isProcessing || isRecording}
              className={styles.startButton}
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              disabled={isProcessing}
              className={styles.stopButton}
            >
              Stop Recording
            </button>
          )}
        </div>

        {isRecording && (
          <p className={styles.timerText}>Recording Time: {formatDuration(recordingDuration)}</p>
        )}

        {audioBlob && !isRecording && (
          <div className={styles.reviewSection}>
            <h2 className={styles.reviewTitle}>Review Audio</h2>
            <audio controls src={URL.createObjectURL(audioBlob)} className={styles.audioPlayer}></audio>
            <button
              onClick={handleProcessAudio}
              disabled={isProcessing || !audioBlob}
              className={styles.processButton}
            >
              {isProcessing ? `Processing (${Math.round(uploadProgress)}%)...` : 'Process & Generate Note'}
            </button>
          </div>
        )}

        {isProcessing && uploadProgress > 0 && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordSessionPage;
