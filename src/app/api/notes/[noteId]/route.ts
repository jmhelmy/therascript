// src/app/api/notes/[noteId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/adminFirebase';

export async function GET(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  const { noteId } = params;
  try {
    const snap = await dbAdmin
      .collection('therapySessionNotes')
      .doc(noteId)
      .get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data = snap.data();
    return NextResponse.json({ id: noteId, ...data });
  } catch (err: any) {
    console.error('GET /api/notes/[noteId] error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
