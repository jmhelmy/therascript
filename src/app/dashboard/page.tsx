'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else router.push('/login');
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (user) {
      setNotesLoading(true);
      setErrorMessage(null);
      const notesRef = collection(db, 'therapySessionNotes');
      const q = query(
        notesRef,
        where('therapistId', '==', user.uid),
        orderBy('sessionDate', 'desc')
      );
      const unsub = onSnapshot(
        q,
        (snap) => {
          const arr: DisplayNote[] = [];
          snap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const d = doc.data();
            let date: Date;
            if (d.sessionDate instanceof FirestoreTimestamp) {
              date = d.sessionDate.toDate();
            } else {
              date = new Date(); // fallback
            }
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
      return () => unsub();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className={styles.pageContainer}>
        <TopNav />
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner} />
          <p>Loading user session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <TopNav />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            {user && (
              <p className={styles.welcomeText}>
                Welcome back, <strong>{user.email}</strong>!
              </p>
            )}
            <Link href="/session/record">
              <button className={styles.newSessionBtn}>
                + New Session Note
              </button>
            </Link>
          </div>
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
              <p>Loading your session notes…</p>
            </div>
          ) : notes.length === 0 ? (
            <div className={styles.emptyState}>
              <CaduceusIcon />
              <h2>No session notes yet</h2>
              <p>
                It looks like you haven't created any session notes yet.
                Start one to generate your first clinical note automatically.
              </p>
              <button
                onClick={() => router.push('/session/record')}
                className="startBtn"
              >
                Start a New Session
              </button>
              <button className="tryBtn">
                Try 1 hour for free, after $1/hour
              </button>
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
