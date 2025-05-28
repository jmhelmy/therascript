'use client';
import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  if (progress <= 0) return null;
  return (
    <div className={styles.container}>
      <div
        className={styles.filler}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
