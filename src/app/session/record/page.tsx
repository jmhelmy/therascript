// src/app/session/record/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';
import styles from './RecordSessionPage.module.css';
import { StatusBanner } from '@/components/session/StatusBanner';
import { RecordingControls } from '@/components/session/RecordingControls';
import { AudioReview } from '@/components/session/AudioReview';
import { ProgressBar } from '@/components/session/ProgressBar';

export default function RecordSessionPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
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
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else {
        setRecorderStatus?.('Redirecting to login…');
        router.push('/login');
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [router, setRecorderStatus]);

  const handleProcessAudio = () => {
    if (audioBlob && user) {
      processAudio(audioBlob, user.uid, (success, _, noteId) => {
        if (success) {
          setTimeout(
            () => router.push(noteId ? `/notes/${noteId}` : '/dashboard'),
            2_000
          );
        }
      });
    }
  };

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.statusText}>Loading authentication…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.statusText}>
          User not authenticated. Redirecting to login…
        </p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Record New Session</h1>
          <Link href="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
        </div>

        <StatusBanner message={displayStatus} />
      <RecordingControls
        isRecording={isRecording}
        isProcessing={isProcessing}
        duration={recordingDuration}
        onStart={startRecording}
        onStop={stopRecording}
      />
      {audioBlob && !isRecording && (
        <AudioReview
          audioBlob={audioBlob}
          isProcessing={isProcessing}
          uploadProgress={uploadProgress}
          onProcess={handleProcessAudio}
        />
      )}
      <ProgressBar progress={uploadProgress} />
    </div>

    </div>
  );
}
