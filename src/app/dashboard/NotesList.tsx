'use client';

import React, { useState, useMemo } from 'react';
import styles from './NotesList.module.css';

export interface NoteItem {
  id: string;
  clientInitials: string;
  sessionDate: Date;
  transcript: string;
  structuredContent: string;
}

export type NotesListProps = {
  notes: NoteItem[];
  onUpdate: (
    id: string,
    updates: { transcript?: string; structuredContent?: string }
  ) => Promise<void> | void;
};

export default function NotesList({ notes, onUpdate }: NotesListProps) {
  const [viewMode, setViewMode] = useState<'byNote' | 'byClient'>('byNote');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<
    Record<string, { transcript: string; structuredContent: string }>
  >(
    () =>
      notes.reduce((acc, note) => {
        acc[note.id] = {
          transcript: note.transcript,
          structuredContent: note.structuredContent,
        };
        return acc;
      }, {} as Record<string, { transcript: string; structuredContent: string }>)
  );

  // Group notes by clientInitials
  const byClient = useMemo(() => {
    return notes.reduce((groups, note) => {
      (groups[note.clientInitials] ||= []).push(note);
      return groups;
    }, {} as Record<string, NoteItem[]>);
  }, [notes]);

  const handleSave = async (id: string) => {
    const { transcript, structuredContent } = drafts[id];
    await onUpdate(id, { transcript, structuredContent });
    setEditingId(null);
  };

  const renderNoteCard = (note: NoteItem) => {
    const isEditing = editingId === note.id;
    const draft = drafts[note.id];
    return (
      <div key={note.id} className={styles.noteCard}>
        <header className={styles.noteHeader}>
          <div>
            <strong>{note.clientInitials}</strong>{' '}
            <em>{note.sessionDate.toLocaleString()}</em>
          </div>
          {!isEditing ? (
            <button
              className={styles.editBtn}
              onClick={() => setEditingId(note.id)}
            >
              Edit
            </button>
          ) : (
            <button
              className={styles.saveBtn}
              onClick={() => handleSave(note.id)}
            >
              Save
            </button>
          )}
        </header>

        <section className={styles.noteSection}>
          <h4>Transcript</h4>
          {isEditing ? (
            <textarea
              className={styles.textarea}
              value={draft.transcript}
              onChange={(e) =>
                setDrafts((d) => ({
                  ...d,
                  [note.id]: { ...d[note.id], transcript: e.target.value },
                }))
              }
            />
          ) : (
            <pre className={styles.pre}>{note.transcript}</pre>
          )}
        </section>

        <section className={styles.noteSection}>
          <h4>Structured Note</h4>
          {isEditing ? (
            <textarea
              className={styles.textarea}
              value={draft.structuredContent}
              onChange={(e) =>
                setDrafts((d) => ({
                  ...d,
                  [note.id]: { ...d[note.id], structuredContent: e.target.value },
                }))
              }
            />
          ) : (
            <div className={styles.richText}>
              {note.structuredContent}
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          className={viewMode === 'byNote' ? styles.active : ''}
          onClick={() => setViewMode('byNote')}
        >
          By Note
        </button>
        <button
          className={viewMode === 'byClient' ? styles.active : ''}
          onClick={() => setViewMode('byClient')}
        >
          By Client
        </button>
      </div>

      {viewMode === 'byNote' && (
        <div className={styles.list}>
          {notes
            .slice()
            .sort((a, b) => b.sessionDate.getTime() - a.sessionDate.getTime())
            .map(renderNoteCard)}
        </div>
      )}

      {viewMode === 'byClient' && (
        <div className={styles.list}>
          {Object.entries(byClient).map(([client, notesForClient]) => (
            <div key={client} className={styles.clientGroup}>
              <h3 className={styles.clientHeader}>{client}</h3>
              {notesForClient
                .slice()
                .sort((a, b) => b.sessionDate.getTime() - a.sessionDate.getTime())
                .map(renderNoteCard)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
