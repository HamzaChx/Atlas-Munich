import { Metadata } from "next";
import Link from "next/link";
import { SearchBar, CategoryCard, HeroBadge, Callout } from "@/components/shared";
import { MoroccanCorner } from "@/components/home";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { getTranslations } from "next-intl/server";
import { BookOpen, Compass, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "All Guides",
  description:
    "Comprehensive guides to help you navigate life in Munich as a Moroccan student or professional.",
};

export default async function GuidesPage() {
  const t = await getTranslations("guides");

  const guideCountByCategory = (key: string) => guides.filter((g) => g.categoryKey === key).length;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Subtle emerald gradient orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-100/10 dark:from-emerald-700/15 dark:to-teal-600/5 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-100/10 dark:from-cyan-700/15 dark:to-blue-600/5 blur-[100px]" />

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
          <HeroBadge icon={BookOpen} text={`${guides.length}+ ${t("badge")}`} color="emerald" />

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t("title")}
            <span className="mt-1 block bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {t("subtitle")}{" "}
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {t("subtitleHighlight")}
            </span>
          </p>

          <div className="mt-7 w-full sm:mt-8">
            <SearchBar placeholder={t("searchPlaceholder")} size="lg" showButton={false} />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400 sm:mt-8">
            <span>
              <span className="font-semibold text-zinc-800 dark:text-white">
                {categories.length}
              </span>{" "}
              {t("stats.categories")}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>
              <span className="font-semibold text-zinc-800 dark:text-white">{guides.length}</span>{" "}
              {t("stats.totalGuides")}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {t("stats.communityVerified")}
            </span>
          </div>
        </div>
      </section>

      {/* Heads Up callout + Categories Section */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-10 sm:py-16">
        {/* Emerald separator line */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Data freshness callout */}
          <div className="mb-10">
            <Callout variant="warning" title="Heads up — info may change">
              We're working hard to keep these guides fresh, but some details can get out of date. Use
              this guide as a helpful starting point — and if you spot something that's changed, please
              let us know so we can update it. Thanks for helping us keep things accurate!
            </Callout>
          </div>

          {/* Section Header */}
          <div className="mb-10">
            <div className="mb-2 flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {t("categoriesSection.badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("categoriesSection.title")}
            </h2>
          </div>

          {/* Categories - Horizontal scroll on mobile, grid on desktop */}
          <div className="lg:hidden overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex gap-3 min-w-max">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  href={`/category/${category.key}`}
                  className="group flex items-center gap-2.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 px-4 py-2.5 shadow-sm transition-all hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/30"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 whitespace-nowrap">
                    {category.title}
                  </span>
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {guideCountByCategory(category.key) || "New"}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.key}
                categoryKey={category.key}
                title={category.title}
                description={category.description}
                href={`/category/${category.key}`}
                icon={category.icon}
                color={category.color}
                count={guideCountByCategory(category.key) || "New"}
                className={
                  index <= 2
                    ? "lg:col-span-2"
                    : index === 3
                      ? "sm:col-span-2 lg:col-span-2 lg:col-start-2"
                      : "lg:col-span-2"
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-200/40 dark:border-white/10 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-8 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="mb-5 inline-flex rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20 p-3">
              <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("cta.title")}</h2>
            <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-400">
              {t("cta.description")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-emerald-600 hover:to-teal-600"
              >
                {t("cta.browseFaqs")}
              </Link>
              <Link
                href="/about#contribute"
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {t("cta.contributeGuide")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
