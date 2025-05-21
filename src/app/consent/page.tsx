"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { httpsCallable, HttpsCallable } from 'firebase/functions';
import { User as FirebaseUser } from 'firebase/auth'; // Specific Firebase User type
import { auth, functions } from '@/lib/firebaseConfig'; // Assuming this path and exports

// Define the expected data structure for the callable function
interface LogConsentData {
  // The function validates therapistId from context.auth, so we don't need to send it here
  consentVersion?: string; // Optional: version of the consent text
}

// Define the expected response structure (if any, besides success/error)
interface LogConsentResult {
  success: boolean;
  message?: string;
  logId?: string; // Assuming the function returns the log ID
}

const ConsentPage = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true); // To handle initial auth check loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Reference to the Firebase Callable Function
  const logClientConsentCallable: HttpsCallable<LogConsentData, LogConsentResult> =
    httpsCallable(functions, 'logClientConsent');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // If no user is logged in, redirect to login page
        router.push('/login');
      }
      setAuthLoading(false); // Auth check complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe(); // auth is stable, router is stable
  }, [router]); // router is stable, authInstance should also be stable

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setErrorMessage(null); // Clear any previous error message when checkbox state changes
  };

  const handleContinueClick = async () => {
    if (!user) {
      console.error("User not authenticated. This should have been caught by the redirect.");
      setErrorMessage("Authentication error. Please try logging in again.");
      return;
    }

    if (!isChecked) {
      setErrorMessage("Please confirm consent by checking the box.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Call the Firebase Function
      // The function validates therapistId from context.auth, so we don't send it in data.
      const result = await logClientConsentCallable({
         consentVersion: 'v1.0' // Specify the current consent version
      });

      if (result.data.success) {
        console.log("Consent logged successfully. Log ID:", result.data.logId);
        router.push('/session/record'); // Or whatever your recording page route is
      } else {
        throw new Error(result.data.message || "Failed to log consent.");
      }
    } catch (error: any) {
      console.error("Error logging client consent:", error);
      // Display a user-friendly error message
      // Firebase Callable Function errors have specific formats
      if (error.code && error.message) {
         setErrorMessage(`Error: ${error.message} (Code: ${error.code})`);
      } else {
         setErrorMessage(error.message || "An unexpected error occurred while logging consent.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div>Loading user information...</div>
      </div>
    );
  }

  // If user is null after auth check (should be caught by redirect, but as a fallback)
  if (!user) {
    // This state should ideally not be reached if redirection works reliably
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  // Placeholder Consent Text
  return ( // <<< THIS IS THE CORRECTED LINE (was line 111 in your error)
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
          Client Consent Confirmation
        </h1>

         {/* Placeholder Consent Text Area */}
        <div className="border border-gray-300 p-4 rounded-md mb-6 max-h-60 overflow-y-auto text-sm text-gray-700 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">TheraNote Client Consent Agreement (Version 1.0)</h2>
          <p>Please read this consent agreement carefully. By proceeding, you confirm that you have discussed the use of TheraNote's recording and note generation features with your client and have obtained their explicit consent.</p>
          <p className="font-semibold text-red-600">[Insert full, legally reviewed consent text here. This should cover data recording, transcription, summarization, storage, privacy, and HIPAA compliance details relevant to the client. **This is placeholder text - replace with actual, legally approved consent text.**]</p>
          <p>Key points generally covered:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Purpose of recording (e.g., for generating therapy notes).</li>
            <li>How recordings are processed (e.g., transcription, AI summarization).</li>
            <li>How recordings are stored (e.g., temporarily on secure cloud storage, encrypted).</li>
            <li>How therapy notes are stored (e.g., encrypted in a HIPAA-compliant database).</li>
            <li>Confidentiality and privacy measures.</li>
            <li>Client's right to withdraw consent (and procedures for doing so).</li>
            <li>Data retention policies (especially for audio recordings).</li>
          </ul>
          <p className="font-semibold">By checking the box below, you attest that you have:</p>
          <ol className="list-decimal list-inside pl-4 space-y-1">
               <li>Reviewed this consent agreement with your client.</li>
               <li>Answered all their questions to their satisfaction.</li>
               <li>Confirmed their understanding and agreement to proceed with using TheraNote for this session.</li>
           </ol>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-md mb-6 bg-gray-50">
          <input
            type="checkbox"
            id="consentCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            aria-describedby="consent-description"
          />
          <label htmlFor="consentCheckbox" id="consent-description" className="text-sm text-gray-700 select-none">
            I confirm I have obtained and documented explicit consent from my client to use TheraNote for AI-assisted note generation **for this upcoming session**, according to the terms discussed and outlined above.
          </label>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 mb-4 text-center animate-pulse">{errorMessage}</p>
        )}

        <button
          onClick={handleContinueClick}
          disabled={!isChecked || isLoading}
          className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-150 ease-in-out
            ${isChecked && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Confirm Consent & Proceed'
          )}
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Your confirmation will be logged securely.
        </p>
      </div>
    </div>
  );
};

export default ConsentPage;