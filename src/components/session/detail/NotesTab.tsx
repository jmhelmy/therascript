interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface NotesTabProps {
  notes: SOAPNote;
}

export default function NotesTab({ notes }: NotesTabProps) {
  return (
    <div>
      <h2>Notes</h2>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
    </div>
  );
} 