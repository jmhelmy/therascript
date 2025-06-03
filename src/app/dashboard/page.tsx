'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import DashboardContainer from './DashboardContainer';
import TopNav from '@/components/TopNav';

// ✅ Initialize Firebase if it isn't already
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  });
}

export default function DashboardPage() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);

        // 🔥 You can send this token to your backend if needed
        const token = await firebaseUser.getIdToken(true);
        console.log('🧪 Firebase ID Token:', token);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard…</p>;
  }

  // Sanitize providerData to remove nulls
  const safeUser = user && {
    ...user,
    providerData: user.providerData.filter((p): p is firebase.UserInfo => p !== null)
  };

  return (
    <>
      <TopNav />
      <DashboardContainer user={safeUser!} />
    </>
  );
}
