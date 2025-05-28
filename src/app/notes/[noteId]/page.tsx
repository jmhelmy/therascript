// src/app/notes/[noteId]/page.tsx

import { dbAdmin } from '@/lib/adminFirebase';
import { Timestamp as FirestoreAdminTimestamp } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './NotePage.module.css';

interface NoteDocument {
  therapistId: string;
  sessionDate: FirestoreAdminTimestamp;
  transcript: string;
  structuredContent: string;
  originalAudioFileName: string;
  createdAt: FirestoreAdminTimestamp;
  status?: string;
  clientInitials?: string;
}

interface NotePageProps {
  params: { noteId: string };
}

export default async function NotePage({ params }: NotePageProps) {
  // ⚠️ you must await params before destructuring
  const { noteId } = await params;

  if (!noteId) return notFound();

  const noteSnap = await dbAdmin
    .collection('therapySessionNotes')
    .doc(noteId)
    .get();

  if (!noteSnap.exists) return notFound();

  const noteData = noteSnap.data() as NoteDocument;

  const sessionDate = noteData.sessionDate.toDate();
  const createdAtDate = noteData.createdAt.toDate();

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.backLinkContainer}>
          <Link href="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
        </div>

        <article className={styles.articleCard}>
          <header className={styles.articleHeader}>
            <h1 className={styles.title}>Session Note</h1>
            <div className={styles.detailsMeta}>
              <p>
                <strong>Note ID:</strong> {noteId}
              </p>
              <p>
                <strong>Session Date:</strong>{' '}
                {sessionDate.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at{' '}
                {sessionDate.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              <p>
                <strong>Note Created:</strong>{' '}
                {createdAtDate.toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {createdAtDate.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              {noteData.originalAudioFileName && (
                <p>
                  <strong>Original Audio:</strong>{' '}
                  {noteData.originalAudioFileName}
                </p>
              )}
              {noteData.status && (
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={styles.statusBadge}>
                    {noteData.status}
                  </span>
                </p>
              )}
            </div>
          </header>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Transcript</h2>
            <pre className={styles.textBlock}>
              {noteData.transcript || 'No transcript available.'}
            </pre>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>
              Notes
            </h2>
            <div className={styles.textBlock}>
              {noteData.structuredContent ||
                'No structured note content available.'}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
