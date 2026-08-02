import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HelpCircle, Users, ArrowRight, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { getFeaturedGuides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";

/* One hue per category, matching the tints /guides already uses for the
   same keys, so a row here and its topic there read as the same place. */
const catStyles: Record<string, { row: string; count: string; dot: string }> = {
  "rent-housing": { row: "bg-tint-terra hover:shadow-xl hover:shadow-acc-terra/15", count: "text-acc-terra", dot: "bg-acc-terra" },
  "kvr-residence": { row: "bg-tint-blue hover:shadow-xl hover:shadow-acc-blue/15", count: "text-acc-blue", dot: "bg-acc-blue" },
  "university-life": { row: "bg-tint-green hover:shadow-xl hover:shadow-acc-green/15", count: "text-acc-green", dot: "bg-acc-green" },
  career: { row: "bg-tint-plum hover:shadow-xl hover:shadow-acc-plum/15", count: "text-acc-plum", dot: "bg-acc-plum" },
  "useful-apps": { row: "bg-tint-saffron hover:shadow-xl hover:shadow-acc-saffron/15", count: "text-acc-saffron", dot: "bg-acc-saffron" },
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCat = await getTranslations("categories");
  const featuredGuides = await localizeGuides(getFeaturedGuides(), locale);

  const quickAccess = [
    { label: t("quick.map"), href: "/map" },
    { label: t("quick.studies"), href: "/studies" },
    { label: t("quick.career"), href: "/career" },
  ];

  return (
    <div className="min-h-screen">
      {/* ========== HERO ==========
          Full-bleed photograph again, per direction. The scrim is a flat
          solid tone, not the previous layered black gradient, so it reads
          as one deliberate wash rather than a decorative vignette.

          The highlight word is pinned to the dark-surface red rather than
          the theme's `text-bloom` (which is a softer red made for ink-on
          -plaster): on a photo whose frame is dominated by red jerseys,
          the softer value measured under 3:1 against the busiest patches
          even through the scrim, and this page's type doesn't get to pick
          a calmer patch of photo to sit on. */}
      {/* `main` carries a global `pt-(--header-h)` so sticky offsets on every
          other page line up under the bar; that same padding would leave
          this hero's photo starting below the header instead of behind it.
          Pulling the section up by that exact height (and no more, so nothing
          else on the page shifts) is the fix, not touching the shared spacer. */}
      <section className="relative isolate -mt-(--header-h) flex min-h-[78vh] w-full flex-col justify-center overflow-hidden sm:min-h-screen">
        <Image
          src="/atlas-hero.jpeg"
          alt={t("heroImageAlt")}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-zinc-950/60" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-32 pb-16 text-center sm:px-6 sm:pt-40 sm:pb-24 lg:px-8 lg:pt-44">
          <h1 className="rise rise-1 display-wide font-display text-balance text-[2.75rem] font-bold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
            {t("heroTitle")}
            <span className="block pb-1 text-[oklch(0.715_0.17_25)] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
              {t("heroTitleHighlight")}
            </span>
          </h1>

          <p className="rise rise-2 mx-auto mt-6 max-w-lg text-balance text-lg leading-relaxed text-white/90 sm:text-xl [text-shadow:0_1px_16px_rgba(0,0,0,0.5)]">
            {t("heroSubtitle")}
          </p>

          <span className="rise rise-3 mt-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.715_0.17_25)]" aria-hidden="true" />
            {t("quick.badge")}
          </span>

          {/* Same two-CTA grammar as the Community and Tools sections below
              (dark ink pill + ghost), not a bespoke hero treatment: the ink
              pill just borrows the site's own dark-mode colors (light fill,
              dark text) because the hero is a permanently-dark surface
              regardless of which theme the reader is on. */}
          <div className="rise rise-4 mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {quickAccess.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-white ${
                  idx === 0
                    ? "bg-zinc-50 text-zinc-900 shadow-md shadow-black/20 hover:bg-zinc-200"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES + FEATURED GUIDES ========== */}
      <section className="relative py-16 sm:py-24 2xl:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
          <div className="reveal grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 2xl:gap-20">
            {/* Left, find your way */}
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
                  return (
                    <Link
                      key={category.key}
                      href={`/guides?q=${encodeURIComponent(tCat(`${category.key}.title`))}`}
                      className={`group flex items-center gap-3.5 rounded-2xl px-4.5 py-4 outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-zellige focus-visible:ring-offset-2 focus-visible:ring-offset-background ${style.row}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {tCat(`${category.key}.title`)}
                        </span>
                        <span className={`block truncate text-xs font-medium ${style.count}`}>
                          {tCat(`${category.key}.description`)}
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

            {/* Right, most-read guides on a golden panel */}
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

      {/* ========== AGENTIC AI, the green pavilion ========== */}
      <section className="px-4 sm:px-6 lg:px-8 2xl:px-12">
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
                href="/housing/chat"
                className="group flex items-center gap-4 rounded-xl bg-card px-4 py-3.5 shadow-[0_1px_8px_rgb(0_0_0/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-border dark:hover:bg-zinc-800/60"
              >
                <span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm">
                  <Image src="/riad.webp" alt="Riad" width={40} height={40} className="h-full w-full object-cover" />
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

              <Link
                href="/bureaucracy/chat"
                className="group relative flex items-center gap-4 rounded-xl bg-card px-4 py-3.5 shadow-[0_1px_8px_rgb(0_0_0/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-border dark:hover:bg-zinc-800/60"
              >
                <span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm">
                  <Image src="/dalilah.webp" alt="Dalilah" width={40} height={40} className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {t("toolsSpotlight.bureaucracyTool")}
                  </span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.bureaucracyToolDesc")}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
              </Link>

              <Link
                href="/academic/chat"
                className="group flex items-center gap-4 rounded-xl bg-card/60 px-4 py-3.5 shadow-[0_1px_8px_rgb(0_0_0/0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.1)] hover:bg-card dark:shadow-none dark:ring-1 dark:ring-border/70 dark:hover:bg-zinc-800/60"
              >
                <span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm">
                  <Image src="/ilham.webp" alt="Ilham" width={40} height={40} className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {t("toolsSpotlight.academicTool")}
                  </span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.academicToolDesc")}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
              </Link>
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
                  <Link href="/community">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t("community.commonQuestions")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* The greeting, back beside the community copy. It stacks under
                the text on small screens rather than disappearing, which is
                what the old `hidden lg:flex` did to every phone. */}
            <div className="flex flex-col items-center text-center lg:col-span-5">
              <p
                dir="rtl"
                lang="ar"
                className="float-slower text-5xl font-bold leading-snug text-bloom lg:text-6xl"
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
