import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import {
  GraduationCap,
  Search,
  PenLine,
  Trophy,
  BookMarked,
  Library,
  BookOpen,
} from "lucide-react";
import {
  AssistantLanding,
  type AssistantLandingConfig,
} from "@/components/chatbot/AssistantLanding";

export const metadata: Metadata = {
  title: "Academic Research Companion for Munich Students | Ilham",
  description:
    "Research, structure, and refine academic work at TUM or LMU. Ilham helps you sharpen research questions, plan milestones, and write with academic integrity.",
  keywords: [
    "academic writing Munich",
    "thesis help TUM",
    "research companion LMU",
    "scientific writing assistant",
    "citation manager students Munich",
    "Master thesis Munich students",
  ],
  openGraph: {
    title: "Academic Research Companion Munich | Atlas Munich",
    description:
      "Structure papers, refine writing, and plan thesis milestones with Ilham, your AI research companion for TUM and LMU.",
    type: "website",
    url: "https://atlasmunich.de/academic",
  },
};

const CONFIG: AssistantLandingConfig = {
  namespace: "academic",
  chatbot: "ilham",
  name: "Ilham",
  avatar: "/ilham.webp",
  icon: GraduationCap,
  chatPath: "/academic/chat",
  stepIcons: [Search, PenLine, Trophy],
  linksKey: "resources",
  links: [
    {
      name: "TUM Library",
      label: "Research and databases",
      url: "https://www.ub.tum.de",
      icon: Library,
    },
    {
      name: "LMU Library",
      label: "Research and databases",
      url: "https://www.ub.uni-muenchen.de",
      icon: BookOpen,
    },
    {
      name: "Google Scholar",
      label: "Literature discovery",
      url: "https://scholar.google.com",
      icon: Search,
    },
    {
      name: "Zotero",
      label: "Citation manager",
      url: "https://www.zotero.org",
      icon: BookMarked,
    },
  ],
};

export default async function AcademicPage({ params }: { params: Promise<{ locale: string }> }) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  return <AssistantLanding config={CONFIG} />;
}
