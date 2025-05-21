// src/app/account/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link'; // Not strictly needed if TopNav handles all navigation
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { TopNav } from '@/components/TopNav'; // Import TopNav

// Define your primary color
const PRIMARY_COLOR_HEX = '#009DA3';

const AccountPage = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Failed to sign out. Please try again."); // Simple alert for now
    }
  };

  const handlePlaceholderAction = (action: string) => {
    alert(`${action} feature is not yet implemented.`);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
        <p className="text-lg text-gray-600">Loading account details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
        <p className="text-lg text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 font-sans">
      <TopNav /> {/* Include TopNav here */}
      <div className="p-4 md:p-6">
        {/* Header removed as TopNav implies main navigation, page specific title below */}
        <main className="max-w-md p-6 mx-auto mt-0 bg-white rounded-xl shadow-lg md:p-8">
          <div className="flex items-center mb-6 border-b pb-4">
             {/* Optional: Back button if TopNav doesn't feel sufficient for page context */}
            {/* <button onClick={() => router.back()} className={`p-2 mr-4 text-[${PRIMARY_COLOR_HEX}] hover:text-opacity-75`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button> */}
            <h1 className="text-2xl font-bold text-center text-slate-800 flex-grow">Account Settings</h1>
          </div>
          
          <div className="mb-8 text-center">
            <p className="text-lg text-slate-700 break-all">{user.email}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handlePlaceholderAction('Change Email')}
              className="w-full px-4 py-3 text-left text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-150"
            >
              Change Email
            </button>
            <button
              onClick={() => handlePlaceholderAction('Change Password')}
              className="w-full px-4 py-3 text-left text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-150"
            >
              Change Password
            </button>
            <button
              onClick={() => handlePlaceholderAction('Manage Subscription / Payment')}
              className="w-full px-4 py-3 text-left text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-150"
            >
              Manage Subscription / Payment
            </button>
          </div>

          <div className="pt-6 mt-6 space-y-3 border-t">
            <button
              onClick={() => handlePlaceholderAction('Get Help / Support')}
              className={`w-full px-6 py-3 font-semibold text-white transition-colors duration-150 ease-in-out rounded-lg bg-[${PRIMARY_COLOR_HEX}] hover:bg-opacity-80 focus:ring-4 focus:ring-opacity-50 focus:ring-[${PRIMARY_COLOR_HEX}]`}
            >
              Get Help
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors duration-150 focus:ring-4 focus:ring-slate-300"
            >
              Logout
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
                  handlePlaceholderAction('Delete Account');
                }
              }}
              className="w-full px-6 py-3 font-semibold text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150 focus:ring-4 focus:ring-red-200"
            >
              Delete Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;