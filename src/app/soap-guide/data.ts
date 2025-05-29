// src/app/soap-guide/data.ts
export interface Subtopic {
    name: string;
    slug: string;
  }
  
  export interface GuideCategory {
    name: string;
    slug: string;
    path: string; // Full path to the main category page
    isGroup: boolean;
    subtopics?: Subtopic[];
  }
  
  export const guideCategories: GuideCategory[] = [
    // General Guides
    { name: "Introduction to SOAP Notes", slug: "introduction", isGroup: false, path: "/soap-guide" },
    { name: "How to Write SOAP Notes", slug: "how-to-write", isGroup: false, path: "/soap-guide/how-to-write" },
    { name: "AI for SOAP Note Charting", slug: "ai-soap-notes", isGroup: false, path: "/soap-guide/ai-soap-notes" },
  
    // Professions with specific issue examples
    {
      name: "Physical Therapy", slug: "physical-therapy", isGroup: true, path: "/soap-guide/physical-therapy",
      subtopics: [
        { name: "Low Back Pain Example", slug: "low-back-pain" },
        { name: "Knee Sprain (ACL) Example", slug: "knee-sprain-acl" },
        { name: "Rotator Cuff Tendinopathy Example", slug: "rotator-cuff-tendinopathy" },
      ]
    },
    {
      name: "Occupational Therapy", slug: "occupational-therapy", isGroup: true, path: "/soap-guide/occupational-therapy",
      subtopics: [
        { name: "Stroke Rehab (ADL Focus) Example", slug: "stroke-rehab-adl" },
        { name: "Carpal Tunnel Syndrome Example", slug: "carpal-tunnel-syndrome" },
      ]
    },
    {
      name: "Speech Language Pathology", slug: "speech-language-pathology", isGroup: true, path: "/soap-guide/speech-language-pathology",
      subtopics: [
        { name: "Dysphagia Example", slug: "dysphagia" },
        { name: "Aphasia (Post-Stroke) Example", slug: "aphasia-post-stroke" },
      ]
    },
    {
      name: "Psychotherapy & Counseling", slug: "psychotherapy", isGroup: true, path: "/soap-guide/psychotherapy",
      subtopics: [
        { name: "Depression (MDD) Example", slug: "depression-mdd" },
        { name: "Anxiety (GAD) Example", slug: "anxiety-gad" },
        { name: "Substance Abuse Counseling Example", slug: "substance-abuse" },
      ]
    },
    {
      name: "Veterinary Medicine", slug: "veterinary", isGroup: true, path: "/soap-guide/veterinary",
      subtopics: [
        { name: "Canine Wellness Exam Example", slug: "canine-wellness-exam" },
        { name: "Feline GI Upset Example", slug: "feline-gi-upset" },
      ]
    },
    // Add all other professions and their subtopics here...
    { name: "Psychiatry", slug: "psychiatry", isGroup: true, path: "/soap-guide/psychiatry", subtopics: [/* ... */] },
    { name: "Clinical Social Worker", slug: "clinical-social-work", isGroup: true, path: "/soap-guide/clinical-social-work", subtopics: [/* ... */] },
    { name: "Nurse Practitioner", slug: "nurse-practitioner", isGroup: true, path: "/soap-guide/nurse-practitioner", subtopics: [/* ... */] },
    { name: "Physician Assistant", slug: "physician-assistant", isGroup: true, path: "/soap-guide/physician-assistant", subtopics: [/* ... */] },
  ];