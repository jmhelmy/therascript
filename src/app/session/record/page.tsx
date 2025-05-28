// src/app/session/record/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

// Hooks for recording & processing
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';

// UI components
import { StatusBanner } from '@/components/session/StatusBanner';
import { ProgressBar } from '@/components/session/ProgressBar';
import Button from '@/components/Button';              // ← now actually used!

// Styles
import styles from './RecordSessionPage.module.css';

export default function RecordSessionPage() {
  const router = useRouter();

  // — AUTH STATE & GUARD —
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else router.push('/login');
      setAuthLoading(false);
    });
    return unsub;
  }, [router]);

  // — RECORDING HOOK —
  const {
    isRecording,
    recordingDuration,  // "MM:SS"
    audioBlob,
    startRecording,
    stopRecording,
    statusMessage: recorderStatus,
    setStatusMessage: setRecorderStatus,
  } = useAudioRecorder();

  // — PROCESSING HOOK —
  const {
    isProcessing,
    uploadProgress,
    processAudio,
    statusMessage: processorStatus,
  } = useAudioProcessor();

  // Show whichever status message is set last
  const displayStatus = processorStatus || recorderStatus;

  // — TIMING & AUTO-PROCESS GUARD —
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [didAutoProcess, setDidAutoProcess] = useState(false);

  // Wrap start to capture timestamp
  const handleStart = () => {
    setHasStarted(true);
    setStartTime(new Date());
    setDidAutoProcess(false);
    startRecording();
  };

  // Wrap stop to capture timestamp
  const handleStop = () => {
    stopRecording();
    setEndTime(new Date());
  };

  // Once recording stops, process exactly once
  useEffect(() => {
    if (
      !isRecording &&
      audioBlob &&
      user &&
      !didAutoProcess
    ) {
      setDidAutoProcess(true);
      processAudio(audioBlob, user.uid, (success, _, noteId) => {
        if (success) {
          // give it a moment, then navigate
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

  // — LOADING & REDIRECT STATES —
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

  // — MAIN RENDER —
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>

        {/* Header with title + back link */}
        <div className={styles.headerRow}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Dashboard
        </Link>
        <h1 className={styles.pageTitle}>Record New Session</h1>
      </div>


        {/* Status banner shows “Recording…”, “Uploading…”, etc. */}
        <StatusBanner
          message={displayStatus}
          baseClass={styles.statusMessage}
          successClass={styles.statusSuccess}
          errorClass={styles.statusError}
        />

        {/* Pre-record disclaimer (neutral color) */}
        {!hasStarted && (
          <p className={styles.disclaimer}>
            By proceeding to record, you confirm you’ve obtained patient consent.
          </p>
        )}

        {/* BUTTON CONTROLS: Start / Stop */}
        <div className={styles.controlsWrapper}>
          {/* Only show “Start Recording” if not started yet */}
          {!isRecording && !hasStarted && (
            <Button variant="primary" onClick={handleStart}>
              Start Recording
            </Button>
          )}

          {/* While recording, show “Stop Recording” */}
          {isRecording && (
            <Button variant="secondary" onClick={handleStop}>
              Stop Recording
            </Button>
          )}
        </div>

        {/* Timeline & Duration after you stop */}
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

        {/* Progress bar while processing (auto) */}
        {isProcessing && (
          <ProgressBar progress={uploadProgress} />
        )}
      </div>
    </div>
  );
}
