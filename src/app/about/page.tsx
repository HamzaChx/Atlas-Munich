import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeroBadge } from "@/components/shared";
import { MoroccanCorner } from "@/components/home";
import { getTranslations } from "next-intl/server";
import {
  Users,
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
    url: "https://atlas-munich.de/about",
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
      gradient: "from-red-500/20 to-rose-500/20",
      iconColor: "text-red-400",
    },
    {
      icon: CheckCircle2,
      title: t("values.accuracyMatters"),
      description: t("values.accuracyMattersDesc"),
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: Globe,
      title: t("values.openAndFree"),
      description: t("values.openAndFreeDesc"),
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
    },
  ];

  const ways = [
    {
      icon: MessageCircle,
      title: t("contribute.suggestUpdates"),
      description: t("contribute.suggestUpdatesDesc"),
      action: { label: t("contribute.contactUs"), href: "mailto:hello@atlas-munich.de" },
    },
    {
      icon: Star,
      title: t("contribute.spreadTheWord"),
      description: t("contribute.spreadTheWordDesc"),
      action: { label: t("contribute.share"), href: "#" },
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Subtle Moroccan-flag gradient orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-red-200/30 to-red-100/10 dark:from-red-700/15 dark:to-red-600/5 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-green-200/30 to-emerald-100/10 dark:from-green-700/15 dark:to-emerald-600/5 blur-[100px]" />

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
          <HeroBadge icon={Users} text={t("badge")} color="emerald" />

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:mt-8">
            <Button
              asChild
              className="text-white bg-emerald-600 px-6 shadow-xl shadow-emerald-500/20 hover:bg-emerald-500"
            >
              <Link href="#contribute">
                <Sparkles className="mr-2 h-4 w-4" />
                {t("howToContribute")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border border-zinc-200 dark:border-white/10 px-6 text-zinc-900 dark:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <Link href="#contact">
                <Mail className="mr-2 h-4 w-4" />
                {t("getInTouch")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community / WhatsApp */}
      <section
        id="community"
        className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-10 sm:py-16 scroll-mt-24"
      >
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-80" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 px-4 py-2">
              <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                {c("badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {c("title")}{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {c("titleHighlight")}
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              {c("subtitle")}
            </p>
          </div>

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-green-200/60 dark:border-white/10 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 p-8 sm:p-10 shadow-sm dark:shadow-none">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-green-400/10 to-emerald-400/10 dark:from-green-500/5 dark:to-emerald-500/5 blur-3xl" />
            <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/10 dark:from-emerald-500/5 dark:to-teal-500/5 blur-3xl" />

            <div className="relative flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-12">
              {/* Floating QR Code */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative rotate-2 group-hover:rotate-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-2xl border border-green-200 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 shadow-lg shadow-green-500/10 group-hover:shadow-xl group-hover:shadow-green-500/20">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent("https://chat.whatsapp.com/BjITbXHnM9Q6xapvC1Q3rX")}&bgcolor=ffffff&color=000000&margin=16`}
                      alt="WhatsApp Community QR Code"
                      width={180}
                      height={180}
                      className="h-40 w-40 sm:h-44 sm:w-44 rounded-lg"
                    />
                  </div>
                </div>
                <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
                  {c("qrInstructions")}
                </p>
              </div>

              {/* Community Info */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {c("joinTitle")}
                </h3>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed sm:text-base">
                  {c("joinDescription")}
                </p>

                {/* Stats */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400 sm:justify-start">
                  <span>
                    <span className="font-semibold text-zinc-800 dark:text-white">100+</span>{" "}
                    {c("stats.members")}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span>
                    <span className="font-semibold text-zinc-800 dark:text-white">24/7</span>{" "}
                    {c("stats.active")}
                  </span>
                </div>

                {/* Join Button */}
                <div className="mt-6 flex flex-col items-center gap-3 sm:items-start">
                  <a
                    href="https://chat.whatsapp.com/BjITbXHnM9Q6xapvC1Q3rX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-7 py-3.5 text-sm font-medium text-white transition-all hover:from-green-600 hover:to-emerald-600 shadow-md shadow-green-500/25 hover:shadow-lg hover:shadow-green-500/30"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {c("joinButton")}
                  </a>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    {c("verified.description")}
                  </div>
                </div>

                <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">{c("joinNote")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="mb-10 sm:mb-16 lg:mb-20">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/30 p-8 sm:p-10 shadow-sm dark:shadow-none">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2">
                  <span className="text-sm">📖</span>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {t("story.badge")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
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
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-10 sm:mb-16 lg:mb-20">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-2">
              <span className="text-sm">💡</span>
              <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                {t("values.badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("values.title")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6 text-center shadow-sm dark:shadow-none transition-all hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-md dark:hover:shadow-none"
              >
                <div
                  className={`mx-auto mb-4 inline-flex rounded-xl bg-gradient-to-br ${value.gradient} p-3`}
                >
                  <value.icon className={`h-6 w-6 ${value.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Contribute */}
        <section id="contribute" className="mb-10 sm:mb-16 lg:mb-20 scroll-mt-24">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-2">
              <span className="text-sm">🤝</span>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {t("contribute.badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("contribute.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              {t("contribute.description")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ways.map((way) => (
              <div
                key={way.title}
                className="group rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-5 shadow-sm dark:shadow-none transition-all hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-md dark:hover:shadow-none"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 p-2.5">
                    <way.icon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                      {way.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {way.description}
                    </p>
                    <Link
                      href={way.action.href}
                      target={way.action.href.startsWith("http") ? "_blank" : undefined}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-500 dark:hover:text-emerald-300"
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
        <section className="mb-10 sm:mb-16 lg:mb-20">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 px-4 py-2">
              <span className="text-sm">👥</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                {t("contributors.badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
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
                className="group w-56 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-5 text-center shadow-sm dark:shadow-none transition-all hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-md dark:hover:shadow-none"
              >
                <div className="mx-auto mb-3 text-4xl">{contributor.avatar}</div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {contributor.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{contributor.role}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-3 w-3" />
                  <span>View portfolio</span>
                </div>
              </a>
            ))}

            {/* Join CTA */}
            <div className="w-56 rounded-2xl border-2 border-dashed border-zinc-300/80 dark:border-white/10 bg-white dark:bg-zinc-900/30 p-5 text-center">
              <div className="mx-auto mb-3 text-4xl">🙋</div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {t("contributors.you")}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {t("contributors.joinTeam")}
              </p>
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300"
              >
                {t("contributors.contributeOnGithub")}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-6 md:p-10 shadow-sm dark:shadow-none">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-400/10 dark:bg-teal-500/5 blur-3xl" />

            <div className="relative text-center">
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-emerald-100 dark:from-emerald-500/20 to-teal-100 dark:to-teal-500/20 p-3">
                <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {t("contact.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                {t("contact.description")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="https://github.com/HamzaChx/Atlas-Munich"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-emerald-600 hover:to-teal-600"
                >
                  <GithubIcon className="h-4 w-4" />
                  {t("contact.github")}
                </Link>
                <Link
                  href="mailto:hello@atlas-munich.de"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Mail className="h-4 w-4" />
                  {t("contact.emailUs")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
