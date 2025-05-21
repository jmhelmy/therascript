// src/app/dashboard/page.tsx
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
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { TopNav } from '@/components/TopNav'; // Import TopNav

// Define your primary color
const PRIMARY_COLOR_HEX = '#009DA3';

// Simple Caduceus SVG as a placeholder for the HIPAA logo
const CaduceusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-20 h-20 text-[${PRIMARY_COLOR_HEX}]`}>
    {/* Using a generic medical-like symbol. Replace with your actual logo if available. */}
    {/* This is a simplified caduceus/rod of Asclepius representation */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h.008v.008h-.008v-.008zm0 0H20.625a1.125 1.125 0 001.125-1.125V14.25m-17.25 4.5V6.375c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v11.25m-17.25 0h17.25m-17.25 0V6.375M3.375 6.375h17.25m0 0V3.375c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v3M3.375 6.375V3.375c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v3m0 0v1.875m0 0H9.75m0 0v1.875m0 0H12.375m0 0v1.875m0 0h2.625m0 0v1.875M12 13.5v2.625m0 0H9.75M12 16.125H14.25" />
  </svg>
);

interface TherapyNote {
  id: string;
  sessionDate: Date;
  clientInitials?: string;
  summary?: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<TherapyNote[]>([]);
  const [notesLoading, setNotesLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      setNotesLoading(true);
      setErrorMessage(null);
      const notesCollectionRef = collection(db, 'therapySessionNotes');
      const q = query(
        notesCollectionRef,
        where('therapistId', '==', user.uid),
        orderBy('sessionDate', 'desc')
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedNotes: TherapyNote[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            const sessionDate = data.sessionDate instanceof Timestamp
              ? data.sessionDate.toDate()
              : new Date(data.sessionDate); // Fallback
            fetchedNotes.push({
              id: doc.id,
              sessionDate: sessionDate,
              clientInitials: data.clientInitials || 'N/A',
              summary: data.summary || data.soapNote?.objective || 'No summary available.',
            });
          });
          setNotes(fetchedNotes);
          setNotesLoading(false);
        },
        (error) => {
          console.error("Error fetching therapy notes:", error);
          setErrorMessage("Failed to load therapy notes. Please try again.");
          setNotesLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
        <p className="text-lg text-gray-600">Loading user session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
        <p className="text-lg text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 font-sans">
      <TopNav /> {/* Include TopNav here */}
      <div className="p-4 md:p-6">
        <header className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
          <div>
            {/* Title moved to TopNav, keeping user welcome message */}
            <p className={`text-sm text-[${PRIMARY_COLOR_HEX}]`}>Welcome back, {user.email}!</p>
          </div>
          <Link href="/session/record" legacyBehavior>
              <a className={`px-5 py-2.5 text-sm font-medium text-white bg-[${PRIMARY_COLOR_HEX}] rounded-lg shadow-md hover:bg-opacity-80 focus:ring-4 focus:ring-opacity-50 focus:ring-[${PRIMARY_COLOR_HEX}] transition-colors duration-150`}>
                + New Session Note
              </a>
          </Link>
        </header>

        <main className="max-w-5xl mx-auto">
          {errorMessage && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong> {errorMessage}
            </div>
          )}

          {notesLoading ? (
            <div className="py-10 text-center">
              <p className="text-lg text-gray-500">Loading your session notes...</p>
            </div>
          ) : notes.length === 0 ? (
            // Empty State UI from image_e39ebb.png
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl shadow-lg md:py-20">
              <div className="mb-6">
                <CaduceusIcon />
              </div>
              <h2 className="mb-3 text-2xl font-semibold text-slate-700">
                No session script yet
              </h2>
              <p className="mb-8 text-slate-500">Start a new session to generate your first clinical note.</p>
              <Link href="/session/record" legacyBehavior>
                <a className={`w-full max-w-xs px-6 py-3 mb-4 text-lg font-semibold text-white transition-colors duration-150 ease-in-out rounded-lg bg-[${PRIMARY_COLOR_HEX}] hover:bg-opacity-80 focus:ring-4 focus:ring-opacity-50 focus:ring-[${PRIMARY_COLOR_HEX}]`}>
                  Start a new session
                </a>
              </Link>
              <button
                onClick={() => alert('Subscription/Payment feature coming soon!')}
                className={`w-full max-w-xs px-6 py-3 text-lg font-semibold transition-colors duration-150 ease-in-out border rounded-lg text-[${PRIMARY_COLOR_HEX}] border-[${PRIMARY_COLOR_HEX}] hover:bg-[${PRIMARY_COLOR_HEX}] hover:text-white hover:bg-opacity-10 focus:ring-4 focus:ring-opacity-50 focus:ring-[${PRIMARY_COLOR_HEX}]`}
              >
                Try 1 hour for free, after $1/hour
              </button>
            </div>
          ) : (
            // Notes List UI
            <div className="space-y-6">
              {notes.map((note) => (
                <div key={note.id} className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-wrap items-start justify-between mb-2">
                    <h3 className={`text-lg font-semibold text-[${PRIMARY_COLOR_HEX}]`}>
                      Session: {note.sessionDate.toLocaleDateString()}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {note.sessionDate.toLocaleTimeString()}
                    </span>
                  </div>
                  {note.clientInitials && (
                    <p className="mb-1 text-sm text-slate-600">Client: {note.clientInitials}</p>
                  )}
                  <p className="text-sm leading-relaxed text-slate-700 line-clamp-3">
                    {note.summary}
                  </p>
                  <Link href={`/notes/${note.id}`} legacyBehavior> {/* Make sure this route exists or will exist */}
                    <a className={`inline-block mt-3 text-sm font-medium text-[${PRIMARY_COLOR_HEX}] hover:text-opacity-80`}>
                      View Details &rarr;
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;