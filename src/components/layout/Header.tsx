
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

// Helper component for individual navigation links for cleaner code
const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} className={styles.navLink} onClick={onClick}>
    {children}
  </Link>
);

// Helper component for dropdown links
const DropdownLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} className={styles.dropdownLink} onClick={onClick}>
    {children}
  </Link>
);

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCompanyDropdown = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsCompanyDropdownOpen(false);
  };

  // Close company dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);


  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/soap-guide", label: "SOAP Guide" },
    { href: "/blog", label: "Blog" },
  ];

  const companyDropdownItems = [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/about/security", label: "Security" },
    { href: "/legal/privacy", label: "Privacy Policy" },
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

      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} onClick={closeAllMenus}>
            {item.label}
          </NavLink>
        ))}
        <div className={styles.companyDropdownContainer} ref={companyDropdownRef}>
          <button
            type="button"
            className={styles.navLink} // Or a new specific class for dropdown trigger
            onClick={toggleCompanyDropdown}
            aria-expanded={isCompanyDropdownOpen}
            aria-controls="company-dropdown"
          >
            Company <span className={`${styles.arrow} ${isCompanyDropdownOpen ? styles.arrowUp : ''}`}>&#9662;</span>
          </button>
          {isCompanyDropdownOpen && (
            <div className={styles.companyDropdown} id="company-dropdown">
              {companyDropdownItems.map((item) => (
                <DropdownLink key={item.href} href={item.href} onClick={closeAllMenus}>
                  {item.label}
                </DropdownLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className={styles.desktopAuthButtons}>
        <Link href="/login" className={styles.navButtonSecondary} onClick={closeAllMenus}>
          Log In
        </Link>
        <Link href="/register" className={styles.navButton} onClick={closeAllMenus}>
          Sign Up Free
        </Link>
      </div>

      {/* Hamburger Button - only for mobile */}
      <button
        type="button"
        className={styles.hamburgerButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.line1Open : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.line2Open : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.line3Open : ''}`}></span>
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
         <div
          className={`${styles.mobileNavOverlay} ${isMobileMenuOpen ? styles.mobileNavOverlayActive : ''}`}
          onClick={toggleMobileMenu} // Close on overlay click
        >
          <nav
            id="mobile-menu"
            className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
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
                    &times; {/* A simple 'X' icon */}
                </button>
            </div>
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} onClick={closeAllMenus}>
                {item.label}
              </NavLink>
            ))}
            <div className={styles.mobileDropdownTrigger}>Company</div>
            {companyDropdownItems.map((item) => (
               // Using NavLink styles for mobile dropdown items for consistency
              <NavLink key={item.href} href={item.href} onClick={closeAllMenus} >
                <span className={styles.mobileDropdownItemPrefix}>&↳</span> {item.label}
              </NavLink>
            ))}
            <div className={styles.mobileAuthButtons}>
              <Link href="/login" className={styles.navButtonSecondary} onClick={closeAllMenus}>
                Log In
              </Link>
              <Link href="/register" className={styles.navButton} onClick={closeAllMenus}>
                Sign Up Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}