// components/layout/Header.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/couchicon2.png" // Make sure this path is correct relative to your public folder
          alt="Terapai Logo"
          width={36}
          height={36}
        />
        <span>Terapai</span>
      </Link>
      <nav className={styles.navLinks}>
        {/* You might want to add other links like Features, Pricing here if not already */}
        <Link href="/about/security" className={styles.navLink}> {/* Added new class, see notes below */}
          Security
        </Link>
        <Link href="/login" className={styles.navButtonSecondary}>
          Log In
        </Link>
        <Link href="/register" className={styles.navButton}>
          Sign Up Free
        </Link>
      </nav>
    </header>
  );
}