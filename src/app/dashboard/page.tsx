'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CaduceusIcon from '@/components/CaduceusIcon';
import Button from '@/components/Button';
import Link from 'next/link';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, firestore as db } from '@/lib/firebaseConfig';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp as FirestoreTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { TopNav } from '@/components/TopNav';
import { NoteCard, NoteCardProps } from '@/components/NoteCard';
import styles from './DashboardPage.module.css';

interface DisplayNote extends NoteCardProps {}

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notes, setNotes] = useState<DisplayNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else router.push('/login');
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Firestore listener
  useEffect(() => {
    if (!user) return;
    setNotesLoading(true);
    setErrorMessage(null);

    const notesRef = collection(db, 'therapySessionNotes');
    const q = query(
      notesRef,
      where('therapistId', '==', user.uid),
      orderBy('sessionDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const arr: DisplayNote[] = [];
        snap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const d = doc.data();
          const date =
            d.sessionDate instanceof FirestoreTimestamp
              ? d.sessionDate.toDate()
              : new Date();
          arr.push({
            id: doc.id,
            date,
            clientInitials: d.clientInitials || 'N/A',
            summary: d.structuredContent || d.summary || 'No summary.',
          });
        });
        setNotes(arr);
        setNotesLoading(false);
      },
      (err) => {
        setErrorMessage(err.message);
        setNotesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Loading state
  if (authLoading) {
    return (
      <div className={styles.pageContainer}>
        <TopNav />
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading user session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <TopNav />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          {user && (
            <p className={styles.welcomeText}>
              Welcome back, <strong>{user.email}</strong>!
            </p>
          )}
          <Link href="/session/record" passHref>
            <Button variant="primary">+ New Session Note</Button>
          </Link>
        </header>

        <main className={styles.mainContent}>
          {errorMessage && (
            <div className={styles.alert}>
              Error loading notes: {errorMessage}
            </div>
          )}

          {notesLoading ? (
            <div className={styles.spinnerWrapper}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>
                Loading your session notes…
              </p>
            </div>
          ) : notes.length === 0 ? (
            <div className={styles.emptyState}>
              <CaduceusIcon className={styles.hipaaBadge} />

              <h2>No session notes yet</h2>
              <p className={styles.emptyStateText}>
                Try 1 hour for free, and then it is $1.50 per hour. 
              </p>

              <div className={styles.buttonGroup}>
                <Button
                  variant="primary"
                  onClick={() => router.push('/session/record')}
                >
                  Start a New Session
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.notesList}>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  date={note.date}
                  clientInitials={note.clientInitials}
                  summary={note.summary}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
