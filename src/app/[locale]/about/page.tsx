import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/shared";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site-config";

import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Heart,
  HeartHandshake,
  GithubIcon,
  Mail,
  MessageCircle,
  CheckCircle2,
  Globe,
  ExternalLink,
  ArrowRight,
  Plus,
  ListChecks,
  GraduationCap,
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
    initials: "HC",
    url: "https://hamzachaouki.vercel.app/",
    tint: "bg-tint-terra",
    text: "text-acc-terra",
  },
  {
    name: "Mohamed Nejjar",
    role: "Our AI Specialist",
    initials: "MN",
    url: "https://mohamed-nejjar.vercel.app/",
    tint: "bg-tint-blue",
    text: "text-acc-blue",
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const c = await getTranslations("community");

  const manifesto = [
    {
      icon: ListChecks,
      tint: "bg-tint-terra",
      text: "text-acc-terra",
      title: t("manifesto.items.practical"),
      description: t("manifesto.items.practicalDesc"),
    },
    {
      icon: GraduationCap,
      tint: "bg-tint-blue",
      text: "text-acc-blue",
      title: t("manifesto.items.studentAware"),
      description: t("manifesto.items.studentAwareDesc"),
    },
    {
      icon: GithubIcon,
      tint: "bg-tint-green",
      text: "text-acc-green",
      title: t("manifesto.items.openSource"),
      description: t("manifesto.items.openSourceDesc"),
    },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-14 pt-14 text-center sm:pb-20 sm:pt-20 2xl:max-w-3xl">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}
        </p>

        <div className="rise rise-3 mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            className="rounded-full bg-zinc-900 px-6 text-white shadow-md shadow-zinc-900/15 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
          >
            <Link href="#contribute">
              <HeartHandshake className="mr-2 h-4 w-4" />
              {t("howToContribute")}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full px-6 text-zinc-600 hover:bg-card hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
          >
            <Link href="#contact">
              <Mail className="mr-2 h-4 w-4" />
              {t("getInTouch")}
            </Link>
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 2xl:px-12">
        {/* ========== STORY: editorial spread with the manifesto beside it ========== */}
        <section className="reveal mb-16 sm:mb-24 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">{t("story.badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
              {t("story.title")}
            </h2>

            <ul className="mt-8 space-y-4">
              {manifesto.map((item) => (
                <li key={item.title} className="flex items-start gap-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tint}`}
                  >
                    <item.icon className={`h-4 w-4 ${item.text}`} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {item.title}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-zinc-600 lg:col-span-7 lg:mt-0 dark:text-zinc-400">
            <p>{t("story.p1")}</p>
            <p>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {t("story.p2Start")}
              </span>
              {t("story.p2End")}
            </p>
            <p>{t("story.p3")}</p>
          </div>
        </section>

        {/* ========== WHATSAPP COMMUNITY ========== */}
        <section id="community" className="reveal mb-16 scroll-mt-24 sm:mb-24">
          <div className="rounded-[2rem] bg-tint-green p-7 sm:p-12 dark:ring-1 dark:ring-border">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <span className="eyebrow">{c("badge")}</span>
                <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
                  {c("title")} <span className="text-bloom">{c("titleHighlight")}</span>
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 lg:mx-0 dark:text-zinc-300 sm:text-base">
                  {c("subtitle")}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 lg:justify-start dark:text-zinc-400">
                  <span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-50">100+</span>{" "}
                    {c("stats.members")}
                  </span>
                </div>

                <div className="mt-7 flex flex-col items-center gap-3 lg:items-start">
                  <a
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {c("joinButton")}
                  </a>
                  
                </div>
              </div>

              {/* QR card */}
              <div className="shrink-0">
                <div className="rounded-2xl bg-card p-4 shadow-[0_8px_30px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-border">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(WHATSAPP_COMMUNITY_URL)}&bgcolor=ffffff&color=000000&margin=16`}
                    alt="WhatsApp Community QR Code"
                    width={180}
                    height={180}
                    className="h-40 w-40 rounded-lg sm:h-44 sm:w-44"
                  />
                </div>
                <p className="mx-auto mt-3 max-w-44 text-center text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {c("qrInstructions")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CONTRIBUTE + TEAM ========== */}
        <section id="contribute" className="reveal mb-16 scroll-mt-24 sm:mb-24 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">{t("contribute.badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
              {t("contribute.title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base">
              {t("contribute.description")}
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-blue">
                  <MessageCircle className="h-4 w-4 text-acc-blue" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {t("contribute.suggestUpdates")}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {t("contribute.suggestUpdatesDesc")}
                  </p>
                  <Link
                    href="mailto:hamza.chaouki@tum.de"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-zellige transition-opacity hover:opacity-80"
                  >
                    {t("contribute.contactUs")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-saffron">
                  <Heart className="h-4 w-4 text-acc-saffron" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {t("contribute.spreadTheWord")}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {t("contribute.spreadTheWordDesc")}
                  </p>
                  <ShareButton
                    variant="ghost"
                    size="sm"
                    text={t("contribute.share")}
                    className="mt-1 -ml-3 h-auto rounded-full px-3 py-1.5 text-sm font-semibold text-zellige hover:bg-transparent hover:text-zellige hover:opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* The team */}
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <div className="rounded-3xl bg-card p-6 shadow-[0_2px_20px_rgb(0_0_0/0.06)] sm:p-8 dark:shadow-none dark:ring-1 dark:ring-border">
              <span className="eyebrow">{t("contributors.badge")}</span>
              <h3 className="font-display mt-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("contributors.title")}
              </h3>

              <div className="mt-6 space-y-2">
                {contributors.map((contributor) => (
                  <a
                    key={contributor.name}
                    href={contributor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-zinc-100/70 dark:hover:bg-foreground/[0.075]"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${contributor.tint} ${contributor.text}`}
                    >
                      {contributor.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zellige dark:text-zinc-50">
                        {contributor.name}
                      </span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                        {contributor.role}
                      </span>
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-zellige dark:text-zinc-600" />
                  </a>
                ))}

                {/* Open seat */}
                <a
                  href="https://github.com/HamzaChx/Atlas-Munich"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-zinc-100/70 dark:hover:bg-foreground/[0.075]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zellige-soft text-zellige">
                    <Plus className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zellige dark:text-zinc-50">
                      {t("contributors.you")}
                    </span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {t("contributors.joinTeam")}
                    </span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-zellige sm:inline-flex">
                    {t("contributors.contributeOnGithub")}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-zinc-300 sm:hidden dark:text-zinc-600" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CONTACT ========== */}
        <section id="contact" className="reveal scroll-mt-24">
          <div className="rounded-[2rem] bg-tint-saffron p-8 text-center sm:p-12 dark:ring-1 dark:ring-border">
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
              {t("contact.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
              {t("contact.description")}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
              >
                <GithubIcon className="h-4 w-4" />
                {t("contact.github")}
              </Link>
              <Link
                href="mailto:hamza.chaouki@tum.de"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-foreground/10"
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
