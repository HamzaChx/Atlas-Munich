import { Metadata } from "next";
import { HeroBadge } from "@/components/shared";
import { MoroccanCorner } from "@/components/home";
import { getTranslations } from "next-intl/server";
import {
  Sparkles,
  HomeIcon,
  FileText,
  Building2,
  GraduationCap,
  Activity,
  ArrowRight,
  Clock,
  Zap,
  CalendarDays,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Assistants for Munich Life",
  description:
    "Meet your personal AI assistants for Munich — housing applications, German bureaucracy, academic research, CVs, and more. Built for Moroccan newcomers.",
  keywords: [
    "Munich AI assistants",
    "WG application assistant",
    "German bureaucracy AI",
    "academic research companion Munich",
    "CV tool Munich",
    "tools for Moroccan students Munich",
  ],
  openGraph: {
    title: "AI Assistants for Munich | Atlas Munich",
    description:
      "Personal AI assistants built for your Munich journey — housing, careers, bureaucracy, research. Each one specializes in getting you ahead.",
    type: "website",
    url: "https://atlas-munich.de/tools",
  },
};

/* ------------------------------------------------------------------ */
/*  Assistant configuration                                           */
/* ------------------------------------------------------------------ */

interface AssistantColors {
  bar: string;
  iconBg: string;
  iconShadow: string;
  ring: string;
  tag: string;
  cta: string;
}

interface AssistantConfig {
  key: string;
  name: string;
  avatar: string;
  icon: LucideIcon;
  href: string;
  external: boolean;
  colors: AssistantColors;
}

