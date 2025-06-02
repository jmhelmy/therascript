// src/app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT ASSUMPTIONS FOR THIS FILE TO WORK:
// 1. You have run `npm install firebase-admin` in your project's root directory.
// 2. The file '@/lib/adminFirebase.ts' (e.g., src/lib/adminFirebase.ts) correctly:
//    a. Imports 'firebase-admin'.
//    b. Initializes the Firebase Admin SDK (e.g., admin.initializeApp(...)).
//    c. Exports 'dbAdmin', which should be the Firestore admin instance (e.g., admin.firestore()).

import { dbAdmin } from '@/lib/adminFirebase';

export async function GET(request: NextRequest) { // Changed _ to request for clarity, even if not directly used for GET params here
  try {
    // 😎 grab every note doc
    const snapshot = await dbAdmin
      .collection('therapySessionNotes')
      .orderBy('createdAt', 'desc')
      .get();

    // map to plain JSON
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // If createdAt is a Firestore Timestamp, you might want to convert it:
      // createdAt: doc.data().createdAt.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt,
    }));

    return NextResponse.json(notes);
  } catch (err: unknown) { // Using unknown for better type safety
    console.error('GET /api/notes error:', err); // Added colon for log clarity

    let errorMessage = 'An unknown error occurred while fetching notes.';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    // No need to check for string, as err.message would cover most cases.
    // If you expect other error shapes, you can add more checks here.

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}