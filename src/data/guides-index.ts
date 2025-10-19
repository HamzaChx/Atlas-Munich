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
    lastVerified: "2025-10-01",
    path: "/guides/first-14-days"
  },
  {
    slug: "anmeldung-kvr",
    title: "Anmeldung (City Registration) at KVR",
    summary: "Book a Termin and bring the right documents to register your address.",
    category: "immigration",
    lastVerified: "2025-10-01",
    path: "/guides/anmeldung-kvr"
  },
  {
    slug: "housing-basics",
    title: "Housing Basics & Scam Checklist",
    summary: "Where to look, what to avoid, deposits, contracts, and sharing tips.",
    category: "housing",
    lastVerified: "2025-10-01",
    path: "/guides/housing-basics"
  },
  {
    slug: "student-health-insurance",
    title: "Student Health Insurance 101",
    summary: "Public vs. private, how to enroll, and what proofs you’ll need.",
    category: "daily-life",
    lastVerified: "2025-10-01",
    path: "/guides/student-health-insurance"
  },
  {
    slug: "career-starter",
    title: "Career Starter Pack (Werkstudent & Internships)",
    summary: "CV style, job boards, career fairs, and networking for Munich.",
    category: "careers",
    lastVerified: "2025-10-01",
    path: "/guides/career-starter"
  },
  {
    slug: "university-portals",
    title: "University Portals (TUM/LMU/HM) Basics",
    summary: "TUMonline, LSF, HM tools — where to find courses, exams, and docs.",
    category: "university",
    lastVerified: "2025-10-01",
    path: "/guides/university-portals"
  }
];
