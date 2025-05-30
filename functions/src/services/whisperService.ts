import fetch from 'node-fetch';
import * as admin from 'firebase-admin';
import FormData from 'form-data';

export async function transcribeWithWhisper(firebasePath: string): Promise<string> {
  const bucket = admin.storage().bucket();
  const file = bucket.file(firebasePath);
  const [buffer] = await file.download();

  const form = new FormData();
  form.append('file', buffer, 'audio.webm');

  const response = await fetch('http://ec2-18-219-113-46.us-east-2.compute.amazonaws.com:8000/transcribe', {
    method: 'POST',
    body: form as any, // 👈 simple and effective for Node
    headers: form.getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Whisper API failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text;
}
