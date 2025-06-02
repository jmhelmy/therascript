'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User as FirebaseUser } from 'firebase/auth';

// Hooks for recording & processing
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';

// UI components
import { StatusBanner } from '@/components/session/StatusBanner';
import { ProgressBar } from '@/components/session/ProgressBar';
import Button from '@/components/Button';

// Styles
import styles from './RecordSessionPage.module.css';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function RecordSessionPage() {
  const router = useRouter();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupAuth = async () => {
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      const auth = getAuth();

      unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) {
          setUser(u);
        } else {
          router.push('/login');
        }
        setAuthLoading(false);
      });
    };

    setupAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

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

  const displayStatus = isRecording
    ? `Recording… (${formatDuration(recordingDuration)})`
    : processorStatus || recorderStatus;

  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [didAutoProcess, setDidAutoProcess] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    setStartTime(new Date());
    setDidAutoProcess(false);
    startRecording();
  };

  const handleStop = () => {
    stopRecording();
    setEndTime(new Date());
  };

  useEffect(() => {
    if (!isRecording && audioBlob && user && !didAutoProcess) {
      setDidAutoProcess(true);
      processAudio(audioBlob, user.uid, (success, _, noteId) => {
        if (success) {
          setTimeout(
            () => router.push(noteId ? `/notes/${noteId}` : '/dashboard'),
            1500
          );
        }
      });
    }
  }, [
    isRecording,
    audioBlob,
    user,
    didAutoProcess,
    processAudio,
    router,
  ]);

  if (authLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          <p>Loading authentication…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          <p>User not authenticated. Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <Link href="/dashboard" className={styles.backLink}>
            ← Dashboard
          </Link>
          <h1 className={styles.pageTitle}>Record New Session</h1>
        </div>

        <StatusBanner
          message={displayStatus}
          baseClass={styles.statusMessage}
          successClass={styles.statusSuccess}
          errorClass={styles.statusError}
        />

        {!hasStarted && (
          <p className={styles.disclaimer}>
            By proceeding to record, you confirm you’ve obtained patient consent.
          </p>
        )}

        <div className={styles.controlsWrapper}>
          {!isRecording && !hasStarted && (
            <Button variant="primary" onClick={handleStart}>
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button variant="secondary" onClick={handleStop}>
              Stop Recording
            </Button>
          )}
        </div>

        {hasStarted && endTime && (
          <div className={styles.timeline}>
            {startTime?.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            &nbsp;–&nbsp;
            {endTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            &nbsp;(Duration {recordingDuration})
          </div>
        )}

        {isProcessing && <ProgressBar progress={uploadProgress} />}
      </div>
    </div>
  );
}