const ASSISTANTS: AssistantConfig[] = [
  {
    key: "housing",
    name: "Riad",
    avatar: "/riad.webp",
    icon: HomeIcon,
    href: "/housing",
    external: false,
    colors: {
      bar: "from-yellow-300 via-amber-400 to-orange-500",
      iconBg: "from-amber-500 to-orange-600",
      iconShadow: "shadow-amber-500/30",
      ring: "ring-2 ring-amber-300/50 dark:ring-amber-500/30",
      tag: "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
      cta: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40",
    },
  },
  {
    key: "cv",
    name: "Hiro",
    avatar: "/hiro.webp",
    icon: FileText,
    href: "https://hiro-easier-hiring.vercel.app/",
    external: true,
    colors: {
      bar: "from-slate-400 via-slate-500 to-zinc-600",
      iconBg: "from-slate-500 to-slate-600",
      iconShadow: "shadow-slate-500/30",
      ring: "ring-2 ring-slate-300/50 dark:ring-slate-500/30",
      tag: "border-slate-200 dark:border-slate-500/30 bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300",
      cta: "bg-slate-600 hover:bg-slate-700 active:bg-slate-800 shadow-md shadow-slate-500/25 hover:shadow-slate-500/40",
    },
  },
  {
    key: "dalilah",
    name: "Dalilah",
    avatar: "/dalilah.webp",
    icon: Building2,
    href: "/bureaucracy",
    external: false,
    colors: {
      bar: "from-teal-300 via-cyan-400 to-sky-500",
      iconBg: "from-teal-500 to-cyan-600",
      iconShadow: "shadow-teal-500/30",
      ring: "ring-2 ring-teal-300/50 dark:ring-teal-500/30",
      tag: "border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300",
      cta: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-500/25 hover:shadow-teal-500/40",
    },
  },
  {
    key: "ilham",
    name: "Ilham",
    avatar: "/ilham.webp",
    icon: GraduationCap,
    href: "/academic",
    external: false,
    colors: {
      bar: "from-indigo-500 via-violet-600 to-purple-700",
      iconBg: "from-violet-600 to-purple-700",
      iconShadow: "shadow-violet-600/30",
      ring: "ring-2 ring-violet-300/50 dark:ring-violet-600/30",
      tag: "border-violet-200 dark:border-violet-600/30 bg-violet-50 dark:bg-violet-600/10 text-violet-700 dark:text-violet-300",
      cta: "bg-violet-700 hover:bg-violet-800 active:bg-violet-900 shadow-md shadow-violet-600/25 hover:shadow-violet-600/40",
    },
  },
  {
    key: "loubna",
    name: "Loubna",
    avatar: "/loubna.webp",
    icon: Activity,
    href: "/healthcare",
    external: false,
    colors: {
      bar: "from-red-400 via-rose-500 to-pink-500",
      iconBg: "from-red-500 to-rose-600",
      iconShadow: "shadow-red-500/30",
      ring: "ring-2 ring-red-300/50 dark:ring-red-500/30",
      tag: "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
      cta: "bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-md shadow-red-500/25 hover:shadow-red-500/40",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function ToolsPage() {
  const t = await getTranslations("tools");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient orbs */}
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
          <HeroBadge icon={Sparkles} text={t("badge")} color="purple" />

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

      {/* ── Assistants Grid ── */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-12 sm:py-16">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 opacity-80" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Assistants grid — 2-column, 3 rows (5 live + 1 coming soon) */}
          <div className="grid gap-6 sm:grid-cols-2">
            {ASSISTANTS.map((assistant) => {
              const Icon = assistant.icon;
              const tags = t.raw(`tools.${assistant.key}.tags`) as string[];

              const ctaClasses = `w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl ${assistant.colors.cta} text-white text-sm font-semibold transition-all hover:scale-[1.02]`;

              return (
                <div
                  key={assistant.key}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Gradient accent bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${assistant.colors.bar}`} />

                  <div className="flex flex-1 flex-col p-6">
                    {/* Profile header */}
                    <div className="mb-5 flex flex-col items-center text-center">
                      {/* Avatar with icon overlay */}
                      <div className="relative mb-3">
                        <Image
                          src={assistant.avatar}
                          alt={assistant.name}
                          width={128}
                          height={128}
                          quality={90}
                          sizes="64px"
                          priority
                          className={`h-16 w-16 rounded-full object-cover ${assistant.colors.ring}`}
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${assistant.colors.iconBg} ${assistant.colors.iconShadow} ring-2 ring-white dark:ring-zinc-900`}
                        >
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>

                      {/* Name + role */}
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {assistant.name}
                      </h2>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {t(`tools.${assistant.key}.title`)}
                      </p>

                      {/* Live badge */}
                      <Badge className="mt-2.5 border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <Sparkles className="mr-1 h-3 w-3" />
                        {t(`tools.${assistant.key}.status`)}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-center text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {t(`tools.${assistant.key}.description`)}
                    </p>

                    {/* Tags */}
                    <div className="mb-5 flex flex-wrap justify-center gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${assistant.colors.tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      {assistant.external ? (
                        <a
                          href={assistant.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={ctaClasses}
                        >
                          {t(`tools.${assistant.key}.cta`)}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link href={assistant.href} className={ctaClasses}>
                          <MessageCircle className="h-4 w-4" />
                          {t(`tools.${assistant.key}.cta`)}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Coming Soon — Events card (6th slot, pairs with Loubna) */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm">
              {/* Overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[2px]">
                <div className="text-center px-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-base font-semibold text-zinc-800 dark:text-white mb-1">
                    {t("tools.events.status")}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("tools.events.comingSoonNote")}
                  </p>
                </div>
              </div>

              {/* Gradient accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-40" />

              <div className="flex flex-1 flex-col p-6 opacity-40 select-none pointer-events-none">
                {/* Profile header */}
                <div className="mb-5 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-amber-300/50 flex items-center justify-center">
                      <CalendarDays className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {t("tools.events.title")}
                  </h2>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Munich Event Planner
                  </p>
                  <Badge className="mt-2.5 border-amber-500/30 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    <Clock className="mr-1 h-3 w-3" />
                    {t("tools.events.status")}
                  </Badge>
                </div>

                {/* Description */}
                <p className="mb-4 text-center text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {t("tools.events.description")}
                </p>

                {/* Tags */}
                <div className="mb-5 flex flex-wrap justify-center gap-1.5">
                  {(t.raw("tools.events.tags") as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold">
                    <CalendarDays className="h-4 w-4" />
                    {t("tools.events.cta")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Thanks */}
          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("designedBy")}{" "}
              <a
                href="https://mohamed-nejjar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-violet-600 dark:text-violet-400 hover:underline underline-offset-2"
              >
                Mohamed Nejjar
              </a>
            </p>
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
