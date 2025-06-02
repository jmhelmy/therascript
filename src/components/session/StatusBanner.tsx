// src/components/StatusBanner.tsx (or your path to it)
'use client';
import React from 'react';
import defaultStyles from './StatusBanner.module.css'; // Styles local to StatusBanner

interface StatusBannerProps {
  message?: string;
  baseClass?: string;      // Prop for the main container class
  successClass?: string;   // Prop for the success state class
  errorClass?: string;     // Prop for the error state class
}

export function StatusBanner({
  message,
  baseClass,
  successClass,
  errorClass
}: StatusBannerProps) {
  if (!message) return null;

  const isError =
    message.toLowerCase().includes('error') ||
    message.toLowerCase().includes('failed');

  // Use passed-in classes, or fall back to defaults from StatusBanner.module.css
  const containerClass = baseClass || defaultStyles.container;
  const conditionalClass = isError 
    ? (errorClass || defaultStyles.error) 
    : (successClass || defaultStyles.success);

  return (
    <div
      className={`${containerClass} ${conditionalClass}`}
      role="status"
    >
      {message}
    </div>
  );
}