// Use the explicit v2 'onRequest' import for clarity and correctness
import { onRequest } from "firebase-functions/v2/https";

// The server.js from the Next.js standalone output is our handler
// The path is relative to where this file will be AFTER compilation (from lib/index.js)
const nextJsServer = require('../standalone/server');

// Define and export the 'nextServer' Cloud Function using the v2 syntax
export const nextServer = onRequest(
  // 1. All options now go in a single object as the FIRST argument
  {
    region: 'us-central1', // Your desired region
    memory: '1GiB',         // Your desired memory setting
  },
  // 2. The handler function is the SECOND argument
  nextJsServer
);