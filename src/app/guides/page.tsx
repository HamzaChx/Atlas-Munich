import { Metadata } from "next";
import Link from "next/link";
import { SearchBar, Callout } from "@/components/shared";

import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "All Guides",
  description:
    "In-depth, community-written guides to life in Munich for Moroccan students and professionals. Housing, KVR, university life, career, and useful apps.",
  keywords: [
    "Munich guides",
    "Munich student guide",
    "how to live in Munich",
    "Moroccan Munich guides",
    "KVR guide Munich",
    "housing guide Munich",
    "university guide Munich TUM LMU",
    "career guide Munich",
    "useful apps Munich",
  ],
  openGraph: {
    title: "All Guides | Atlas Munich",
    description:
      "In-depth, community-written guides to life in Munich for Moroccan students and professionals.",
    type: "website",
    url: "https://atlasmunich.de/guides",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Guides | Atlas Munich",
    description:
      "In-depth, community-written guides to life in Munich for Moroccan students and professionals.",
  },
};

/* One hue per category, matching the landing page */
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

export default async function GuidesPage() {
  const t = await getTranslations("guides");
  const tCat = await getTranslations("categories");
  const tHome = await getTranslations("home");
  const common = await getTranslations("common");

  const guideCountByCategory = (key: string) => guides.filter((g) => g.categoryKey === key).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {t("subtitle")}{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {t("subtitleHighlight")}
          </span>
        </p>

        <div className="rise rise-3 mt-8 w-full">
          <SearchBar placeholder={t("searchPlaceholder")} size="lg" showButton={false} />
        </div>
      </section>

      {/* ========== CATEGORIES + INDEX ========== */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="reveal mb-10">
          <Callout variant="warning" title={t("callout.title")}>
            {t("callout.body")}
          </Callout>
        </div>

        <div className="reveal">
          <span className="eyebrow">{t("categoriesSection.badge")}</span>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {t("categoriesSection.title")}
          </h2>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card/80 text-lg shadow-sm">
                    {catEmoji[category.key]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-white">
                      {tCat(`${category.key}.title`)}
                    </span>
                    <span className={`block text-xs font-medium ${style.count}`}>{countLabel}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400/70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Full guide index */}
        <div className="reveal mx-auto mt-14 max-w-3xl sm:mt-20">
          <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
            {t("list.title")}
          </h2>
          <div className="mt-4 space-y-1">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-colors duration-200 hover:bg-card dark:hover:bg-zinc-800/50"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${catStyles[guide.categoryKey]?.dot ?? "bg-zellige"}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-zellige dark:text-white">
                    {guide.title}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {guide.summary}
                  </span>
                </span>
                <span className="hidden shrink-0 text-sm text-zinc-400 dark:text-zinc-500 sm:block">
                  {guide.readingTime} {tHome("featured.minRead")}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-zellige dark:text-zinc-600" />
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal mt-14 rounded-[2rem] bg-tint-saffron p-8 text-center sm:mt-20 sm:p-10 dark:ring-1 dark:ring-white/10">
          <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-300">
            {t("cta.description")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              {t("cta.browseFaqs")}
            </Link>
            <Link
              href="/about#contribute"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {t("cta.contributeGuide")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
