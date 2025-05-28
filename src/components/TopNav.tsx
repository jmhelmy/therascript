import Link from 'next/link';
import styles from './TopNav.module.css';

export function TopNav() {
  return (
    <nav className={styles.nav}>
      {/* Site logo / name */}
      <Link href="/dashboard" className={styles.brand}>
        TheraScript
      </Link>

      {/* Right-hand menu links */}
      <div className={styles.menu}>
        <Link href="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link href="/account" className={styles.link}>
          My Account
        </Link>
      </div>
    </nav>
  );
}
