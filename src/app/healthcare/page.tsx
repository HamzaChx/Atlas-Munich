import { Metadata } from "next";
import { HeroBadge } from "@/components/shared";

import { getTranslations } from "next-intl/server";
import {
  Activity,
  MessageSquareText,
  ClipboardList,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Heart,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { OpenChatButton } from "./open-chat-button";

export const metadata: Metadata = {
  title: "Healthcare Navigator for Munich | Loubna",
  description:
    "Navigate German health insurance, find English-speaking doctors, and get medical translations for Munich. Loubna guides Moroccan students through every step.",
  keywords: [
    "German health insurance Munich",
    "Techniker Krankenkasse students",
    "English speaking doctor Munich",
    "Krankenversicherung international students",
    "medical translation Munich",
    "healthcare guide Moroccan students Munich",
  ],
  openGraph: {
    title: "Healthcare Navigator Munich | Atlas Munich",
    description:
      "Navigate German health insurance, find doctors, and understand medical processes step by step with Loubna — your AI healthcare guide for Munich.",
    type: "website",
    url: "https://atlasmunich.de/healthcare",
  },
};

const HEALTH_LINKS = [
  {
    name: "Techniker Krankenkasse",
    url: "https://www.tk.de",
    color: "from-emerald-600 to-emerald-500",
    shadow: "shadow-zinc-500/10",
    label: "Health Insurance (TK)",
  },
  {
    name: "AOK Bayern",
    url: "https://www.aok.de/pk/plus/",
    color: "from-green-500 to-emerald-500",
    shadow: "shadow-zinc-500/10",
    label: "Health Insurance (AOK)",
  },
  {
    name: "Klinikum r.d. Isar",
    url: "https://www.mri.tum.de",
    color: "from-rose-500 to-red-500",
    shadow: "shadow-zinc-500/10",
    label: "TUM Hospital",
  },
  {
    name: "LMU Klinikum",
    url: "https://www.lmu-klinikum.de",
    color: "from-emerald-600 to-emerald-500",
    shadow: "shadow-zinc-500/10",
    label: "LMU Hospital",
  },
];

const STEP_ICONS = [MessageSquareText, ClipboardList, CheckCircle2];
const STEP_COLORS = [
  {
    bg: "from-rose-500 to-red-600",
    shadow: "shadow-zinc-500/10",
    ring: "ring-rose-500/20",
  },
  { bg: "from-pink-500 to-rose-600", shadow: "shadow-zinc-500/10", ring: "ring-pink-500/20" },
  {
    bg: "from-red-500 to-rose-600",
    shadow: "shadow-zinc-500/10",
    ring: "ring-red-500/20",
  },
];

const TIP_ICONS = [Activity, ShieldCheck, Heart, AlertCircle];
const TIP_COLORS = [
  "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5",
  "border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/5",
  "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5",
  "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5",
];
const TIP_ICON_COLORS = [
  "text-blue-600 dark:text-blue-400",
  "text-rose-600 dark:text-rose-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-zellige",
];

export default async function HealthcarePage() {
  const t = await getTranslations("healthcare");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">


        <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center px-5 pb-16 pt-14 sm:pb-20 sm:pt-18 lg:pb-24 lg:pt-22 text-center">
          <HeroBadge icon={Activity} text={t("badge")} color="orange" />

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t("title")}
            <span className="mt-1 block text-zellige">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {t("subtitle")}
          </p>

          {/* Assistant identity card */}
          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/10 px-6 py-4 shadow-sm backdrop-blur-sm">
            <div className="relative flex-shrink-0">
              <Image
                src="/loubna.webp"
                alt="Loubna"
                width={96}
                height={96}
                quality={90}
                sizes="48px"
                priority
                className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-300/60 dark:ring-rose-500/40"
              />
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 ring-2 ring-white dark:ring-zinc-800">
                <Activity className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug text-left">
              {t("intro")}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <OpenChatButton label={t("cta")} />
          </div>
        </div>
      </section>

      {/* Theme-colored separator */}
      <div className="h-1 w-full bg-zellige/60" />

      {/* How It Works */}
      <section className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {t("features.title")}
            </h2>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* Connecting line between steps (desktop only) */}
            <div className="hidden sm:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] border-t-2 border-dashed border-zinc-200 dark:border-zinc-700 z-0" />

            {[1, 2, 3].map((step, i) => {
              const Icon = STEP_ICONS[i];
              const color = STEP_COLORS[i];
              return (
                <div
                  key={step}
                  className="relative z-10 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-xs font-bold text-white shadow-md">
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

      {/* Healthcare Tips */}
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

      {/* Official Health Resources */}
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
            {HEALTH_LINKS.map((resource) => (
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
                  <Activity className="h-5 w-5 text-white" />
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
