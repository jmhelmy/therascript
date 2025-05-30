// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';

// NavLink: Updated to remove legacyBehavior and accept an optional custom className
const NavLink = ({
  href,
  children,
  onClick,
  className, // Optional custom className prop
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string; // Prop type for custom className
}) => (
  <Link
    href={href}
    // Combine the default navLink style with any custom className passed
    className={`${styles.navLink} ${className || ''}`.trim()}
    onClick={onClick}
  >
    {children}
  </Link>
);

// DropdownLink: Updated to remove legacyBehavior
const DropdownLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link href={href} className={styles.dropdownLink} onClick={onClick}>
    {children}
  </Link>
);

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);

  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const solutionsDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const toggleCompanyDropdown = () => setIsCompanyDropdownOpen((open) => !open);
  const toggleSolutionsDropdown = () => setIsSolutionsDropdownOpen((open) => !open);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsCompanyDropdownOpen(false);
    setIsSolutionsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
      if (
        solutionsDropdownRef.current &&
        !solutionsDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSolutionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const solutionsDropdownItems = [
    { href: '/solutions/ai-notes', label: 'AI-Assisted Notes' },
    { href: '/solutions/session-insights', label: 'Session Insights' },
    { href: '/solutions/emr-integration', label: 'EMR Integration', comingSoon: true },
  ];

  // "Features" item removed from navItems
  const navItems = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/soap-guide', label: 'SOAP Guide' },
    { href: '/blog', label: 'Blog' },
  ];

  const companyDropdownItems = [
    { href: '/about', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about/security', label: 'Security' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} onClick={closeAllMenus}>
        <Image
          src="/couchicon2.png"
          alt="Terapai Logo"
          width={36}
          height={36}
        />
        <span>Terapai</span>
      </Link>

      <nav className={styles.desktopNav}>
        {/* Solutions Dropdown - Using same styling classes as Company for consistency */}
        <div
          className={styles.companyDropdownContainer} // Changed to use existing class for styling consistency
          ref={solutionsDropdownRef}
        >
          <button
            type="button"
            className={styles.navLink}
            onClick={toggleSolutionsDropdown}
            aria-expanded={isSolutionsDropdownOpen}
            aria-controls="solutions-dropdown"
          >
            Solutions{' '}
            <span
              className={`${styles.arrow} ${
                isSolutionsDropdownOpen ? styles.arrowUp : ''
              }`}
            >
              &#9662;
            </span>
          </button>
          {isSolutionsDropdownOpen && (
            <div
              className={styles.companyDropdown} // Changed to use existing class for styling consistency
              id="solutions-dropdown"
            >
              {solutionsDropdownItems.map((item) => (
                <DropdownLink
                  key={item.href}
                  href={item.href}
                  onClick={closeAllMenus}
                >
                  {item.label}
                  {item.comingSoon && <span className={styles.comingSoonTag}> (coming soon)</span>}
                </DropdownLink>
              ))}
            </div>
          )}
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            onClick={closeAllMenus}
          >
            {item.label}
          </NavLink>
        ))}

        <div
          className={styles.companyDropdownContainer}
          ref={companyDropdownRef}
        >
          <button
            type="button"
            className={styles.navLink}
            onClick={toggleCompanyDropdown}
            aria-expanded={isCompanyDropdownOpen}
            aria-controls="company-dropdown"
          >
            Company{' '}
            <span
              className={`${styles.arrow} ${
                isCompanyDropdownOpen ? styles.arrowUp : ''
              }`}
            >
              &#9662;
            </span>
          </button>
          {isCompanyDropdownOpen && (
            <div
              className={styles.companyDropdown}
              id="company-dropdown"
            >
              {companyDropdownItems.map((item) => (
                <DropdownLink
                  key={item.href}
                  href={item.href}
                  onClick={closeAllMenus}
                >
                  {item.label}
                </DropdownLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className={styles.desktopAuthButtons}>
        <NavLink href="/login" onClick={closeAllMenus}>
          Log In
        </NavLink>
        {/* Apply a specific class for the Sign Up button */}
        <NavLink
          href="/register"
          onClick={closeAllMenus}
          className={styles.signUpButton} // Added custom class
        >
          Sign Up Free
        </NavLink>
      </div>

      <button
        type="button"
        className={styles.hamburgerButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <span
          className={`${styles.hamburgerLine} ${
            isMobileMenuOpen ? styles.line1Open : ''
          }`}
        />
        <span
          className={`${styles.hamburgerLine} ${
            isMobileMenuOpen ? styles.line2Open : ''
          }`}
        />
        <span
          className={`${styles.hamburgerLine} ${
            isMobileMenuOpen ? styles.line3Open : ''
          }`}
        />
      </button>

      {isMobileMenuOpen && (
        <div
          className={`${styles.mobileNavOverlay} ${
            styles.mobileNavOverlayActive
          }`}
          onClick={toggleMobileMenu}
        >
          <nav
            id="mobile-menu"
            className={`${styles.mobileNav} ${
              isMobileMenuOpen ? styles.mobileNavOpen : ''
            }`}
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()}
            aria-hidden={!isMobileMenuOpen}
          >
            <div className={styles.mobileNavHeader}>
              <Link href="/" className={styles.logo} onClick={closeAllMenus}>
                <Image
                  src="/couchicon2.png"
                  alt="Terapai Logo"
                  width={36}
                  height={36}
                />
                <span>Terapai</span>
              </Link>
              <button
                type="button"
                className={styles.mobileCloseButton}
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>

            <div className={styles.mobileDropdownTrigger}>Solutions</div>
            {solutionsDropdownItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={closeAllMenus}
              >
                {item.label}
                {item.comingSoon && <span className={styles.comingSoonTag}> (coming soon)</span>}
              </NavLink>
            ))}
            
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={closeAllMenus}
              >
                {item.label}
              </NavLink>
            ))}

            <div className={styles.mobileDropdownTrigger}>Company</div>
            {companyDropdownItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={closeAllMenus}
              >
                {item.label}
              </NavLink>
            ))}

            <div className={styles.mobileAuthButtons}>
              <NavLink href="/login" onClick={closeAllMenus}>
                Log In
              </NavLink>
              {/* Apply a specific class for the Sign Up button in mobile view */}
              <NavLink
                href="/register"
                onClick={closeAllMenus}
                className={styles.signUpButton} // Added custom class
              >
                Sign Up Free
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
