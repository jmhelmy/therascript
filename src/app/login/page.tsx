// src/app/debug-token/page.tsx (or your chosen path)
'use client';

import { useEffect, useState } from 'react';
// Import the initialized auth instance from your central Firebase config
// This assumes firebaseConfig.ts exports 'auth' correctly as we've discussed
import { auth } from '@/lib/firebaseConfig'; // Make sure this path is correct for your project
import type { User } from 'firebase/auth'; // For User type, can also be dynamically imported if preferred

export default function DebugTokenPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupAuthListenerAndFetchToken = async () => {
      try {
        // Dynamically import onAuthStateChanged from firebase/auth
        // This aligns with the strategy to reduce static bundling issues
        const { onAuthStateChanged } = await import('firebase/auth');

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setIsLoading(true); // Reset loading state on auth change
          if (user) {
            setCurrentUser(user);
            console.log("User is signed in:", user.uid, user.email);
            try {
              const token = await user.getIdToken(true); // Pass true to force refresh if needed
              console.log("🔥 Firebase ID Token:", token);
              setIdToken(token);
              setError(null);
            } catch (tokenError: any) {
              console.error("Error getting ID token:", tokenError);
              setError(`Error getting ID token: ${tokenError.message || 'Unknown token error'}`);
              setIdToken(null);
            }
          } else {
            console.log("⚠️ No user is signed in.");
            setCurrentUser(null);
            setError("No user is currently signed in.");
            setIdToken(null);
          }
          setIsLoading(false);
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();

      } catch (importError: any) {
        console.error("Error importing Firebase Auth module:", importError);
        setError(`Failed to load Firebase Auth: ${importError.message || 'Import error'}`);
        setIsLoading(false);
      }
    };

    setupAuthListenerAndFetchToken();
  }, []); // Empty dependency array ensures this runs once on mount

  if (isLoading) {
    return <div>Loading user state and attempting to fetch token... check the console.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Firebase ID Token Debugger</h1>
      {currentUser ? (
        <p>
          Signed in as: <strong>{currentUser.email || currentUser.uid}</strong>
        </p>
      ) : (
        <p>No user is currently signed in.</p>
      )}

      {idToken && (
        <div style={{ marginTop: '20px' }}>
          <h3>✅ ID Token Fetched Successfully:</h3>
          <textarea
            readOnly
            value={idToken}
            rows={15}
            style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '12px' }}
          />
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '20px' }}>
          <strong>Error:</strong> {error}
        </p>
      )}
      <p style={{ marginTop: '20px' }}>
        <em>(Check the browser's developer console for more detailed logs.)</em>
      </p>
    </div>
  );
}