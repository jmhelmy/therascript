// src/app/api/sessions/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/adminFirebase';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  try {
    const doc = await dbAdmin
      .collection('therapySessionNotes')
      .doc(sessionId)
      .get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const data = doc.data();
    return NextResponse.json({
      id: doc.id,
      clientInitials: data?.clientInitials ?? '—',
      sessionDate: data?.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
      transcript: data?.transcript ?? '',
      soapNote: {
        subjective: data?.soapNote?.subjective ?? '',
        objective: data?.soapNote?.objective ?? '',
        assessment: data?.soapNote?.assessment ?? '',
        plan: data?.soapNote?.plan ?? '',
      },
    });
  } catch (err: any) {
    console.error(`GET /api/sessions/${sessionId} error:`, err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  try {
    const updates = await req.json();
    
    const allowed: any = {};

    // Only update if fields exist in the body
    if (updates.soapNote && typeof updates.soapNote === 'object') {
      allowed.soapNote = updates.soapNote;
    }

    if (updates.transcript !== undefined) {
      allowed.transcript = updates.transcript;
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Perform update in Firestore
    await dbAdmin
      .collection('therapySessionNotes')
      .doc(sessionId)
      .update(allowed);

    console.log(`Session updated: ${sessionId}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`PUT /api/sessions/${sessionId} error:`, err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
