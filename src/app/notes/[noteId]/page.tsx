// src/app/notes/[noteId]/page.tsx

import { dbAdmin } from '@/lib/adminFirebase';
import { Timestamp as FirestoreAdminTimestamp } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  // 🔑 New Next.js 15+ dynamic API: params is a Promise
  const { noteId } = await params;

  if (!noteId) {
    console.error("NotePage: noteId parameter is missing.");
    notFound();
  }

  let noteData: NoteDocument;
  try {
    const snap = await dbAdmin
      .collection('therapySessionNotes')
      .doc(noteId)
      .get();

    if (!snap.exists) {
      console.log(`NotePage: Note not found for ID: ${noteId}`);
      notFound();
    }

    noteData = snap.data() as NoteDocument;
  } catch (error) {
    console.error(`NotePage: Error fetching document ${noteId}:`, error);
    throw new Error(`Failed to fetch note: ${noteId}`);
  }

  const sessionDate = noteData.sessionDate.toDate();
  const createdAtDate = noteData.createdAt.toDate();

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <main className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sky-600 hover:text-sky-700 hover:underline text-sm"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <article className="p-6 sm:p-8 bg-white rounded-xl shadow-xl border border-slate-200">
          <header className="pb-4 mb-6 border-b border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Session Note
            </h1>
            <div className="text-xs text-slate-500 space-y-1.5">
              <p>
                <strong className="text-slate-600">Note ID:</strong> {noteId}
              </p>
              <p>
                <strong className="text-slate-600">Session Date:</strong>{' '}
                {sessionDate.toLocaleDateString()} at{' '}
                {sessionDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              <p>
                <strong className="text-slate-600">Note Created:</strong>{' '}
                {createdAtDate.toLocaleDateString()} at{' '}
                {createdAtDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              {noteData.originalAudioFileName && (
                <p>
                  <strong className="text-slate-600">
                    Original Audio:
                  </strong>{' '}
                  {noteData.originalAudioFileName}
                </p>
              )}
              {noteData.status && (
                <p>
                  <strong className="text-slate-600">Status:</strong>{' '}
                  <span className="ml-1 px-2 py-0.5 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">
                    {noteData.status}
                  </span>
                </p>
              )}
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Transcript
            </h2>
            <pre className="p-4 text-sm leading-relaxed bg-slate-50 rounded-lg shadow-inner whitespace-pre-wrap max-h-[300px] overflow-y-auto border border-slate-200">
              {noteData.transcript || 'No transcript available.'}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              SOAP Note / Structured Content
            </h2>
            <div className="p-4 text-sm leading-relaxed bg-slate-50 rounded-lg shadow-inner whitespace-pre-wrap border border-slate-200">
              {noteData.structuredContent ||
                'No structured note content available.'}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
