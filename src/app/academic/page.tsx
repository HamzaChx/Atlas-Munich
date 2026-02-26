import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EmbeddedChat } from "@/components/chatbot/EmbeddedChat";
import {
  Lightbulb,
  ShieldCheck,
  Clock,
  BookMarked,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Academic Research Companion for Munich Students | Ilham",
  description:
    "Ilham helps TUM and LMU students with research questions, scientific writing, thesis structuring, literature analysis, and LaTeX — with full academic integrity.",
  keywords: [
    "academic writing Munich",
    "thesis help TUM LMU",
    "research companion Munich students",
    "scientific writing AI",
    "thesis structuring Munich",
    "LaTeX help students",
    "literature review AI",
    "Moroccan students Munich university",
  ],
  openGraph: {
    title: "Academic Research Companion Munich | Atlas Munich",
    description:
      "Ilham helps Munich students with research, scientific writing, thesis work and LaTeX. Elevate your academic performance with integrity.",
    type: "website",
    url: "https://atlas-munich.de/academic",
  },
};

const ACADEMIC_RESOURCES = [
  {
    name: "TUM Library",
    url: "https://www.ub.tum.de",
    label: "Research & Databases",
    color: "from-indigo-500 to-blue-500",
    shadow: "shadow-indigo-500/20",
  },
  {
    name: "LMU Library",
    url: "https://www.ub.uni-muenchen.de",
    label: "Research & Databases",
    color: "from-violet-500 to-indigo-500",
    shadow: "shadow-violet-500/20",
  },
  {
    name: "Google Scholar",
    url: "https://scholar.google.com",
    label: "Literature Discovery",
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
  },
  {
    name: "Zotero",
    url: "https://www.zotero.org",
    label: "Citation Manager",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
];

const TIP_ICONS = [Lightbulb, ShieldCheck, Clock, BookMarked];
const TIP_COLORS = [
  "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5",
  "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5",
  "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5",
  "border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/5",
];
const TIP_ICON_COLORS = [
  "text-indigo-600 dark:text-indigo-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-amber-600 dark:text-amber-400",
  "text-violet-600 dark:text-violet-400",
];

export default async function AcademicPage() {
  const t = await getTranslations("academic");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Immersive Chat Experience */}
      <EmbeddedChat section="academic" />

      {/* Scroll indicator */}
      <div className="flex flex-col items-center py-5 bg-gradient-to-b from-white via-zinc-50/80 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/80 dark:to-zinc-900">
        <ChevronDown className="h-5 w-5 text-zinc-400 dark:text-zinc-500 animate-bounce" />
        <span className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-1 font-medium tracking-wide uppercase">
          Tips &amp; Resources
        </span>
      </div>

      {/* Academic Tips */}
      <section className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {t("tips.title")}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((tip, i) => {
              const Icon = TIP_ICONS[i];
              return (
                <div
                  key={tip}
                  className={`rounded-xl border p-5 ${TIP_COLORS[i]} transition-all duration-200 hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className={`h-5 w-5 ${TIP_ICON_COLORS[i]}`} />
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                        {t(`tips.tip${tip}Title`)}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {t(`tips.tip${tip}Desc`)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Resources */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-2 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {t("resources.title")}
            </h2>
          </div>
          <p className="mb-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {t("resources.subtitle")}
          </p>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {ACADEMIC_RESOURCES.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${resource.color} shadow-lg ${resource.shadow}`}
                >
                  <BookMarked className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <span className="block text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                    {resource.name}
                  </span>
                  <span className="block text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {resource.label}
                  </span>
                </div>
                <ExternalLink className="absolute top-2.5 right-2.5 h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
