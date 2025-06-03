// src/lib/firebaseClient.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Hardcoded config for testing
const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",  // Replace with your actual API key
  authDomain: "therascript-45b62.firebaseapp.com",
  projectId: "therascript-45b62",
  storageBucket: "therascript-45b62.appspot.com",
  messagingSenderId: "64757237031",  // Replace with your actual sender ID
  appId: "1:64757237031:web:c541b0cf649c0d88fb5502"  // Replace with your actual app ID
};

// Only initialize once, even if this file is imported multiple times
if (!firebase.apps.length) {
  console.log('Initializing Firebase client with config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey.substring(0, 10) + '...' // Only log part of the API key
  });
  firebase.initializeApp(firebaseConfig);

  // Connect to emulators in development
  if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
    console.log('🔧 Connecting to Firebase emulators');
    firebase.auth().useEmulator('http://127.0.0.1:9099');
    firebase.firestore().useEmulator('127.0.0.1', 8080);
  }
}

// Export auth() and firestore() for convenience
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;
