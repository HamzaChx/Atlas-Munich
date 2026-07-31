import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import {
  HomeIcon,
  FileText,
  Building2,
  GraduationCap,
  Activity,
  ArrowRight,
  Clock,
  CalendarDays,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Assistants for Munich Life",
  description:
    "Meet your personal AI assistants for Munich: housing applications, German bureaucracy, academic research, CVs, and more. Built for Moroccan newcomers.",
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
      "Personal AI assistants built for your Munich journey: housing, careers, bureaucracy, research. Each one specializes in getting you ahead.",
    type: "website",
    url: "https://atlasmunich.de/tools",
  },
};

/* ------------------------------------------------------------------ */
/*  Assistant configuration, one hue per assistant                     */
/* ------------------------------------------------------------------ */

interface AssistantConfig {
  key: string;
  name: string;
  avatar: string;
  icon: LucideIcon;
  href: string;
  external: boolean;
  tint: string;
  acc: string;
  ringClass: string;
}

const ASSISTANTS: AssistantConfig[] = [
  {
    key: "housing",
    name: "Riad",
    avatar: "/riad.webp",
    icon: HomeIcon,
    href: "/housing",
    external: false,
    tint: "bg-tint-terra",
    acc: "text-acc-terra",
    ringClass: "ring-acc-terra/40",
  },
  {
    key: "cv",
    name: "Hiro",
    avatar: "/hiro.webp",
    icon: FileText,
    href: "https://hiro-easier-hiring.vercel.app/",
    external: true,
    tint: "bg-tint-green",
    acc: "text-acc-green",
    ringClass: "ring-acc-green/40",
  },
  {
    key: "dalilah",
    name: "Dalilah",
    avatar: "/dalilah.webp",
    icon: Building2,
    href: "/bureaucracy",
    external: false,
    tint: "bg-tint-blue",
    acc: "text-acc-blue",
    ringClass: "ring-acc-blue/40",
  },
  {
    key: "ilham",
    name: "Ilham",
    avatar: "/ilham.webp",
    icon: GraduationCap,
    href: "/academic",
    external: false,
    tint: "bg-tint-plum",
    acc: "text-acc-plum",
    ringClass: "ring-acc-plum/40",
  },
  {
    key: "loubna",
    name: "Loubna",
    avatar: "/loubna.webp",
    icon: Activity,
    href: "/healthcare",
    external: false,
    tint: "bg-tint-saffron",
    acc: "text-acc-saffron",
    ringClass: "ring-acc-saffron/40",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function ToolsPage() {
  const t = await getTranslations("tools");

  const ctaClasses =
    "w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm font-semibold shadow-md shadow-zinc-900/10 dark:shadow-none transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200";

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {t("subtitle")}
        </p>
      </section>

      {/* ========== ASSISTANTS ========== */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {ASSISTANTS.map((assistant, index) => {
            const Icon = assistant.icon;
            const tags = t.raw(`tools.${assistant.key}.tags`) as string[];

            return (
              <div
                key={assistant.key}
                className={`reveal group relative flex flex-col overflow-hidden rounded-3xl ${assistant.tint} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:ring-1 dark:ring-white/10`}
              >
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  {/* Profile header */}
                  <div className="mb-5 flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <span
                        className="absolute -inset-2 rounded-full bg-card/70"
                        aria-hidden="true"
                      />
                      <Image
                        src={assistant.avatar}
                        alt={assistant.name}
                        width={128}
                        height={128}
                        quality={90}
                        sizes="72px"
                        priority={index < 2}
                        className={`relative h-18 w-18 rounded-full object-cover ring-2 ${assistant.ringClass}`}
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card shadow-sm ${assistant.acc}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                      {assistant.name}
                    </h2>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {t(`tools.${assistant.key}.title`)}
                    </p>

                    <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-card/80 px-2.5 py-0.5 text-xs font-semibold text-acc-green">
                      <span className="h-1.5 w-1.5 rounded-full bg-acc-green" aria-hidden="true" />
                      {t(`tools.${assistant.key}.status`)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mb-4 line-clamp-3 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {t(`tools.${assistant.key}.description`)}
                  </p>

                  {/* Tags */}
                  <div className="mb-5 flex flex-wrap justify-center gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full bg-card/70 px-2.5 py-0.5 text-xs font-medium ${assistant.acc}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
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

          {/* Coming Soon: Events (6th slot) */}
          <div className="reveal relative flex flex-col overflow-hidden rounded-3xl bg-card/60 shadow-[0_2px_16px_rgb(0_0_0/0.04)] dark:shadow-none dark:ring-1 dark:ring-white/5">
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="mb-5 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <span className="absolute -inset-2 rounded-full bg-tint-plum" aria-hidden="true" />
                  <div className="relative flex h-18 w-18 items-center justify-center rounded-full bg-card ring-2 ring-acc-plum/30">
                    <CalendarDays className="h-8 w-8 text-acc-plum" />
                  </div>
                </div>
                <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                  {t("tools.events.title")}
                </h2>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Munich Event Planner
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-tint-saffron px-2.5 py-0.5 text-xs font-semibold text-acc-saffron">
                  <Clock className="h-3 w-3" />
                  {t("tools.events.status")}
                </span>
              </div>

              <p className="mb-4 line-clamp-3 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t("tools.events.description")}
              </p>

              <div className="mb-5 flex flex-wrap justify-center gap-1.5">
                {(t.raw("tools.events.tags") as string[]).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-white/5 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto">
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                  <Clock className="h-4 w-4" />
                  {t("tools.events.comingSoonNote")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits + more coming */}
        <div className="reveal mt-12 rounded-[2rem] bg-tint-blue p-8 text-center dark:ring-1 dark:ring-white/10">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("designedBy")}{" "}
            <a
              href="https://mohamed-nejjar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-acc-blue underline-offset-2 hover:underline"
            >
              Mohamed Nejjar
            </a>
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {t("moreComing")}{" "}
            <a
              href="https://github.com/HamzaChx/Atlas-Munich"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-acc-blue underline-offset-2 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
