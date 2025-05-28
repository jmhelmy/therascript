// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "./HomePage.module.css"; // Import the CSS Module

// Example SVG Icons (replace with your actual icons or a library)
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12.001 2.25c3.865 0 7.136 2.205 8.726 5.363.24.48.317.95.329 1.378A12.75 12.75 0 0 1 12.001 21V2.25Zm0 0c-3.865 0-7.136 2.205-8.726 5.363A12.756 12.756 0 0 0 3.26 8.99c-.013-.428.088-.898.33-1.378C5.186 4.456 8.456 2.25 12.001 2.25Zm10.5 6.5H1.5a11.252 11.252 0 0 0 10.5 11.25 11.252 11.252 0 0 0 10.5-11.25Z" clipRule="evenodd" />
  </svg>
);
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    <path fillRule="evenodd" d="M11.002 2.996a.75.75 0 0 1 .746.649l1.265 6.667A.75.75 0 0 1 12.25 11h-1.5a.75.75 0 0 0-.744.53l-1.275 6.787a.75.75 0 0 1-1.416-.265l1.274-6.787A.75.75 0 0 1 10.75 11h1.5a.75.75 0 0 0 .745-.65l-1.263-6.667a.75.75 0 0 1-.73-.683Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M13.697 2.819a.75.75 0 0 1 1.02.27l6.188 8.25a.75.75 0 0 1-.51 1.161h-3.644a.75.75 0 0 0-.704.478l-2.843 5.686a.75.75 0 0 1-1.336 0l-2.843-5.686A.75.75 0 0 0 8.126 12.5H4.482a.75.75 0 0 1-.51-1.161l6.188-8.25a.75.75 0 0 1 1.02-.27ZM13.5 6.061 9.75 11h3.374a2.25 2.25 0 0 1 2.112 1.434l1.5 3 3.75-5H16.5a.75.75 0 0 0-.679.428L13.5 6.06Z" clipRule="evenodd" />
  </svg>
);
const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a.375.375 0 0 1-.375-.375V6.75A3.75 3.75 0 0 0 9 3H5.625Zm.375 13.5a.75.75 0 0 0 0 1.5h8.25a.75.75 0 0 0 0-1.5H6Zm0 3a.75.75 0 0 0 0 1.5h8.25a.75.75 0 0 0 0-1.5H6Z" />
    <path d="M12.971 1.816A5.23 5.23 0 0 1 15.75 1.5h1.875c.414 0 .75.336.75.75v4.5c0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75V2.25c0-.204.082-.394.221-.534ZM15 4.5h1.5V3H15v1.5Z" />
  </svg>
);


export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          TheraScript
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/login" className={`${styles.navButton} ${styles.navButtonSecondary}`}>
            Log In
          </Link>
          <Link href="/register" className={styles.navButton}> {/* Assuming /register is your signup page */}
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.hipaaBadge}>
            <ShieldCheckIcon />
            <span>HIPAA-Compliant AI Assistance</span>
        </div>
        <h1 className={styles.heroTitle}>
          Focus on Your Clients, Not Your Notes.
        </h1>
        <p className={styles.heroSubtitle}>
          TheraScript uses advanced AI to securely transcribe your therapy sessions 
          and generate accurate clinical notes, saving you hours each week.
        </p>
        <div className={styles.heroImage}>
          {/* You can add a relevant hero image or illustration here if you have one */}
          {/* Example: <Image src="/hero-illustration.svg" alt="AI powered therapy notes" width={500} height={300} priority /> */}
        </div>
        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.ctaButtonPrimary}>
            Get Started for Free
          </Link>
          <Link href="/#features" className={styles.ctaButtonSecondary}> {/* Link to features section below */}
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section (Example) */}
      <section id="features" className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>How TheraScript Empowers You</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><BoltIcon /></div>
            <h3 className={styles.featureTitle}>Instant Transcription</h3>
            <p className={styles.featureDescription}>
              Securely record your sessions and get accurate, timestamped transcripts in minutes.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><DocumentTextIcon /></div>
            <h3 className={styles.featureTitle}>AI-Generated SOAP Notes</h3>
            <p className={styles.featureDescription}>
              Our AI crafts detailed and compliant SOAP notes, ready for your review and approval.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><ShieldCheckIcon /></div>
            <h3 className={styles.featureTitle}>HIPAA-Compliant Security</h3>
            <p className={styles.featureDescription}>
              Built with security and privacy at its core to meet HIPAA standards for PHI.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} TheraScript. All rights reserved.</p>
        <div className={styles.footerLinks}>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}