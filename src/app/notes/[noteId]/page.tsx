// src/app/notes/[noteId]/page.tsx
import { dbAdmin } from '@/lib/adminFirebase';
import { Timestamp as FirestoreAdminTimestamp } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
// Assuming you want to use Tailwind classes as per your last full paste of this file's JSX
// If you created NotePage.module.css and want to use it, uncomment the line below
// import styles from './NotePage.module.css'; 

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
  // The 'params' prop for an async server component in newer Next.js versions
  // might behave as if it needs to be awaited if the runtime indicates so.
  // The type here is what Next.js *should* pass after resolving.
  params: { noteId: string };
}

export default async function NotePage({ params }: NotePageProps) {
  // Per Next.js 15 canary error message: "params should be awaited before using its properties"
  // This is unusual for params prop directly, but we follow the error message.
  // It's possible 'params' itself is a promise or needs resolution in this Next.js version.
  const resolvedParams = await params; 
  const { noteId } = resolvedParams;   

  if (!noteId) {
    console.error("NotePage (Server Component): noteId parameter is missing after await.");
    return notFound(); // Use return notFound() for clarity that execution stops
  }

  console.log(`NotePage (Server Component): Fetching note with ID: ${noteId}`);
  
  let noteData: NoteDocument | null = null;
  try {
    const noteDocRef = dbAdmin.collection('therapySessionNotes').doc(noteId);
    const noteSnap = await noteDocRef.get();

    if (!noteSnap.exists()) { 
      console.log(`NotePage (Server Component): Note not found for ID: ${noteId}`);
      return notFound(); // Use return notFound()
    }
    noteData = noteSnap.data() as NoteDocument; 
  } catch (error) {
    console.error(`NotePage (Server Component): Error fetching document with ID ${noteId}:`, error);
    throw new Error(`Failed to fetch note: ${noteId}. Please check server logs.`);
  }

  if (!noteData) { 
    console.error("NotePage (Server Component): noteData is unexpectedly null after fetch attempts.");
    return notFound(); 
  }

  if (!noteData.sessionDate || typeof noteData.sessionDate.toDate !== 'function') {
    console.error("NotePage: sessionDate is missing or not a Firestore Timestamp.", JSON.stringify(noteData.sessionDate));
    throw new Error("Invalid session date in fetched note data.");
  }
  if (!noteData.createdAt || typeof noteData.createdAt.toDate !== 'function') {
    console.error("NotePage: createdAt is missing or not a Firestore Timestamp.", JSON.stringify(noteData.createdAt));
    throw new Error("Invalid creation date in fetched note data.");
  }

  const sessionDate = noteData.sessionDate.toDate();
  const createdAtDate = noteData.createdAt.toDate();

  return (
    // Using Tailwind classes as per your last full paste of this file's JSX
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 py-8">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sky-600 hover:text-sky-700 hover:underline text-sm transition-colors duration-150"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <article className="p-6 sm:p-8 bg-white rounded-xl shadow-xl border border-slate-200">
          <header className="pb-4 mb-6 border-b border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Session Note
            </h1>
            <div className="text-sm text-slate-500 space-y-1.5">
              <p><strong className="font-medium text-slate-600">Note ID:</strong> {noteId}</p>
              <p>
                <strong className="font-medium text-slate-600">Session Date:</strong>{' '}
                {sessionDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} 
                {' at '}
                {sessionDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
              <p>
                <strong className="font-medium text-slate-600">Note Created:</strong>{' '}
                {createdAtDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} 
                {' at '}
                {createdAtDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
              {noteData.originalAudioFileName && <p><strong className="font-medium text-slate-600">Original Audio:</strong> {noteData.originalAudioFileName}</p>}
              {noteData.status && (
                <p>
                  <strong className="font-medium text-slate-600">Status:</strong>{' '}
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
              {noteData.transcript || "No transcript available."}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              SOAP Note / Structured Content
            </h2>
            <div className="p-4 text-sm leading-relaxed bg-slate-50 rounded-lg shadow-inner whitespace-pre-wrap border border-slate-200">
              {noteData.structuredContent || "No structured note content available."}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}