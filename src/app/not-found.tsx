// src/app/notes/[noteId]/page.tsx
import { firestore } from '@/lib/firebaseConfig'; // Your client-side Firebase config
import { doc, getDoc, Timestamp as FirestoreTimestamp } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // For a "Back to Dashboard" link

// Define the expected structure of your note document in Firestore
interface TherapyNoteDocument {
  therapistId: string;
  sessionDate: FirestoreTimestamp; // Firestore Timestamp object
  transcript: string;
  structuredContent: string;
  originalAudioFileName: string;
  createdAt: FirestoreTimestamp; // Firestore Timestamp object
  status?: string;
  // Add any other fields you expect
}

interface NotePageProps {
  params: {
    noteId: string; // This comes from the folder name [noteId]
  };
}

// This is an async Server Component by default in the App Router
export default async function NotePage({ params }: NotePageProps) {
  const { noteId } = params;

  if (!noteId) {
    // This case should ideally be handled by Next.js routing itself
    // if the route is /notes/[noteId], noteId will always be present if the route matches.
    console.error("NotePage: noteId parameter is missing.");
    notFound(); 
  }

  const noteRef = doc(firestore, "therapySessionNotes", noteId);
  
  console.log(`NotePage: Fetching note with ID: ${noteId} from path: ${noteRef.path}`);
  
  let noteSnap;
  try {
    noteSnap = await getDoc(noteRef);
  } catch (error) {
    console.error(`NotePage: Error fetching document with ID ${noteId}:`, error);
    // You might want to render a specific error message or use a global error boundary
    // For now, if fetching fails, we'll treat it as not found.
    notFound();
  }

  if (!noteSnap.exists()) {
    console.log(`NotePage: Note not found for ID: ${noteId}`);
    notFound(); // This will render your src/app/not-found.tsx page
  }

  const noteData = noteSnap.data() as TherapyNoteDocument;

  // Convert Firestore Timestamps to JavaScript Date objects for easier formatting
  const sessionDate = noteData.sessionDate?.toDate ? noteData.sessionDate.toDate() : new Date();
  const createdAtDate = noteData.createdAt?.toDate ? noteData.createdAt.toDate() : new Date();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* You might want to include your TopNav or a similar navigation component here */}
      {/* Example: <TopNav /> */}
      <main style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/dashboard" className="text-sky-600 hover:text-sky-800 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
          Session Note
        </h1>
        
        <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Details</h2>
            <div style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
              <p><strong>Note ID:</strong> {noteId}</p>
              <p>
                <strong>Session Date:</strong>{' '}
                {sessionDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} 
                at {sessionDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p>
                <strong>Note Created On:</strong>{' '}
                {createdAtDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} 
                at {createdAtDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>
              {noteData.originalAudioFileName && <p><strong>Original Audio File:</strong> {noteData.originalAudioFileName}</p>}
              {noteData.status && <p><strong>Status:</strong> {noteData.status}</p>}
            </div>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Transcript</h2>
            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '4px', border: '1px solid #e5e7eb', maxHeight: '300px', overflowY: 'auto', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {noteData.transcript || "No transcript available."}
            </pre>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>SOAP Note</h2>
            <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {noteData.structuredContent || "No structured note content available."}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}