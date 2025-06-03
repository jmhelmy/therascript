// src/lib/saveTherapySessionNote.ts

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Timestamp = firebase.firestore.Timestamp;
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface TherapySessionNoteData {
  therapistId: string;
  createdAt: firebase.firestore.FieldValue;
  sessionDate: firebase.firestore.Timestamp;
  transcript: string;
  soapNote: SoapNote;
  originalAudioFileName: string;
  status: string;
  sessionId: string; // ← required by your Firestore rules
  structuredContent: string;
}

export async function saveTherapySessionNote(
  transcript: string,
  soapNote: SoapNote,
  sessionDate: Date,
  originalAudioFileName: string,
  sessionId: string // ← must be a non‐null string
): Promise<string> {
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  const user = auth.currentUser;

  if (!user) {
    console.error('User not authenticated. Cannot save note.');
    throw new Error('User not authenticated. Please log in again.');
  }

  // Build the exact object that matches your Firestore rules:
  const noteData: TherapySessionNoteData = {
    therapistId: user.uid,
    createdAt: serverTimestamp(),
    sessionDate: Timestamp.fromDate(sessionDate),
    transcript,
    soapNote,
    structuredContent: '', // <-- this satisfies Firestore rules
    originalAudioFileName,
    status: 'complete',
    sessionId,
  };

  // ───────────────────────────────────────────────
  // Debug log: verifies that every required field is present and correctly typed
  console.log('▶️ About to write therapySessionNote:', {
    therapistId: noteData.therapistId,
    transcript: noteData.transcript,
    sessionDate: noteData.sessionDate,           // Firestore Timestamp
    createdAt: noteData.createdAt,               // FieldValue.serverTimestamp()
    originalAudioFileName: noteData.originalAudioFileName,
    status: noteData.status,
    sessionId: noteData.sessionId,
    // (You can also log soapNote if you want to inspect its contents here)
  });
  // ───────────────────────────────────────────────

  try {
    // Use .doc().set(...) so Firestore does not perform an implicit read (which your rules block).
    const docRef = firestore.collection('therapySessionNotes').doc();
    await docRef.set(noteData);

    console.log('✅ Therapy session note saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving therapy session note to Firestore:', error);
    throw new Error('Failed to save therapy note. Please try again.');
  }
}
