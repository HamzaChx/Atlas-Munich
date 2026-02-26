import { Metadata } from "next";
import { HeroBadge } from "@/components/shared";
import { MoroccanCorner } from "@/components/home";
import { getTranslations } from "next-intl/server";
import {
  Wrench,
  HomeIcon,
  FileText,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Tools for Munich",
  description:
    "Free AI-powered tools for Munich newcomers: write winning WG rental applications in German, draft professional CVs, and more.",
  keywords: [
    "Munich AI tools",
    "WG application generator",
    "apartment application Munich",
    "German rental application AI",
    "CV tool Munich",
    "tools for Moroccan students Munich",
    "free tools Munich expats",
  ],
  openGraph: {
    title: "Free AI Tools for Munich Newcomers | Atlas Munich",
    description:
      "Free AI-powered tools for Munich newcomers: write winning WG rental applications in German, draft professional CVs, and more.",
    type: "website",
    url: "https://atlas-munich.de/tools",
  },
};

export default async function ToolsPage() {
  const t = await getTranslations("tools");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Subtle violet gradient orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-violet-200/30 to-blue-100/10 dark:from-violet-700/15 dark:to-blue-600/5 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-cyan-200/30 to-indigo-100/10 dark:from-cyan-700/15 dark:to-indigo-600/5 blur-[100px]" />

        {/* Moroccan corner ornaments */}
        <MoroccanCorner
          position="top-left"
          className="pointer-events-none absolute left-0 top-0 h-20 w-20 sm:h-28 sm:w-28 lg:h-36 lg:w-36 opacity-50"
        />
        <MoroccanCorner
          position="top-right"
          className="pointer-events-none absolute right-0 top-0 h-20 w-20 sm:h-28 sm:w-28 lg:h-36 lg:w-36 opacity-50"
        />

        <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center px-5 pb-16 pt-14 sm:pb-20 sm:pt-18 lg:pb-24 lg:pt-22 text-center">
          <HeroBadge icon={Wrench} text={t("badge")} color="purple" />

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t("title")}
            <span className="mt-1 block bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 dark:from-violet-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-12 sm:py-16">
        {/* Violet separator line */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 opacity-80" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Housing Application Assistant — Live */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30">
                    <HomeIcon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    {t("tools.housing.status")}
                  </Badge>
                </div>

                <h2 className="mb-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  {t("tools.housing.title")}
                </h2>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {t("tools.housing.description")}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {(t.raw("tools.housing.tags") as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/riad.png"
                      alt="Riad"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-white/10"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Riad
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {t("tools.housing.poweredBy")}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/housing"
                    className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
                  >
                    {t("tools.housing.cta")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* CV & Cover Letter Drafter — Live (Hiro) */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    {t("tools.cv.status")}
                  </Badge>
                </div>

                <h2 className="mb-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  {t("tools.cv.title")}
                </h2>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {t("tools.cv.description")}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {(t.raw("tools.cv.tags") as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/hiro.png"
                      alt="Hiro"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-white/10"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Hiro
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {t("tools.cv.poweredBy")}
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://hiro-easier-hiring.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold transition-all shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]"
                  >
                    {t("tools.cv.cta")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* German Bureaucracy Navigator — Live (Dalilah) */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    {t("tools.dalilah.status")}
                  </Badge>
                </div>

                <h2 className="mb-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  {t("tools.dalilah.title")}
                </h2>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {t("tools.dalilah.description")}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {(t.raw("tools.dalilah.tags") as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/dalilah.jpeg"
                      alt="Dalilah"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-white/10"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Dalilah
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {t("tools.dalilah.poweredBy")}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/bureaucracy"
                    className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]"
                  >
                    {t("tools.dalilah.cta")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Academic Research Companion — Live (Ilham) */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {t("tools.ilham.status")}
                  </Badge>
                </div>

                <h2 className="mb-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  {t("tools.ilham.title")}
                </h2>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {t("tools.ilham.description")}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {(t.raw("tools.ilham.tags") as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/ilham.jpeg"
                      alt="Ilham"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-white/10"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Ilham
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {t("tools.ilham.poweredBy")}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/academic"
                    className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
                  >
                    {t("tools.ilham.cta")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Event Planner — Coming Soon */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900">
              {/* Coming soon overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[2px]">
                <div className="text-center px-6">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                    <Clock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-base font-semibold text-zinc-800 dark:text-white mb-1">
                    {t("tools.events.status")}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("tools.events.comingSoonNote")}
                  </p>
                </div>
              </div>

              <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-40" />
              <div className="flex flex-1 flex-col p-6 opacity-40 select-none pointer-events-none">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                    <CalendarDays className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="border-amber-500/30 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    <Clock className="mr-1 h-3 w-3" />
                    {t("tools.events.status")}
                  </Badge>
                </div>

                <h2 className="mb-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  {t("tools.events.title")}
                </h2>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {t("tools.events.description")}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {(t.raw("tools.events.tags") as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    disabled
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm font-semibold cursor-not-allowed"
                  >
                    {t("tools.events.cta")}
                    <Clock className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* More Coming */}
          <div className="mt-12 rounded-2xl border border-dashed border-violet-200/60 dark:border-white/10 bg-violet-50/30 dark:bg-violet-500/5 p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/15">
              <Zap className="h-5 w-5 text-violet-500 dark:text-violet-400" />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("moreComing")}{" "}
              <a
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
