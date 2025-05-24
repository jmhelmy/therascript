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
  Timestamp as FirestoreTimestamp, // Use FirestoreTimestamp for data from Firestore
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { TopNav } from '@/components/TopNav';
import { NoteCard, NoteCardProps } from '@/components/NoteCard'; // Import NoteCardProps

// CaduceusIcon can be moved to its own file in components/ if used elsewhere
const CaduceusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-[#009DA3]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h.008v.008h-.008v-.008zm0 0H20.625a1.125 1.125 0 001.125-1.125V14.25m-17.25 0V6.375c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v11.25m-17.25 0h17.25M3.375 6.375h17.25M20.625 6.375V3.375c0-.621-.504-1.125-1.125-1.125h-1.5c.621 0-1.125.504-1.125 1.125v3m0 0v1.875m0 0H9.75m0 0v1.875m0 0H12.375m0 0v1.875m0 0h2.625m0 0v1.875M12 13.5v2.625m0 0H9.75M12 16.125H14.25" />
  </svg>
);

// Client-side interface for notes to be displayed by NoteCard
interface DisplayNote extends NoteCardProps {} // NoteCardProps already defines id, date, clientInitials, summary

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notes, setNotes] = useState<DisplayNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
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
    if (user && db) {
      setNotesLoading(true);
      setErrorMessage(null); // Clear previous errors
      console.log("DashboardPage: Setting up Firestore listener for therapistId:", user.uid);

      const notesCollectionRef = collection(db, 'therapySessionNotes');
      const q = query(
        notesCollectionRef,
        where('therapistId', '==', user.uid),
        orderBy('sessionDate', 'desc') // Assuming sessionDate is a Firestore Timestamp
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const notesList: DisplayNote[] = [];
          querySnapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => { // Renamed doc to docSnap for clarity
            const data = docSnap.data();
            
            let sessionDateJs: Date;
            if (data.sessionDate instanceof FirestoreTimestamp) {
              sessionDateJs = data.sessionDate.toDate();
            } else if (data.sessionDate && typeof data.sessionDate.seconds === 'number') { // Handle plain object from emulator sometimes
              sessionDateJs = new FirestoreTimestamp(data.sessionDate.seconds, data.sessionDate.nanoseconds).toDate();
            } else {
              console.warn("DashboardPage: sessionDate is not a Firestore Timestamp for doc:", docSnap.id, data.sessionDate);
              sessionDateJs = new Date(); // Fallback to current date or handle error
            }

            notesList.push({
              id: docSnap.id,
              date: sessionDateJs, // Pass JS Date to NoteCard
              clientInitials: data.clientInitials || 'N/A', // Ensure your Firestore doc has clientInitials
              summary: data.structuredContent || data.summary || 'No summary available.', // Prefer structuredContent
            });
          });
          setNotes(notesList);
          setNotesLoading(false);
          console.log("DashboardPage: Notes fetched/updated:", notesList);
        },
        (error) => {
          console.error("DashboardPage: Error loading notes via onSnapshot:", error);
          setErrorMessage(`Error loading notes: ${error.message}`);
          setNotesLoading(false);
        }
      );
      return () => {
        console.log("DashboardPage: Unsubscribing from Firestore listener for therapistId:", user.uid);
        unsubscribe();
      };
    } else if (!user && !authLoading) {
        // If auth has loaded and there's no user, ensure notes are cleared and not loading
        setNotes([]);
        setNotesLoading(false);
    }
  }, [user, authLoading]); // Re-run when user or authLoading state changes

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 text-slate-700">
        <p>Loading user session...</p>
      </div>
    );
  }
  // No explicit !user loading state here as onAuthStateChanged handles redirection

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 font-sans">
      <TopNav />
      <div className="p-4 md:p-6 lg:p-8">
        <header className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            {user && <p className="text-base text-slate-700">Welcome back, <span className="font-semibold text-[#009DA3]">{user.email}</span>!</p>}
          </div>
          <Link
            href="/session/record"
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-center text-white bg-[#009DA3] rounded-lg shadow-md hover:bg-[#007c80] focus:ring-4 focus:ring-opacity-50 focus:ring-[#009DA3] transition-colors duration-150"
          >
            + New Session Note
          </Link>
        </header>

        <main className="max-w-5xl mx-auto">
          {errorMessage && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow" role="alert">
              <strong className="font-bold">Error: </strong> {errorMessage}
            </div>
          )}

          {notesLoading ? (
            <div className="py-20 text-center">
              {/* Simple spinner */}
              <div className="inline-block w-12 h-12 border-4 border-[#009DA3] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-slate-500">Loading your session notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl shadow-xl md:py-20 border border-slate-200">
              <div className="mb-6"><CaduceusIcon /></div>
              <h2 className="mb-3 text-2xl font-semibold text-slate-700">
                No session notes yet
              </h2>
              <p className="mb-8 max-w-md text-slate-500">
                It looks like you haven't created any session notes.
                Start a new session to generate your first clinical note automatically.
              </p>
              <Link
                href="/session/record"
                className="w-full max-w-xs px-6 py-3 mb-4 text-lg font-semibold text-white transition-colors duration-150 ease-in-out rounded-lg bg-[#009DA3] hover:bg-[#007c80] focus:ring-4 focus:ring-opacity-50 focus:ring-[#009DA3]"
              >
                Start a New Session
              </Link>
              <button
                onClick={() => alert('Subscription/Payment feature coming soon!')}
                className="w-full max-w-xs px-6 py-3 text-lg font-semibold transition-colors duration-150 ease-in-out border rounded-lg text-[#009DA3] border-[#009DA3] hover:bg-[#009DA3] hover:text-white focus:ring-4 focus:ring-opacity-50 focus:ring-[#009DA3]"
              >
                Try 1 hour for free, after $1/hour
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  date={note.date} // Pass the JS Date object
                  clientInitials={note.clientInitials || ''}
                  summary={note.summary || ''}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}