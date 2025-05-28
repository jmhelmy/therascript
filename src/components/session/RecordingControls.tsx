'use client';

import React, { useState } from 'react';
import styles from './RecordingControls.module.css';
import { logConsent } from '@/utils/logConsent';

interface RecordingControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
  onStart: () => void;
  onStop: () => void;
}

export function RecordingControls({
  isRecording,
  isProcessing,
  duration,
  onStart,
  onStop,
}: RecordingControlsProps) {
  const [consentLoading, setConsentLoading] = useState(false);

  const format = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = async () => {
    setConsentLoading(true);
    try {
      // Log therapist consent before recording
      await logConsent('v1.0');
      onStart();
    } catch (err) {
      console.error('Consent logging failed:', err);
      alert('Could not log consent. Please try again.');
    } finally {
      setConsentLoading(false);
    }
  };

  const handleClick = isRecording ? onStop : handleStart;
  const disabled = isProcessing || (!isRecording && consentLoading);

  return (
    <div className={styles.wrapper}>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={isRecording ? styles.stopButton : styles.startButton}
      >
        {isRecording
          ? 'Stop Recording'
          : consentLoading
          ? 'Logging Consent…'
          : 'Start Recording'}
      </button>
      <span className={styles.timer}>
        {isRecording
          ? `Recording: ${format(duration)}`
          : `Duration: ${format(duration)}`}
      </span>
    </div>
  );
}
