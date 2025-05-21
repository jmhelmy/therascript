import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from './firebaseConfig'; // Assuming you have initialized Firestore in firebaseConfig.ts

export interface TherapySessionNote {
  therapistId: string;
  createdAt: firebase.firestore.Timestamp;
  structuredContent: string;
  sessionDate: firebase.firestore.Timestamp;
}

export async function saveTherapySessionNote(note: TherapySessionNote): Promise<firebase.firestore.DocumentReference> {
  try {
    const docRef = await db.collection('therapySessionNotes').add(note);
    return docRef;
  } catch (error) {
    console.error('Error saving therapy session note:', error);
    throw error; // Re-throw the error for handling in the calling component
  }
}