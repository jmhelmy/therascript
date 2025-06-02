// lib/firestore.ts

// 1) Import the Firebase “compat” SDK so that `firebase.firestore` is defined:
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// 2) Re‐export Timestamp and FieldValue from the compat namespace:
export const CompatTimestamp = firebase.firestore.Timestamp;
export const compatServerTimestamp = (): firebase.firestore.FieldValue => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

// 3) If you need types elsewhere, alias them here:
export type FirestoreTimestamp = firebase.firestore.Timestamp;
export type FirestoreFieldValue = firebase.firestore.FieldValue;

// 4) Example interface using those types:
export interface TherapySessionNote {
  therapistId: string;
  createdAt: FirestoreTimestamp | FirestoreFieldValue; // serverTimestamp() yields a FieldValue
  structuredContent: string;
  sessionDate: FirestoreTimestamp;
  id?: string;
}

// 5) (Optional) You could export a helper to get the Firestore instance:
// export const db = firebase.firestore();

// 6) Ensure this file is treated as a module:
export {};
