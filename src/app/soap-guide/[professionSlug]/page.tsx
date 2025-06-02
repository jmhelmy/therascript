// src/app/soap-guide/[professionSlug]/page.tsx
'use client';

import React, { useState, useEffect, Suspense, lazy, ComponentType } from 'react';
import Link from 'next/link';
import { usePathname, notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../SoapPage.module.css'; // Adjust path if needed
import { guideCategories, GuideCategory } from '../data';

// Interface for route params
interface ResolvedProfessionParams {
  professionSlug: string;
}

interface ProfessionPageProps {
  params: ResolvedProfessionParams;
}

// Helper to lazy-load a profession overview component by name
const loadProfessionComponent = (componentName?: string): ComponentType<any> | null => {
  if (!componentName) return null;
  try {
    return lazy(() => import(`../_profession-content/${componentName}`));
  } catch (error) {
    console.error(`Failed to load component ${componentName}:`, error);
    return null;
  }
};

export default function ProfessionGuidePage({ params }: ProfessionPageProps) {
  // Destructure params directly (no more 'use()' call)
  const { professionSlug } = params;

  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Find the matching category object from your data
  const currentProfession = guideCategories.find(
    (cat) => cat.slug === professionSlug && cat.isGroup
  ) as GuideCategory | undefined;

  // If not found, render Next.js 404
  if (!currentProfession) {
    notFound();
    return null;
  }

  // Lazy-load the overview component, if one was specified
  const ContentComponent = loadProfessionComponent(currentProfession.overviewComponent);

  // Automatically expand this profession group in the sidebar
  useEffect(() => {
    setExpandedGroups((prev) => ({ ...prev, [professionSlug]: true }));
  }, [professionSlug]);

  const toggleGroup = (slug: string) => {
    setExpandedGroups((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  // For sidebar link highlighting
  const currentActiveGroupSlug = professionSlug;

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>SOAP Note Guides</h2>
          <nav>
            <ul className={styles.navList}>
              {guideCategories.map((category) => (
                <li key={category.slug} className={styles.navItem}>
                  <Link
                    href={category.path}
                    className={`${styles.navLink} ${
                      currentActiveGroupSlug === category.slug ? styles.navLinkActive : ''
                    }`}
                    onClick={(e) => {
                      if (category.isGroup && category.subtopics && category.subtopics.length > 0) {
                        // Prevent navigation so we can just toggle the group
                        e.preventDefault();
                        toggleGroup(category.slug);
                      }
                    }}
                  >
                    {category.name}
                    {category.isGroup && category.subtopics && category.subtopics.length > 0 && (
                      <span
                        className={`${styles.arrow} ${
                          expandedGroups[category.slug] ? styles.arrowUp : ''
                        }`}
                      >
                        &#9662;
                      </span>
                    )}
                  </Link>
                  {category.isGroup && category.subtopics && (
                    <ul
                      className={`${styles.subNavList} ${
                        expandedGroups[category.slug]
                          ? styles.subNavListExpanded
                          : styles.subNavListCollapsed
                      }`}
                    >
                      {category.subtopics.map((subtopic) => (
                        <li key={subtopic.slug} className={styles.subNavItem}>
                          <Link
                            href={`${category.path}/${subtopic.slug}`}
                            className={styles.subNavLink}
                          >
                            {subtopic.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className={styles.contentArea}>
          <h1 className={styles.title}>SOAP Notes for {currentProfession.name}</h1>

          <Suspense fallback={<div className={styles.paragraph}>Loading content…</div>}>
            {ContentComponent ? (
              <ContentComponent />
            ) : (
              <p className={styles.paragraph}>
                Detailed content for {currentProfession.name} is coming soon or could not be loaded.
              </p>
            )}
          </Suspense>

          {currentProfession.subtopics && currentProfession.subtopics.length > 0 && (
            <section style={{ marginTop: '2rem' }}>
              <h2 className={styles.subheading}>
                Specific Examples & Conditions for {currentProfession.name}
              </h2>
              <p className={styles.paragraph}>
                Explore detailed SOAP note examples for common scenarios in {currentProfession.name}:
              </p>
              <ul className={styles.list}>
                {currentProfession.subtopics.map((subtopic) => (
                  <li key={subtopic.slug} className={styles.listItem}>
                    <Link
                      href={`${currentProfession.path}/${subtopic.slug}`}
                      className={styles.internalContentLink}
                    >
                      {subtopic.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
