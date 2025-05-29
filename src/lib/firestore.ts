// src/lib/firestore.ts

import firebase from 'firebase/app';
import 'firebase/firestore';
import { firestore } from './firebaseConfig'; // Updated import

export interface TherapySessionNote {
  therapistId: string;
  createdAt: firebase.firestore.Timestamp;
  structuredContent: string;
  sessionDate: firebase.firestore.Timestamp;
}

/**
 * Saves a therapy session note to Firestore.
 * @param note The TherapySessionNote to save.
 * @returns A promise resolving to the new document reference.
 */
export function saveTherapySessionNote(
  note: TherapySessionNote
): Promise<firebase.firestore.DocumentReference> {
  return firestore.collection('therapySessionNotes').add(note);
}