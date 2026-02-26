import { Metadata } from "next";
import { HeroBadge } from "@/components/shared";
import { getTranslations } from "next-intl/server";
import {
  GraduationCap,
  Search,
  PenLine,
  Trophy,
  Lightbulb,
  ShieldCheck,
  Clock,
  BookMarked,
  ExternalLink,
} from "lucide-react";
import { OpenChatButton } from "./open-chat-button";

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

const STEP_ICONS = [Search, PenLine, Trophy];
const STEP_COLORS = [
  { bg: "from-indigo-500 to-blue-600", shadow: "shadow-indigo-500/30" },
  { bg: "from-violet-500 to-indigo-600", shadow: "shadow-violet-500/30" },
  { bg: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/30" },
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
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="hidden sm:block absolute -left-32 top-1/4 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-200/50 to-blue-200/50 dark:from-indigo-600/20 dark:to-blue-600/20 blur-[100px]" />
        <div className="hidden sm:block absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-200/40 to-indigo-200/40 dark:from-violet-500/15 dark:to-indigo-600/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:py-12 lg:py-20 sm:px-6 lg:px-8 text-center">
          <HeroBadge icon={GraduationCap} text={t("badge")} color="purple" />
          <h1 className="mb-3 sm:mb-5 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {t("title")}
            <span className="mt-1 sm:mt-2 block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
            {t("subtitle")}
          </p>
          <div className="flex justify-center mt-6">
            <OpenChatButton label={t("cta")} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {t("features.title")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((step, i) => {
              const Icon = STEP_ICONS[i];
              const color = STEP_COLORS[i];
              return (
                <div
                  key={step}
                  className="relative rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-md">
                      {step}
                    </span>
                  </div>
                  <div
                    className={`mx-auto mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color.bg} shadow-lg ${color.shadow}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    {t(`features.step${step}Title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {t(`features.step${step}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <OpenChatButton label={t("cta")} variant="link" />
          </div>
        </div>
      </section>

      {/* Academic Tips */}
      <section className="border-b border-zinc-200 dark:border-white/10 py-12 sm:py-16">
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

      {/* Academic Resource Links */}
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

      {/* Chatbot anchor */}
      <div id="chatbot" />
    </div>
  );
}
