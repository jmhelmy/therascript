// 1. For local emulator use (set before firebase-admin imports)
if (process.env.NODE_ENV !== 'production') {
    process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= "127.0.0.1:9199";
    // add other emulator hosts if needed
  }
  
  // 2. SSR handler for Next.js
  import * as functions from "firebase-functions/v1"; // ✅ FIX: explicitly use v1
  import { Request, Response } from "express";         // ✅ ADD: types for req & res
  import next from "next";
  import path from "path";
  
  const dev = process.env.NODE_ENV !== "production";
  const nextJsDistDir = path.join(__dirname, "../.next");
  const app = next({ dev, conf: { distDir: nextJsDistDir } });
  const handle = app.getRequestHandler();
  
  export const nextServer = functions
    .region('us-central1') // ✅ This now works because we're using v1
    .https.onRequest((req: Request, res: Response) => app.prepare().then(() => handle(req, res)));
  
  // 3. Initialize Admin SDK & custom functions
  import "./common/adminSdk";
  import { generateNoteHttpFunction } from "./generateNote";
  export const generateNote = generateNoteHttpFunction;
  