const API_BASE = process.env.NEXT_PUBLIC_TRANSCRIBE_URL || "http://localhost:8000";

export async function transcribeAudio(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Transcription failed");
  }

  const data = await response.json();
  return data.text;
}
