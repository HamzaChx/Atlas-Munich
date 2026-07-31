import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { getTranslations } from "next-intl/server";
import {
  Heart,
  GithubIcon,
  Mail,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Globe,
  ExternalLink,
  Star,
  ArrowRight,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Atlas Munich is a community-driven guide built by Moroccan students and professionals for newcomers navigating life in Munich, Germany.",
  keywords: [
    "Atlas Munich team",
    "Moroccan community Munich",
    "about Atlas Munich",
    "Munich community guide",
    "Moroccan students Germany",
  ],
  openGraph: {
    title: "About Atlas Munich | Community Guide for Moroccan Newcomers",
    description:
      "Atlas Munich is a community-driven guide built by Moroccan students and professionals for newcomers navigating life in Munich, Germany.",
    type: "website",
    url: "https://atlasmunich.de/about",
  },
};

const contributors = [
  {
    name: "Hamza Chaouki",
    role: "Founder & Developer",
    avatar: "👨‍💻",
    url: "https://hamzachaouki.vercel.app/",
  },
  {
    name: "Mohamed Nejjar",
    role: "Our AI Specialist",
    avatar: "🤖",
    url: "https://mohamed-nejjar.vercel.app/",
  },
];

export default async function AboutPage() {
  const t = await getTranslations("about");
  const c = await getTranslations("community");

  const values = [
    {
      icon: Heart,
      title: t("values.communityFirst"),
      description: t("values.communityFirstDesc"),
      tint: "bg-tint-terra",
      acc: "text-acc-terra",
    },
    {
      icon: CheckCircle2,
      title: t("values.accuracyMatters"),
      description: t("values.accuracyMattersDesc"),
      tint: "bg-tint-blue",
      acc: "text-acc-blue",
    },
    {
      icon: Globe,
      title: t("values.openAndFree"),
      description: t("values.openAndFreeDesc"),
      tint: "bg-tint-green",
      acc: "text-acc-green",
    },
  ];

  const ways = [
    {
      icon: MessageCircle,
      title: t("contribute.suggestUpdates"),
      description: t("contribute.suggestUpdatesDesc"),
      action: { label: t("contribute.contactUs"), href: "mailto:hello@atlasmunich.de" },
      tint: "bg-tint-blue",
      acc: "text-acc-blue",
    },
    {
      icon: Star,
      title: t("contribute.spreadTheWord"),
      description: t("contribute.spreadTheWordDesc"),
      action: { label: t("contribute.share"), href: "#" },
      tint: "bg-tint-saffron",
      acc: "text-acc-saffron",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-12 pt-14 text-center sm:pb-16 sm:pt-20">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="rise rise-3 mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            className="rounded-full bg-zinc-900 px-6 text-white shadow-md shadow-zinc-900/15 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
          >
            <Link href="#contribute">
              <Sparkles className="mr-2 h-4 w-4" />
              {t("howToContribute")}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full px-6 text-zinc-600 hover:bg-card hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white"
          >
            <Link href="#contact">
              <Mail className="mr-2 h-4 w-4" />
              {t("getInTouch")}
            </Link>
          </Button>
        </div>
      </section>

      {/* ========== WHATSAPP COMMUNITY ========== */}
      <section id="community" className="scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-5xl rounded-[2rem] bg-tint-green p-7 sm:p-12 dark:ring-1 dark:ring-white/10">
          <div className="mb-8 text-center">
            <span className="eyebrow">{c("badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {c("title")} <span className="text-bloom">{c("titleHighlight")}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
              {c("subtitle")}
            </p>
          </div>

          <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-12">
            {/* QR Code */}
            <div className="flex-shrink-0">
              <div className="rounded-2xl bg-card p-4 shadow-[0_8px_30px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-white/10">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent("https://chat.whatsapp.com/BjITbXHnM9Q6xapvC1Q3rX")}&bgcolor=ffffff&color=000000&margin=16`}
                  alt="WhatsApp Community QR Code"
                  width={180}
                  height={180}
                  className="h-40 w-40 rounded-lg sm:h-44 sm:w-44"
                />
              </div>
              <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
                {c("qrInstructions")}
              </p>
            </div>

            {/* Community Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                {c("joinTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
                {c("joinDescription")}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400 sm:justify-start">
                <span>
                  <span className="font-semibold text-zinc-800 dark:text-white">100+</span>{" "}
                  {c("stats.members")}
                </span>
                <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-zinc-800 dark:text-white">24/7</span>{" "}
                  {c("stats.active")}
                </span>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3 sm:items-start">
                <a
                  href="https://chat.whatsapp.com/BjITbXHnM9Q6xapvC1Q3rX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  {c("joinButton")}
                </a>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <Shield className="h-3.5 w-3.5 text-zellige" />
                  {c("verified.description")}
                </div>
              </div>

              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">{c("joinNote")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STORY / VALUES / CONTRIBUTE / TEAM / CONTACT ========== */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Our Story */}
        <section className="reveal mx-auto mb-16 max-w-3xl text-center sm:mb-24">
          <span className="eyebrow">{t("story.badge")}</span>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {t("story.title")}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>{t("story.p1")}</p>
            <p>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {t("story.p2Start")}
              </span>
              {t("story.p2End")}
            </p>
            <p>{t("story.p3")}</p>
          </div>
        </section>

        {/* Values */}
        <section className="reveal mb-16 sm:mb-24">
          <div className="mb-8 text-center">
            <span className="eyebrow">{t("values.badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("values.title")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className={`rounded-3xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${value.tint} dark:ring-1 dark:ring-white/10`}
              >
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-card/80 shadow-sm">
                  <value.icon className={`h-5 w-5 ${value.acc}`} />
                </span>
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Contribute */}
        <section id="contribute" className="reveal mb-16 scroll-mt-24 sm:mb-24">
          <div className="mb-8 text-center">
            <span className="eyebrow">{t("contribute.badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("contribute.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
              {t("contribute.description")}
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {ways.map((way) => (
              <div
                key={way.title}
                className="rounded-3xl bg-card p-6 shadow-[0_2px_16px_rgb(0_0_0/0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-white/10"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${way.tint}`}
                  >
                    <way.icon className={`h-4 w-4 ${way.acc}`} />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                      {way.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {way.description}
                    </p>
                    <Link
                      href={way.action.href}
                      target={way.action.href.startsWith("http") ? "_blank" : undefined}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-zellige transition-opacity hover:opacity-80"
                    >
                      {way.action.label}
                      {way.action.href.startsWith("http") ? (
                        <ExternalLink className="h-3 w-3" />
                      ) : (
                        <ArrowRight className="h-3 w-3" />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contributors */}
        <section className="reveal mb-16 sm:mb-24">
          <div className="mb-8 text-center">
            <span className="eyebrow">{t("contributors.badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("contributors.title")}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {contributors.map((contributor) => (
              <a
                key={contributor.name}
                href={contributor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-56 rounded-3xl bg-card p-6 text-center shadow-[0_2px_16px_rgb(0_0_0/0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-white/10"
              >
                <div className="mx-auto mb-3 text-4xl">{contributor.avatar}</div>
                <h3 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zellige dark:text-white">
                  {contributor.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{contributor.role}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-zellige opacity-0 transition-opacity group-hover:opacity-100">
                  <ExternalLink className="h-3 w-3" />
                  <span>View portfolio</span>
                </div>
              </a>
            ))}

            {/* Join CTA */}
            <div className="w-56 rounded-3xl border-2 border-dashed border-zinc-300/80 p-6 text-center dark:border-zinc-700">
              <div className="mx-auto mb-3 text-4xl">🙋</div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {t("contributors.you")}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("contributors.joinTeam")}
              </p>
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-zellige transition-opacity hover:opacity-80"
              >
                {t("contributors.contributeOnGithub")}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="reveal scroll-mt-24">
          <div className="rounded-[2rem] bg-tint-saffron p-8 text-center sm:p-12 dark:ring-1 dark:ring-white/10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("contact.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
              {t("contact.description")}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
              >
                <GithubIcon className="h-4 w-4" />
                {t("contact.github")}
              </Link>
              <Link
                href="mailto:hello@atlasmunich.de"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                {t("contact.emailUs")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
