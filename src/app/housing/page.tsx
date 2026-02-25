import { Metadata } from "next";
import { HeroBadge } from "@/components/shared";
import { getTranslations } from "next-intl/server";
import {
  HomeIcon,
  ClipboardPaste,
  MessageSquareText,
  Send,
  Zap,
  FileCheck,
  UserCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import { OpenChatButton } from "./open-chat-button";

export const metadata: Metadata = {
  title: "Housing Application Assistant for Munich",
  description:
    "Generate a high-conversion WG or apartment application message in German for Munich's rental market. Paste a listing and Riad writes a ready-to-send message for you.",
  keywords: [
    "Munich WG application",
    "apartment application Munich German",
    "Bewerbung WG Munich",
    "WG-Gesucht application generator",
    "ImmobilienScout24 Munich application",
    "rental application AI Munich",
    "housing tool Munich students",
  ],
  openGraph: {
    title: "Munich Housing Application Assistant | Atlas Munich",
    description:
      "Generate a high-conversion WG or apartment application message in German. Paste a listing and get a ready-to-send message instantly.",
    type: "website",
    url: "https://atlas-munich.de/housing",
  },
};

const PLATFORMS = [
  {
    name: "ImmobilienScout24",
    url: "https://www.immobilienscout24.de",
    color: "from-orange-500 to-red-500",
    shadow: "shadow-orange-500/20",
  },
  {
    name: "WG-Gesucht",
    url: "https://www.wg-gesucht.de",
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
  },
  {
    name: "Immowelt",
    url: "https://www.immowelt.de",
    color: "from-teal-500 to-cyan-500",
    shadow: "shadow-teal-500/20",
  },
  {
    name: "eBay Kleinanzeigen",
    url: "https://www.kleinanzeigen.de",
    color: "from-green-500 to-emerald-500",
    shadow: "shadow-green-500/20",
  },
];

const STEP_ICONS = [ClipboardPaste, MessageSquareText, Send];
const STEP_COLORS = [
  { bg: "from-blue-500 to-cyan-600", shadow: "shadow-blue-500/30", ring: "ring-blue-500/20" },
  {
    bg: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/30",
    ring: "ring-violet-500/20",
  },
  {
    bg: "from-emerald-500 to-green-600",
    shadow: "shadow-emerald-500/30",
    ring: "ring-emerald-500/20",
  },
];

const TIP_ICONS = [Zap, FileCheck, UserCheck, ShieldAlert];
const TIP_COLORS = [
  "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5",
  "border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/5",
  "border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/5",
  "border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/5",
];
const TIP_ICON_COLORS = [
  "text-amber-600 dark:text-amber-400",
  "text-blue-600 dark:text-blue-400",
  "text-violet-600 dark:text-violet-400",
  "text-rose-600 dark:text-rose-400",
];

export default async function HousingPage() {
  const t = await getTranslations("housing");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="hidden sm:block absolute -left-32 top-1/4 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-200/50 to-cyan-200/50 dark:from-blue-600/20 dark:to-cyan-600/20 blur-[100px]" />
        <div className="hidden sm:block absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-200/40 to-emerald-200/40 dark:from-cyan-500/15 dark:to-emerald-600/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:py-12 lg:py-20 sm:px-6 lg:px-8 text-center">
          <HeroBadge icon={HomeIcon} text={t("badge")} color="blue" />
          <h1 className="mb-3 sm:mb-5 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {t("title")}
            <span className="mt-1 sm:mt-2 block bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 dark:from-blue-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
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
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-xs font-bold text-white shadow-md">
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

          {/* CTA after steps */}
          <div className="mt-8 text-center">
            <OpenChatButton label={t("cta")} variant="link" />
          </div>
        </div>
      </section>

      {/* Munich Housing Tips */}
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

      {/* Where to Search — Platform Links */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-2 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              {t("platforms.title")}
            </h2>
          </div>
          <p className="mb-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {t("platforms.subtitle")}
          </p>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${platform.color} shadow-lg ${platform.shadow}`}
                >
                  <HomeIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white text-center leading-tight">
                  {platform.name}
                </span>
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
