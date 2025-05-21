// src/firebase/saveTherapySessionNote.ts
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  Timestamp // For explicit Date to Timestamp conversion if needed
} from "firebase/firestore";
import { authInstance, dbInstance } from "@/lib/firebaseConfig"; // Adjust path if your firebaseConfig is elsewhere

// Define an interface for the note data for type safety
export interface TherapySessionNoteData {
  therapistId: string;
  createdAt: any; // Will be a serverTimestamp()
  sessionDate: Timestamp | Date; // Can be a JS Date or Firestore Timestamp
  structuredContent: string;
  // Add any other fields you might need for the note, e.g., sessionIdForLog
  sessionIdForLog?: string; 
}

export async function saveTherapySessionNote(
  structuredContent: string, 
  sessionDate: Date,
  optionalSessionIdForLog?: string // Optional: if you want to link it to a specific consent log session ID
): Promise<string> { // Returns the ID of the newly created document
  const user = authInstance.currentUser;

  if (!user) {
    console.error("User not authenticated. Cannot save note.");
    throw new Error("User not authenticated. Please log in again.");
  }

  const noteData: TherapySessionNoteData = {
    therapistId: user.uid,
    createdAt: serverTimestamp(), // Firestore will set this to the server's timestamp
    sessionDate: Timestamp.fromDate(sessionDate), // Convert JS Date to Firestore Timestamp
    structuredContent: structuredContent,
  };

  if (optionalSessionIdForLog) {
    noteData.sessionIdForLog = optionalSessionIdForLog;
  }

  try {
    const docRef = await addDoc(collection(dbInstance, "therapySessionNotes"), noteData);
    console.log("Therapy session note saved with ID: ", docRef.id);
    return docRef.id; // Return the new note's ID
  } catch (error) {
    console.error("Error saving therapy session note to Firestore:", error);
    // You might want to throw a more specific error or handle it differently
    throw new Error("Failed to save therapy note. Please try again.");
  }
}