// src/app/account/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import styles from './AccountPage.module.css';

type SimpleUser = {
  email: string | null;
};

export default function AccountPage() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TEMP: Fake auth to test if Firebase is the issue
    setTimeout(() => {
      setUser({ email: 'debug@example.com' }); // fake user
      setLoading(false);
    }, 1000);
  }, [router]);

  const handleLogout = useCallback(() => {
    alert("Logged out (debug)");
  }, []);

  const handlePlaceholder = (what: string) => {
    alert(`${what} feature not implemented yet.`);
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <TopNav />
        <main className={styles.mainContent}>
          <p className={styles.loading}>Loading account…</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <TopNav />
        <main className={styles.mainContent}>
          <p>Verifying session or redirecting...</p>
        </main>
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
        <p className={styles.email}>{user.email}</p>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => handlePlaceholder('Change Email')}
            aria-label="Change email address"
          >
            Change Email
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handlePlaceholder('Change Password')}
            aria-label="Change password"
          >
            Change Password
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handlePlaceholder('Manage Subscription')}
            aria-label="Manage subscription"
          >
            Manage Subscription
          </button>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.buttonPrimary}
            onClick={() => handlePlaceholder('Get Help')}
            aria-label="Get help"
          >
            Get Help
          </button>
          <button
            className={styles.buttonLogout}
            onClick={handleLogout}
            aria-label="Log out of account"
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
            aria-label="Delete account"
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}
