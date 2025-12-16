export type GuideMeta = {
  slug: string;
  title: string;
  summary: string;
  category: "immigration" | "housing" | "careers" | "daily-life" | "university";
  lastVerified: string; // ISO date string
  path: string;         // route path
};

export const guidesIndex: GuideMeta[] = [
  {
    slug: "first-14-days",
    title: "First 14 Days in Munich",
    summary: "Do these first: Anmeldung, insurance, bank, SIM, transport.",
    category: "daily-life",
    lastVerified: "2025-12-01",
    path: "/guides/first-14-days"
  },
  {
    slug: "anmeldung-kvr",
    title: "Anmeldung (City Registration) at KVR",
    summary: "Register within 14 days at a Bürgerbüro. Bring passport and Wohnungsgeberbestätigung (landlord confirmation). No walk-ins - book online at muenchen.de/termin.",
    category: "immigration",
    lastVerified: "2025-12-01",
    path: "/guides/anmeldung-kvr"
  },
  {
    slug: "residence-permit",
    title: "Student Residence Permit Application",
    summary: "Apply online via Munich Immigration website before your visa expires. Need: passport, enrollment proof, health insurance, blocked account/funds proof. Processing: 4-8 weeks. Cost: ~€100.",
    category: "immigration",
    lastVerified: "2025-12-01",
    path: "/guides/residence-permit"
  },
  {
    slug: "permit-extension",
    title: "Extending Your Residence Permit",
    summary: "Apply 3-4 months before expiry. After 4th semester, bring study progress proof. If applied in time, your old permit stays valid (Fiktionswirkung).",
    category: "immigration",
    lastVerified: "2025-12-01",
    path: "/guides/permit-extension"
  },
  {
    slug: "fiktionsbescheinigung",
    title: "Fiktionsbescheinigung: Temporary Proof of Status",
    summary: "Temporary paper confirming your permit is valid while application is processed. Needed for travel, employers, or when card expires before new one arrives.",
    category: "immigration",
    lastVerified: "2025-12-01",
    path: "/guides/fiktionsbescheinigung"
  },
  {
    slug: "kvr-emergency",
    title: "KVR Emergency Appointments",
    summary: "For expiring permits, urgent travel (7 days), or job/benefit risks. Emergency slots appear online same day (early AM). Bring proof of emergency.",
    category: "immigration",
    lastVerified: "2025-12-01",
    path: "/guides/kvr-emergency"
  },
  {
    slug: "housing-basics",
    title: "Housing Basics & Scam Checklist",
    summary: "Where to look, what to avoid, deposits, contracts, and sharing tips.",
    category: "housing",
    lastVerified: "2025-12-01",
    path: "/guides/housing-basics"
  },
  {
    slug: "student-health-insurance",
    title: "Student Health Insurance 101",
    summary: "Public vs. private, how to enroll, and what proofs you’ll need.",
    category: "daily-life",
    lastVerified: "2025-12-01",
    path: "/guides/student-health-insurance"
  },
  {
    slug: "career-starter",
    title: "Career Starter Pack (Werkstudent & Internships)",
    summary: "CV style, job boards, career fairs, and networking for Munich. Non-EU: 120 full days or 240 half days work allowed per year.",
    category: "careers",
    lastVerified: "2025-12-01",
    path: "/guides/career-starter"
  },
  {
    slug: "university-portals",
    title: "University Portals (TUM/LMU/HM) Basics",
    summary: "TUMonline, LSF, HM tools — where to find courses, exams, and docs.",
    category: "university",
    lastVerified: "2025-12-01",
    path: "/guides/university-portals"
  }
];
