// src/app/soap-guide/[professionSlug]/[issueSlug]/page.tsx
"use client";

import React, { useState, useEffect, use, Suspense, lazy, ComponentType } from 'react'; // Added Suspense, lazy, ComponentType
import Link from 'next/link';
import { usePathname, notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../../SoapPage.module.css';
import { guideCategories, GuideCategory, Subtopic } from '../../data';

// Define the expected shape of the resolved params
interface ResolvedIssueParams {
  professionSlug: string;
  issueSlug: string;
}

interface IssuePageProps {
  params: ResolvedIssueParams;
}

// Helper function to create a map for lazy loading issue components
// This map helps React.lazy work with dynamic strings more predictably
const createIssueComponentMap = (): Record<string, Record<string, ComponentType<any>>> => {
  const components: Record<string, Record<string, ComponentType<any>>> = {};
  guideCategories.forEach(category => {
    if (category.isGroup && category.subtopics) {
      components[category.slug] = {};
      category.subtopics.forEach(subtopic => {
        // Construct the component name based on convention (e.g., LowBackPainContent)
        // This requires consistent naming of your content files.
        const capFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
        const componentNameParts = subtopic.slug.split('-').map(capFirst);
        const componentName = componentNameParts.join('') + 'Content';
        
        try {
            components[category.slug][subtopic.slug] = lazy(() =>
            import(`../../_issue-content/${category.slug}/${componentName}`)
          );
        } catch (e) {
            console.warn(`Component for ${category.slug}/${componentName} not found or failed to import.`)
            // You might want a fallback component here or handle it in rendering
        }
      });
    }
  });
  return components;
};

const IssueContentComponents = createIssueComponentMap();


export default function IssueGuidePage({ params: paramsInput }: IssuePageProps) {
  const params = use(paramsInput as Promise<ResolvedIssueParams> | ResolvedIssueParams);
  const { professionSlug, issueSlug } = params;

  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const currentProfession = guideCategories.find(cat => cat.slug === professionSlug && cat.isGroup);
  const currentIssue = currentProfession?.subtopics?.find(sub => sub.slug === issueSlug);

  // Dynamically get the Issue Content Component
  const IssueSpecificContent = IssueContentComponents[professionSlug]?.[issueSlug];

  useEffect(() => {
    if (currentProfession) {
      setExpandedGroups(prev => ({ ...prev, [professionSlug]: true }));
    }
  }, [professionSlug, currentProfession]);

  const toggleGroup = (slug: string) => {
    setExpandedGroups(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  let currentActiveGroupSlug = professionSlug;
  let currentActiveSubSlug = `${professionSlug}/${issueSlug}`;

  if (!currentProfession || !currentIssue) {
    notFound();
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          {/* ... Your full sidebar JSX ... */}
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
          <div className={styles.breadcrumbs}>
            <Link href="/soap-guide">SOAP Guides</Link> &gt; {}
            <Link href={currentProfession.path}>{currentProfession.name}</Link> &gt; {}
            <span>{currentIssue.name}</span>
          </div>

          <h1 className={styles.title}>{currentIssue.name}</h1>
          
          <Suspense fallback={<div className={styles.paragraph}>Loading example...</div>}>
            {IssueSpecificContent ? <IssueSpecificContent /> : <p className={styles.paragraph}>Detailed example content for "{currentIssue.name}" in {currentProfession.name} is coming soon or could not be loaded.</p>}
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  );
}