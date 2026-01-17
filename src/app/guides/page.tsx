import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar, CategoryCard, HeroBadge, Callout } from "@/components/shared";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { getTranslations } from "next-intl/server";
import { BookOpen, Compass, Sparkles, ArrowRight, Filter, CheckCircle2 } from "lucide-react";

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
      {/* Hero Section - Mobile-First Optimized */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs - hidden on mobile for cleaner look */}
        <div className="hidden sm:block absolute -left-32 top-1/4 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-200/50 to-teal-200/50 dark:from-emerald-600/20 dark:to-teal-600/20 blur-[100px]" />
        <div className="hidden sm:block absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/40 dark:from-cyan-500/15 dark:to-blue-600/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge - smaller on mobile */}
            <HeroBadge icon={BookOpen} text={`${guides.length}+ ${t("badge")}`} color="emerald" />

            {/* Title - scaled for mobile */}
            <h1 className="mb-3 sm:mb-5 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {t("title")}
              <span className="mt-1 sm:mt-2 block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle - 2 lines max on mobile */}
            <p className="mx-auto max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2 sm:line-clamp-none">
              {t("subtitle")}
              <span className="hidden sm:inline font-semibold text-amber-600 dark:text-amber-400">
                {" "}
                {t("subtitleHighlight")}
              </span>
            </p>

            {/* Search - full width on mobile */}
            <div className="mx-auto mt-6 sm:mt-8 max-w-xl">
              <SearchBar placeholder={t("searchPlaceholder")} size="lg" showButton={false} />
            </div>

            {/* Stats - inline text format on mobile */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base">
              <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {categories.length}
                </span>
                <span>{t("stats.categories")}</span>
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {guides.length}
                </span>
                <span>{t("stats.totalGuides")}</span>
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t("stats.communityVerified")}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Data freshness callout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Callout variant="warning" title="Heads up — info may change">
          We’re working hard to keep these guides fresh, but some details can get out of date. Use
          this guide as a helpful starting point — and if you spot something that’s changed, please
          let us know so we can update it. Thanks for helping us keep things accurate!
        </Callout>
      </div>

      {/* Categories Section */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {t("categoriesSection.badge")}
                </span>
              </div>
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                {t("categoriesSection.title")}
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              <Link href="/search">
                <Filter className="mr-2 h-4 w-4" />
                {t("categoriesSection.advancedSearch")}
              </Link>
            </Button>
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
          <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-8 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="mb-5 inline-flex rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 p-3">
              <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
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
