import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar, CategoryCard, GuideCard, HeroBadge } from "@/components/shared";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { getTranslations } from "next-intl/server";
import { 
  BookOpen, 
  ChevronRight, 
  Compass, 
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

export const metadata: Metadata = {
  title: "All Guides",
  description: "Comprehensive guides to help you navigate life in Munich as a Moroccan student or professional.",
};

export default async function GuidesPage() {
  const t = await getTranslations("guides");

  const guideCountByCategory = (key: string) =>
    guides.filter((g) => g.categoryKey === key).length;

  // Group guides by category
  const guidesByCategory = categories.map((category) => ({
    category,
    guides: guides.filter((g) => g.categoryKey === category.key),
  }));

  // Stats
  const stats = [
    { label: t("stats.categories"), value: categories.length },
    { label: t("stats.totalGuides"), value: guides.length },
    { label: t("stats.communityVerified"), value: "100%" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section - Matching Home Page Style */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-1/4 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-200/50 to-teal-200/50 dark:from-emerald-600/20 dark:to-teal-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/40 dark:from-cyan-500/15 dark:to-blue-600/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <HeroBadge icon={BookOpen} text={`${guides.length}+ ${t("badge")}`} color="emerald" />

            {/* Title */}
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
              {t("title")}
              <span className="mt-2 block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("subtitle")}
              <span className="font-semibold text-amber-600 dark:text-amber-400">{t("subtitleHighlight")}</span>
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-2xl">
              <SearchBar
                placeholder={t("searchPlaceholder")}
                size="lg"
                showButton={false}
              />
            </div>

            {/* Quick Stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-base">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</span>
                  <span className="text-zinc-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-16">
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
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {t("categoriesSection.title")}
              </h2>
            </div>
            <Button asChild variant="outline" className="border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white">
              <Link href="/search">
                <Filter className="mr-2 h-4 w-4" />
                {t("categoriesSection.advancedSearch")}
              </Link>
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
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
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-8 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="mb-5 inline-flex rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 p-3">
              <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {t("cta.title")}
            </h2>
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
