// functions/src/services/auditService.ts

import * as admin from 'firebase-admin';
import { dbAdmin } from '../common/adminSdk';

export interface AuditLogEntry {
  action: string;          // e.g. "generateNote", "logConsent"
  userId: string;          // therapist UID
  targetId?: string;       // noteId, consentLogId, etc.
  timestamp: FirebaseFirestore.FieldValue;
}

/**
 * Writes an entry to the 'auditLogs' collection.
 */
export async function logAudit(
  action: string,
  userId: string,
  targetId?: string
): Promise<FirebaseFirestore.DocumentReference> {
  const entry: AuditLogEntry = {
    action,
    userId,
    targetId,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  };
  return dbAdmin.collection('auditLogs').add(entry);
}
