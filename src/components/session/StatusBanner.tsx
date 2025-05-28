'use client';
import React from 'react';
import styles from './StatusBanner.module.css';

interface StatusBannerProps {
  message?: string;
}

export function StatusBanner({ message }: StatusBannerProps) {
  if (!message) return null;
  const isError = message.toLowerCase().includes('error') || message.toLowerCase().includes('failed');
  return (
    <div
      className={`${styles.container} ${
        isError ? styles.error : styles.success
      }`}
      role="status"
    >
      {message}
    </div>
  );
}
