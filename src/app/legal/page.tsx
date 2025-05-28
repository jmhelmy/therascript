'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LegalAgreementPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    // Here you’d typically save this to Firestore or Firebase custom claims
    localStorage.setItem('agreedToTerms', 'true'); // Temporary placeholder
    router.push('/dashboard'); // Proceed to main app
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-slate-50">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Legal Agreements</h1>
        <p className="mb-4 text-slate-700">
          By continuing, you agree to the following:
        </p>

        <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
          <li>I consent to the terms of service and privacy policy.</li>
          <li>I understand and accept HIPAA compliance responsibilities.</li>
          <li>I acknowledge that my data will be handled in accordance with security best practices.</li>
        </ul>

        <label className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="form-checkbox h-5 w-5 text-[#009DA3]"
          />
          <span className="text-slate-700 text-sm">I have read and agree to the terms above.</span>
        </label>

        <button
          disabled={!agreed}
          onClick={handleAgree}
          className={`w-full py-3 font-semibold rounded-lg transition-colors duration-150 ${
            agreed ? 'bg-[#009DA3] text-white hover:bg-opacity-90' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
