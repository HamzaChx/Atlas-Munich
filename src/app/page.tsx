import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared";
import { ZelligeRosette } from "@/components/home";
import { categories } from "@/data/categories";
import { guides, getFeaturedGuides } from "@/data/guides";
import { getTranslations } from "next-intl/server";
import {
  HelpCircle,
  Users,
  Home as HomeIcon,
  FileText,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

/* One hue per category — each row wears its own soft color */
const catStyles: Record<string, { row: string; count: string; dot: string }> = {
  "rent-housing": {
    row: "bg-tint-terra hover:shadow-xl hover:shadow-acc-terra/15",
    count: "text-acc-terra",
    dot: "bg-acc-terra",
  },
  "kvr-residence": {
    row: "bg-tint-blue hover:shadow-xl hover:shadow-acc-blue/15",
    count: "text-acc-blue",
    dot: "bg-acc-blue",
  },
  "university-life": {
    row: "bg-tint-green hover:shadow-xl hover:shadow-acc-green/15",
    count: "text-acc-green",
    dot: "bg-acc-green",
  },
  career: {
    row: "bg-tint-plum hover:shadow-xl hover:shadow-acc-plum/15",
    count: "text-acc-plum",
    dot: "bg-acc-plum",
  },
  "useful-apps": {
    row: "bg-tint-saffron hover:shadow-xl hover:shadow-acc-saffron/15",
    count: "text-acc-saffron",
    dot: "bg-acc-saffron",
  },
};

const catEmoji: Record<string, string> = {
  "rent-housing": "🔑",
  "kvr-residence": "📋",
  "university-life": "🎓",
  career: "💼",
  "useful-apps": "📱",
};

export default async function Home() {
  const t = await getTranslations("home");
  const tCat = await getTranslations("categories");
  const common = await getTranslations("common");

  const guideCountByCategory = (key: string) => guides.filter((g) => g.categoryKey === key).length;
  const featuredGuides = getFeaturedGuides();

  const quickLinks = [
    {
      label: t("quickLinks.findHousing"),
      href: "/housing",
      pill: "bg-tint-terra text-acc-terra hover:shadow-acc-terra/20",
    },
    {
      label: t("quickLinks.halalFood"),
      href: "/places",
      pill: "bg-tint-green text-acc-green hover:shadow-acc-green/20",
    },
    {
      label: t("quickLinks.allGuides"),
      href: "/guides",
      pill: "bg-tint-blue text-acc-blue hover:shadow-acc-blue/20",
    },
    {
      label: t("quickLinks.aiTools"),
      href: "/tools",
      pill: "bg-tint-plum text-acc-plum hover:shadow-acc-plum/20",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ========== HERO — a mosaic ground, floating words, clean center ========== */}
      <section className="relative overflow-hidden">
        {/* Two rosettes, each continuing past the edge of the page */}
        <ZelligeRosette
          uid="zl"
          spin="420s"
          className="left-0 top-[38%] -translate-x-[46%] -translate-y-1/2 pointer-events-none"
          svgClassName="w-[70px] sm:w-[280px] lg:w-[400px] opacity-40 sm:opacity-100"
        />
        <ZelligeRosette
          uid="zr"
          spin="530s"
          reverse
          className="right-0 top-[62%] translate-x-[46%] -translate-y-1/2 pointer-events-none"
          svgClassName="w-[60px] sm:w-[250px] lg:w-[355px] opacity-40 sm:opacity-100"
        />

        {/* Floating words, the two homes drifting around the message */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          <span
            dir="rtl"
            lang="ar"
            className="float-slow absolute left-[18%] top-[20%] hidden text-6xl font-bold text-bloom/25 lg:block xl:left-[20%] dark:text-bloom/35"
            style={{ "--tilt": "-6deg" } as React.CSSProperties}
          >
            مرحبا
          </span>
          <span
            className="float-slower absolute right-[17%] top-[16%] hidden font-display text-4xl font-extrabold text-zellige/30 lg:block xl:right-[19%]"
            style={{ "--tilt": "5deg" } as React.CSSProperties}
          >
            Servus!
          </span>
          <span
            className="float-slower absolute left-[20%] top-[66%] hidden font-display text-xl font-bold tracking-wide text-zinc-400/50 xl:block dark:text-zinc-500/50"
            style={{ "--tilt": "-4deg" } as React.CSSProperties}
          >
            München
          </span>
          <span
            dir="rtl"
            lang="ar"
            className="float-slow absolute right-[20%] top-[64%] hidden text-3xl font-semibold text-saffron/45 xl:block"
            style={{ "--tilt": "4deg" } as React.CSSProperties}
          >
            الأطلس
          </span>
        </div>

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 pb-16 pt-20 text-center sm:pb-24 sm:pt-28 2xl:max-w-3xl 2xl:pb-32 2xl:pt-36">
          <h1 className="rise rise-1 font-display text-[2.6rem] font-bold leading-[1.06] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl 2xl:text-7xl">
            {t("heroTitle")}
            <span className="block pb-1 text-bloom">{t("heroTitleHighlight")}</span>
          </h1>

          <p className="rise rise-2 mt-5 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
            {t("heroSubtitle")}{" "}
          </p>

          <div className="rise rise-3 mt-9 w-full max-w-lg 2xl:max-w-xl">
            <SearchBar placeholder={t("searchPlaceholder")} size="lg" showButton={false} />
          </div>

          {/* Colored quick links */}
          <div className="rise rise-4 mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${link.pill}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========== CATEGORIES + GUIDES — one structured spread ========== */}
      <section className="relative py-16 sm:py-24 2xl:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
          <div className="reveal grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 2xl:gap-20">
            {/* Left — find your way */}
            <div className="lg:col-span-7">
              <span className="eyebrow">{t("categories.badge")}</span>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
                {t("categories.title")}
                <span className="text-bloom">{t("categories.titleHighlight")}</span>
              </h2>
              <p className="mt-2.5 max-w-md text-sm text-zinc-500 dark:text-zinc-400 2xl:max-w-lg 2xl:text-base">
                {t("categories.subtitle")}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {categories.map((category) => {
                  const style = catStyles[category.key];
                  const count = guideCountByCategory(category.key);
                  const countLabel =
                    count > 0
                      ? `${count} ${count === 1 ? common("guide") : common("guides")}`
                      : common("new");
                  return (
                    <Link
                      key={category.key}
                      href={`/category/${category.key}`}
                      className={`group flex items-center gap-3.5 rounded-2xl px-4.5 py-4 outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-zellige focus-visible:ring-offset-2 focus-visible:ring-offset-background ${style.row}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {tCat(`${category.key}.title`)}
                        </span>
                        <span className={`block text-xs font-medium ${style.count}`}>
                          {countLabel}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400/70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                    </Link>
                  );
                })}

                <Link
                  href="/guides"
                  className="group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300/80 px-4.5 py-4 text-sm font-semibold text-zinc-500 outline-none transition-all duration-300 hover:-translate-y-1 hover:border-zellige/40 hover:text-zellige focus-visible:ring-2 focus-visible:ring-zellige focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zellige/50 dark:hover:text-zellige"
                >
                  {t("categories.browseAll")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right — most-read guides, on a golden panel */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-tint-saffron p-6 shadow-[0_2px_20px_rgb(0_0_0/0.05)] sm:p-7 lg:mt-[4.5rem] dark:shadow-none dark:ring-1 dark:ring-border">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {t("featured.title")}
                  </h3>
                  <Link
                    href="/guides"
                    className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-acc-saffron transition-opacity hover:opacity-80"
                  >
                    {t("featured.viewAll")}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                <div className="mt-4 space-y-1">
                  {featuredGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group -mx-2 flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors duration-200 hover:bg-card/80 dark:hover:bg-foreground/[0.075]"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${catStyles[guide.categoryKey]?.dot ?? "bg-zellige"}`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {guide.title}
                      </span>
                      <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                        {guide.readingTime} {t("featured.minRead")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== AGENTIC AI — the green pavilion ========== */}
      <section className="px-4 py-6 sm:px-6 sm:py-10 lg:px-8 2xl:px-12">
        <div className="reveal relative mx-auto max-w-6xl 2xl:max-w-[96rem] overflow-hidden rounded-[2rem] bg-tint-green p-7 shadow-[0_2px_24px_rgb(0_0_0/0.05)] sm:p-12 2xl:p-16 dark:shadow-none dark:ring-1 dark:ring-border">
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 2xl:gap-16">
            <div className="lg:col-span-5">
              <span className="eyebrow">{t("toolsSpotlight.badge")}</span>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
                {t("toolsSpotlight.title")}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 2xl:max-w-md 2xl:text-base">
                {t("toolsSpotlight.subtitle")}
              </p>
              <Button
                asChild
                className="mt-5 rounded-full bg-zinc-900 px-6 text-white shadow-md shadow-zinc-900/15 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
              >
                <Link href="/tools">
                  {t("toolsSpotlight.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-2.5 lg:col-span-7">
              <Link
                href="/housing"
                className="group flex items-center gap-4 rounded-xl bg-card px-4 py-3.5 shadow-[0_1px_8px_rgb(0_0_0/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-border dark:hover:bg-zinc-800/60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tint-terra text-acc-terra">
                  <HomeIcon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {t("toolsSpotlight.housingTool")}
                  </span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.housingToolDesc")}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
              </Link>

              <div className="group relative flex items-center gap-4 rounded-xl bg-card px-4 py-3.5 shadow-[0_1px_8px_rgb(0_0_0/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-border dark:hover:bg-zinc-800/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tint-green text-acc-green">
                  <FileText className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {t("toolsSpotlight.cvTool")}
                  </span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.cvToolDesc")} ·{" "}
                    <a
                      href="https://mohamed-nejjar.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 font-medium text-zinc-500 hover:underline dark:text-zinc-400"
                    >
                      Mohamed Nejjar
                    </a>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-card/60 px-4 py-3.5 shadow-[0_1px_8px_rgb(0_0_0/0.03)] dark:shadow-none dark:ring-1 dark:ring-border/70">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tint-plum text-acc-plum">
                  <CalendarDays className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {t("toolsSpotlight.eventTool")}
                  </span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.eventToolDesc")}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-tint-saffron px-2.5 py-0.5 text-[11px] font-semibold text-acc-saffron">
                  {t("toolsSpotlight.eventToolStatus")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY ========== */}
      <section className="relative py-16 sm:py-24 2xl:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
          <div className="reveal grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 2xl:gap-16">
            <div className="lg:col-span-7">
              <span className="eyebrow">{t("community.badge")}</span>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-4xl">
                {t("community.title")}
                <span className="text-bloom">{t("community.titleHighlight")}</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[15px]">
                {t("community.description1")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[15px]">
                {t("community.description2")}{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("community.atlasName")}
                </span>
                {t("community.description3")}
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button
                  asChild
                  className="rounded-full bg-zinc-900 px-6 text-white shadow-md shadow-zinc-900/15 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
                >
                  <Link href="/about">
                    <Users className="mr-2 h-4 w-4" />
                    {t("community.aboutCommunity")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full px-6 text-zinc-600 hover:bg-card hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
                >
                  <Link href="/faq">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t("community.commonQuestions")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden flex-col items-center text-center lg:col-span-5 lg:flex">
              <p
                dir="rtl"
                lang="ar"
                className="float-slower text-6xl font-bold leading-snug text-bloom"
              >
                مرحبا بيك
              </p>
              <p className="mt-5 text-sm text-zinc-400 dark:text-zinc-500">
                {t("byTheCommunity")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
