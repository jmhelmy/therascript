// src/lib/saveTherapySessionNote.ts
import firebase from 'firebase/compat/app'; // Import the main firebase compat object
import 'firebase/compat/auth';            // Import for side effect: adds firebase.auth()
import 'firebase/compat/firestore';       // Import for side effect: adds firebase.firestore()

// Access Timestamp and serverTimestamp via the firebase.firestore namespace
const Timestamp = firebase.firestore.Timestamp;
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

// Define an interface for the note data
export interface TherapySessionNoteData {
  therapistId: string;
  createdAt: firebase.firestore.FieldValue; // Correct type for serverTimestamp()
  sessionDate: firebase.firestore.Timestamp; // Store as Firestore Timestamp
  structuredContent: string;
  sessionIdForLog?: string;
}

export async function saveTherapySessionNote(
  structuredContent: string,
  sessionDate: Date, // Expecting a JavaScript Date object from the caller
  optionalSessionIdForLog?: string
): Promise<string> {
  // IMPORTANT: This assumes Firebase app has been initialized elsewhere,
  // typically in a central 'src/lib/firebaseConfig.ts' using:
  // if (!firebase.apps.length) {
  //   firebase.initializeApp(firebaseConfigValues);
  // }
  // If not, you would need to initialize it here or import the initialized app.

  const auth = firebase.auth(); // Get the compat auth instance
  const firestore = firebase.firestore(); // Get the compat firestore instance
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated. Cannot save note.");
    throw new Error("User not authenticated. Please log in again.");
  }

  const noteData: TherapySessionNoteData = {
    therapistId: user.uid,
    createdAt: serverTimestamp(), // Use the correctly accessed serverTimestamp
    sessionDate: Timestamp.fromDate(sessionDate), // Convert JS Date to Firestore Timestamp
    structuredContent,
  };

  if (optionalSessionIdForLog) {
    noteData.sessionIdForLog = optionalSessionIdForLog;
  }

  try {
    // Use compat syntax for adding a document
    const docRef = await firestore.collection("therapySessionNotes").add(noteData);
    console.log("Therapy session note saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving therapy session note to Firestore:", error);
    throw new Error("Failed to save therapy note. Please try again.");
  }
}