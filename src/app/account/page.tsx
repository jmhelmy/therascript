'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { TopNav } from '@/components/TopNav';
import styles from './AccountPage.module.css';

export default function AccountPage() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect to /login if not signed in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return unsub;
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handlePlaceholder = (what: string) => {
    alert(`${what} feature not implemented yet.`);
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <p className={styles.loading}>Loading account…</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <TopNav />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>My account</h1>
        </div>

        <p className={styles.email}>{user?.email}</p>

        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => handlePlaceholder('Change Email')}
          >
            Change Email
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handlePlaceholder('Change Password')}
          >
            Change Password
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handlePlaceholder('Manage Subscription')}
          >
            Manage Subscription
          </button>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.buttonPrimary}
            onClick={() => handlePlaceholder('Get Help')}
          >
            Get Help
          </button>
          <button
            className={styles.buttonLogout}
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className={styles.buttonDanger}
            onClick={() => {
              if (confirm('Delete account permanently?')) {
                handlePlaceholder('Delete Account');
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}
