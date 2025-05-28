import Image from "next/image";
import Link from "next/link";
import styles from "./HomePage.module.css";

// --- NEW & REFINED ICONS ---

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
    <path fillRule="evenodd" d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM8.855 4.03a.75.75 0 0 0-1.06 1.06l.955.955a.75.75 0 0 0 1.06-1.06l-.955-.955ZM12.215 5.09a.75.75 0 0 0-1.06-1.06l-.955.955a.75.75 0 1 0 1.06 1.06l.955-.955ZM10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM13.5 10a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
    <path d="M10.001 3.5c.343 0 .683.023 1.018.068a.75.75 0 0 1 .613.843l-1.34 6.7a.75.75 0 0 1-1.46-.292l1.34-6.7a.75.75 0 0 1 .829-.619Zm-2.29 2.132a.75.75 0 0 1 .649-.191l6.192 2.477a.75.75 0 0 1 .39 1.03l-3.32 6.64a.75.75 0 0 1-1.28-.64l3.32-6.64a.75.75 0 0 1-.39-1.03l-6.192-2.477a.75.75 0 0 1-.192-.649Zm-3.837 3.232a.75.75 0 0 1 .843.613l-1.34 6.7a.75.75 0 0 1-1.46-.292l1.34-6.7a.75.75 0 0 1 .617-.843Zm11.162 2.336a.75.75 0 0 1 .39 1.03l-3.32 6.64a.75.75 0 0 1-1.28-.64l3.32-6.64a.75.75 0 0 1 .89-.39Z" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" clipRule="evenodd" />
    <path d="M3 2.5a2.5 2.5 0 0 1 2.5-2.5h5.879a2.5 2.5 0 0 1 1.767.732l2.622 2.622a2.5 2.5 0 0 1 .732 1.767V15A2.5 2.5 0 0 1 14 17.5h-3.5a.75.75 0 0 1 0-1.5H14a1 1 0 0 0 1-1V7.621a1 1 0 0 0-.293-.707l-2.621-2.622A1 1 0 0 0 11.379 4H5.5a1 1 0 0 0-1 1v9.5a.75.75 0 0 1-1.5 0V5.5A2.5 2.5 0 0 1 3 2.5Z" />
  </svg>
);

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <header className={styles.header}>
  <Link href="/" className={styles.logo}>
    <Image
      src="/couchicon2.png"
      alt="TheraScript Logo"
      width={36}  // A slightly larger size for the homepage logo
      height={36}
    />
    <span>TheraScript</span>
  </Link>
  <nav className={styles.navLinks}>
          <Link href="/login" className={styles.navButtonSecondary}>
            Log In
          </Link>
          <Link href="/register" className={styles.navButton}>
            Sign Up Free
          </Link>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
        Clinical Notes & Clinical Feedback using HIPAA Compliant AI
          </h1>
          <p className={styles.heroSubtitle}>
            TheraScript goes beyond automated notes. We provide secure, AI-powered tools to streamline your documentation and offer clinical insights, giving you more time and confidence to focus on what matters most—your clients.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.ctaButtonPrimary}>
              Start Your Free Trial
            </Link>
            <Link href="#features" className={styles.ctaButtonSecondary}>
              Explore Features
            </Link>
          </div>
          <p className={styles.hipaaText}><ShieldCheckIcon /> End-to-End HIPAA-Compliant</p>
        </div>
        <div className={styles.heroImageContainer}>
          <Image 
            src="https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="A calm and professional therapy office environment"
            width={600}
            height={750}
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.pill}>Core Features</span>
          <h2>A Smarter, More Supportive Practice</h2>
          <p>TheraScript is built on two pillars: unparalleled efficiency and dedicated clinical support.</p>
        </div>
        <div className={styles.featuresGrid}>
          {/* Feature 1: Notes */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}><DocumentTextIcon /></div>
            <h3>Effortless Documentation</h3>
            <p>Transform your sessions into perfectly structured SOAP notes in minutes. Our AI accurately captures subjective and objective details, letting you reclaim hours of administrative time each week.</p>
          </div>
          {/* Feature 2: Advisor */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}><SparklesIcon /></div>
            <h3>Your AI Clinical Advisor</h3>
            <p>Gain a confidential second opinion. Our AI analyzes session context to suggest evidence-based interventions, identify potential patterns, and provide encouragement to enhance your clinical judgment.</p>
          </div>
        </div>
      </section>
      
      {/* --- HOW IT WORKS SECTION --- */}
      <section className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.pill}>How It Works</span>
          <h2>Get Started in 3 Simple Steps</h2>
        </div>
        <div className={styles.howItWorksGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h4>Record Securely</h4>
            <p>Conduct your session while our end-to-end encrypted tool captures the conversation.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h4>Generate & Review</h4>
            <p>With one click, receive a draft SOAP note and a summary of clinical insights.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h4>Finalize & File</h4>
            <p>Make any edits, approve the final note, and seamlessly integrate it into your records.</p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL / SOCIAL PROOF SECTION --- */}
      <section className={styles.testimonialSection}>
        <div className={styles.testimonialContent}>
          <Image 
            src="https://images.pexels.com/photos/3760855/pexels-photo-3760855.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Headshot of a smiling therapist"
            width={80}
            height={80}
            className={styles.testimonialAvatar}
          />
          <blockquote>
            “TheraScript has been a game-changer. The AI advisor feels like having a seasoned supervisor on call, and the time I've saved on notes is just incredible. I feel more present with my clients and more confident in my practice.”
          </blockquote>
          <cite>Dr. Alisha Chen, PhD, LMFT</cite>
        </div>
      </section>
      
      {/* --- FINAL CTA SECTION --- */}
      <section className={styles.finalCtaSection}>
        <h2>Ready to Transform Your Practice?</h2>
        <p>Join hundreds of therapists who are saving time, reducing burnout, and enhancing their clinical skills with TheraScript.</p>
        <Link href="/register" className={styles.ctaButtonPrimary}>
          Sign Up and Start Your Free Trial Today
        </Link>
      </section>

      {/* --- FOOTER --- */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.logo}>TheraScript</p>
          <div className={styles.footerLinks}>
              <Link href="/features" className={styles.footerLink}>Features</Link>
              <Link href="/pricing" className={styles.footerLink}>Pricing</Link>
              <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          </div>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} TheraScript. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}