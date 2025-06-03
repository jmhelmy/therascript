import {
  collection,
  addDoc,
  Timestamp,
  DocumentReference,
} from 'firebase/firestore';
import { firestore as db } from './firebaseConfig';

export interface TherapySessionNote {
  therapistId: string;
  createdAt: Timestamp;
  structuredContent: string;
  sessionDate: Timestamp;
}

export async function saveTherapySessionNote(
  note: TherapySessionNote
): Promise<DocumentReference> {
  try {
    const docRef = await addDoc(collection(db, 'therapySessionNotes'), note);
    return docRef;
  } catch (error) {
    console.error('Error saving therapy session note:', error);
    throw error; // Re-throw the error for handling in the calling component
  }
}