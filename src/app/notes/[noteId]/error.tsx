// src/app/notes/[noteId]/error.tsx  OR  src/app/notes/error.tsx
"use client";

import { useEffect } from 'react';

export default function NoteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Error in NotePage segment:", error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Oops! Something went wrong loading this note.</h2>
      <p style={{ color: 'red', margin: '1rem 0' }}>{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          color: 'white',
          backgroundColor: '#0070f3',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}