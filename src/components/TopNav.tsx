import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Import to detect the active page
import styles from './TopNav.module.css';
import CaduceusIcon from './CaduceusIcon';

export function TopNav() {
  const pathname = usePathname(); // Get the current URL path

  return (
    <nav className={styles.nav}>
      {/* Left: Site Brand and Logo */}
      <div className={styles.brandContainer}>
        <Link href="/dashboard" className={styles.brand}>
          <Image
            src="/couchicon2.png" // IMPORTANT: Replace with your actual logo path
            alt="TheraScript Logo"
            width={32}
            height={32}
          />
          TheraScript
        </Link>
      </div>

      {/* Center: Main Navigation Links */}
      <div className={styles.menu}>
        <Link 
          href="/dashboard" 
          className={styles.link}
          // Add this attribute to style the active link
          aria-current={pathname === '/dashboard' ? 'page' : undefined}
        >
          Dashboard
        </Link>
        <Link 
          href="/account" 
          className={styles.link}
          aria-current={pathname === '/account' ? 'page' : undefined}
        >
          My Account
        </Link>
      </div>

      {/* Right: Compliance Icon */}
      <div className={styles.complianceContainer}>
        <CaduceusIcon className={styles.hipaaIcon} />
      </div>
    </nav>
  );
}