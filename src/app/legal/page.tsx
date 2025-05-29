'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './LegalAgreementPage.module.css';

// Import your reusable Header and Footer components
import { Header } from '@/components/layout/Header'; // Adjust path if necessary
import { Footer } from '@/components/layout/Footer'; // Adjust path if necessary


export default function LegalAgreementPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    // save the flag however you like
    localStorage.setItem('agreedToTerms', 'true');
    router.push('/dashboard');
  };

  <Header />
  return (
    <div className={styles.legalContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Legal Agreements</h1>
        <p className={styles.description}>
          By continuing, you agree to the following:
        </p>

        <ul className={styles.list}>
          <li>I consent to the terms of service and privacy policy.</li>
          <li>I understand and accept HIPAA compliance responsibilities.</li>
          <li>
            I acknowledge that my data will be handled in accordance with
            security best practices.
          </li>
        </ul>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <span>I have read and agree to the terms above.</span>
        </label>

        <button
          disabled={!agreed}
          onClick={handleAgree}
          className={styles.button}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
