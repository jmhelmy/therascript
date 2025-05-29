// src/app/soap-guide/[professionSlug]/page.tsx
"use client";

import React, { useState, useEffect, Suspense, lazy } from 'react'; // Added Suspense, lazy
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../SoapPage.module.css';
import { guideCategories, GuideCategory } from '../data';

// Dynamically import profession-specific content components
const ProfessionContentComponents: Record<string, React.ComponentType<any>> = {
  'physical-therapy': lazy(() => import('../_profession-content/PhysicalTherapyContent')),
  'occupational-therapy': lazy(() => import('../_profession-content/OccupationalTherapyContent')),
  // Add other professions here as you create their content files
  // 'speech-language-pathology': lazy(() => import('../_profession-content/SpeechLanguagePathologyContent')),
  // 'psychotherapy': lazy(() => import('../_profession-content/PsychotherapyContent')),
  // 'veterinary': lazy(() => import('../_profession-content/VeterinaryContent')),
  // etc.
};

interface ProfessionPageProps {
  params: {
    professionSlug: string;
  };
}

export default function ProfessionGuidePage({ params }: ProfessionPageProps) {
  const { professionSlug } = params;
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const currentProfession = guideCategories.find(cat => cat.slug === professionSlug && cat.isGroup);
  const ContentComponent = ProfessionContentComponents[professionSlug];

  useEffect(() => {
    if (currentProfession) {
      setExpandedGroups(prev => ({ ...prev, [professionSlug]: true }));
    }
  }, [professionSlug, currentProfession]);

  const toggleGroup = (slug: string) => {
    setExpandedGroups(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  let currentActiveGroupSlug = professionSlug;
  let currentActiveSubSlug = "";
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length >= 3 && pathSegments[0] === 'soap-guide' && pathSegments[1] === professionSlug) {
    currentActiveSubSlug = pathSegments.slice(1).join('/');
  }

  if (!currentProfession) {
    return (
      <>
        <Header />
        <main className={styles.pageContainer} style={{ textAlign: 'center', paddingTop: '5rem' }}>
          <h1 className={styles.title}>Profession Guide Not Found</h1>
          <p className={styles.paragraph}>The requested SOAP note guide for "{professionSlug}" could not be found or is not yet available.</p>
          <Link href="/soap-guide" className={styles.internalContentLink}>Return to SOAP Guides</Link>
        </main>
        <Footer />
      </>
    );
  }

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
                    className={`${styles.navLink} ${currentActiveGroupSlug === category.slug && !currentActiveSubSlug.startsWith(category.slug + '/') ? styles.navLinkActive : ''}`}
                    onClick={(e) => {
                      if (category.isGroup && category.subtopics && category.subtopics.length > 0) {
                        toggleGroup(category.slug);
                      }
                    }}
                  >
                    {category.name}
                    {category.isGroup && category.subtopics && category.subtopics.length > 0 && (
                      <span className={`${styles.arrow} ${expandedGroups[category.slug] ? styles.arrowUp : ''}`}>
                        &#9662;
                      </span>
                    )}
                  </Link>
                  {category.isGroup && category.subtopics && (
                    <ul className={`${styles.subNavList} ${expandedGroups[category.slug] ? styles.subNavListExpanded : styles.subNavListCollapsed}`}>
                      {category.subtopics.map(subtopic => (
                        <li key={subtopic.slug} className={styles.subNavItem}>
                          <Link
                            href={`${category.path}/${subtopic.slug}`}
                            className={`${styles.subNavLink} ${currentActiveSubSlug === `${category.slug}/${subtopic.slug}` ? styles.subNavLinkActive : ''}`}
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
          
          {/* Dynamically render the specific content for the profession */}
          <Suspense fallback={<div className={styles.paragraph}>Loading content...</div>}>
            {ContentComponent ? <ContentComponent /> : <p className={styles.paragraph}>Detailed content for {currentProfession.name} is coming soon.</p>}
          </Suspense>

          {/* List of specific examples/conditions for this profession */}
          {currentProfession.subtopics && currentProfession.subtopics.length > 0 && (
            <section style={{ marginTop: '2rem' }}>
              <h2 className={styles.subheading}>Specific Examples & Conditions for {currentProfession.name}</h2>
              <ul className={styles.list}>
                {currentProfession.subtopics.map(subtopic => (
                  <li key={subtopic.slug} className={styles.listItem}>
                    <Link href={`${currentProfession.path}/${subtopic.slug}`} className={styles.internalContentLink}>
                      SOAP Note Example: {subtopic.name}
                    </Link>
                    {/* You could add a brief description from data.ts if you add it there */}
                  </li>
                ))}
              </ul>
              <p className={styles.paragraph}>
                Click on an example above to view a detailed breakdown and a full SOAP note.
              </p>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}