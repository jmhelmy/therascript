// src/app/soap-guide/[professionSlug]/[issueSlug]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../../SoapPage.module.css'; // Go up one level for the CSS module
import { guideCategories, GuideCategory, Subtopic } from '../../data'; // Go up one level for data

interface IssuePageProps {
  params: {
    professionSlug: string;
    issueSlug: string;
  };
}

export default function IssueGuidePage({ params }: IssuePageProps) {
  const { professionSlug, issueSlug } = params;
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const currentProfession = guideCategories.find(cat => cat.slug === professionSlug && cat.isGroup);
  const currentIssue = currentProfession?.subtopics?.find(sub => sub.slug === issueSlug);

   useEffect(() => {
    // Pre-expand the current profession's subtopics
    if (currentProfession) {
      setExpandedGroups(prev => ({ ...prev, [professionSlug]: true }));
    }
  }, [professionSlug, currentProfession]);

  const toggleGroup = (slug: string) => {
    setExpandedGroups(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Active link logic
  let currentActiveGroupSlug = professionSlug;
  let currentActiveSubSlug = `<span class="math-inline">\{professionSlug\}/</span>{issueSlug}`;


  if (!currentProfession || !currentIssue) {
    return (
      <>
        <Header />
        <main className={styles.pageContainer}>
          <h1 className={styles.title}>SOAP Note Example Not Found</h1>
          <p className={styles.paragraph}>The requested SOAP note example could not be found.</p>
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
                    className={`${styles.navLink} ${currentActiveGroupSlug === category.slug ? styles.navLinkActive : ''}`}
                     onClick={(e) => {
                      if (category.isGroup && category.subtopics && category.subtopics.length > 0) {
                        // e.preventDefault();
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
                  {category.isGroup && category.subtopics && expandedGroups[category.slug] && (
                     <ul className={`${styles.subNavList} ${expandedGroups[category.slug] ? styles.subNavListExpanded : styles.subNavListCollapsed}`}>
                      {category.subtopics.map(subtopic => (
                        <li key={subtopic.slug} className={styles.subNavItem}>
                          <Link
                            href={`<span class="math-inline">\{category\.path\}/</span>{subtopic.slug}`}
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
          {/* Breadcrumbs (Optional but good for UX) */}
          <div className={styles.breadcrumbs}>
            <Link href="/soap-guide">SOAP Guides</Link> &gt; {}
            <Link href={currentProfession.path}>{currentProfession.name}</Link> &gt; {}
            <span>{currentIssue.name}</span>
          </div>

          <h1 className={styles.title}>{currentIssue.name} - SOAP Note Example</h1>
          <h2 className={styles.subheading}>Scenario for {currentProfession.name}</h2>
          <p className={styles.paragraph}>
            {/* TODO: Describe the patient scenario for this example. */}
            This section will detail a common clinical scenario encountered in {currentProfession.name} practice involving {currentIssue.name.toLowerCase().replace(' example', '')}.
          </p>

          <section>
            <h3 className={styles.sectionSubSubHeading}>Subjective (S)</h3>
            <div className={styles.soapSectionContent}>
              {/* TODO: Add Subjective content for this example */}
              <p>Patient reports...</p>
            </div>
          </section>
          <section>
            <h3 className={styles.sectionSubSubHeading}>Objective (O)</h3>
            <div className={styles.soapSectionContent}>
              {/* TODO: Add Objective content for this example */}
              <p>On examination...</p>
            </div>
          </section>
          <section>
            <h3 className={styles.sectionSubSubHeading}>Assessment (A)</h3>
            <div className={styles.soapSectionContent}>
              {/* TODO: Add Assessment content for this example */}
              <p>Diagnosis: ...</p>
            </div>
          </section>
          <section>
            <h3 className={styles.sectionSubSubHeading}>Plan (P)</h3>
            <div className={styles.soapSectionContent}>
              {/* TODO: Add Plan content for this example */}
              <p>1. Further tests... <br/>2. Treatment... <br/>3. Patient education...</p>
            </div>
          </section>

          <section>
            <h2 className={styles.subheading}>Key Considerations for {currentIssue.name} Notes</h2>
            <p className={styles.paragraph}>
              {/* TODO: Add specific tips or considerations when writing SOAP notes for this issue/profession. */}
            </p>
          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
}