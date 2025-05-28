'use client';
import React from 'react';
import styles from './RecordingControls.module.css';

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
  const format = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={isProcessing}
        className={
          isRecording ? styles.stopButton : styles.startButton
        }
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <span className={styles.timer}>
        {isRecording
          ? `Recording: ${format(duration)}`
          : `Duration: ${format(duration)}`}
      </span>
    </div>
  );
}
