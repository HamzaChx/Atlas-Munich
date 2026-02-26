"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { FAQAccordion, EmptyState, HeroBadge } from "@/components/shared";
import { MoroccanCorner } from "@/components/home";
import { getAllFaqs } from "@/data/faqs";
import { categories } from "@/data/categories";
import { HelpCircle, Search, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function FAQPage() {
  const t = useTranslations("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allFaqs = getAllFaqs();

  const filteredFaqs = useMemo(() => {
    let result = allFaqs;

    if (selectedCategory) {
      result = result.filter((faq) => faq.categoryKey === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
      );
    }

    return result;
  }, [allFaqs, selectedCategory, searchQuery]);

  // Group FAQs by category
  const faqsByCategory = useMemo(() => {
    if (selectedCategory || searchQuery) {
      return null; // Show flat list when filtered
    }

    const grouped: Record<string, typeof allFaqs> = {};

    allFaqs.forEach((faq) => {
      const key = faq.categoryKey || "general";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(faq);
    });

    return grouped;
  }, [allFaqs, selectedCategory, searchQuery]);

  // Category filters with emojis matching the Places page pattern
  const categoryEmojis: Record<string, string> = {
    "rent-housing": "🏠",
    "kvr-residence": "📋",
    "university-life": "🎓",
    career: "💼",
    "useful-apps": "📱",
  };

  const categoryFilters = [
    { key: null, label: t("filters.all"), icon: "❓" },
    ...categories.map((c) => ({ key: c.key, label: c.title, icon: categoryEmojis[c.key] || "📌" })),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Subtle blue gradient orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-100/10 dark:from-blue-700/15 dark:to-indigo-600/5 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-100/10 dark:from-emerald-700/15 dark:to-teal-600/5 blur-[100px]" />

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
          <HeroBadge icon={HelpCircle} text={`${allFaqs.length}+ ${t("badge")}`} color="blue" />

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {t("subtitle")}
          </p>

          {/* Search */}
          <div className="relative mt-7 w-full sm:mt-8">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-full border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 pl-14 text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-blue-500/50 focus:ring-blue-500/20 shadow-sm dark:shadow-none"
            />
          </div>

          {/* Category filters */}
          <div className="mt-7 w-full overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible sm:mt-8">
            <div className="flex items-center gap-2 sm:gap-3 sm:flex-wrap sm:justify-center min-w-max sm:min-w-0">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.key || "all"}
                  onClick={() => setSelectedCategory(filter.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                    selectedCategory === filter.key
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                      : "border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative">
        {/* Blue separator line */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />

        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        {filteredFaqs.length > 0 ? (
          <>
            {/* Filtered/Searched view */}
            {selectedCategory || searchQuery ? (
              <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 p-6 shadow-sm dark:shadow-none backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="text-base font-bold text-zinc-900 dark:text-white">
                      {filteredFaqs.length}
                    </span>{" "}
                    {filteredFaqs.length === 1 ? t("results.result") : t("results.results")}
                    {searchQuery && (
                      <span className="text-zinc-500">
                        {" "}
                        {t("results.for")} &ldquo;{searchQuery}&rdquo;
                      </span>
                    )}
                  </p>
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery("");
                      }}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline"
                    >
                      {t("results.clearFilters")}
                    </button>
                  )}
                </div>
                <FAQAccordion faqs={filteredFaqs} />
              </div>
            ) : (
              /* Grouped by category view */
              <div className="space-y-10">
                {faqsByCategory &&
                  Object.entries(faqsByCategory).map(([categoryKey, categoryFaqs]) => {
                    const category = categories.find((c) => c.key === categoryKey);
                    const title = category?.title || "General Questions";
                    const emoji = categoryEmojis[categoryKey] || "📌";

                    return (
                      <section key={categoryKey}>
                        <h2 className="mb-5 flex items-center gap-2.5 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                          <span>{emoji}</span>
                          {title}
                        </h2>
                        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6 shadow-sm dark:shadow-none backdrop-blur-sm">
                          <FAQAccordion faqs={categoryFaqs} />
                        </div>
                      </section>
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            type="search"
            title="No questions found"
            description="Try adjusting your search or browse all categories."
            action={{ label: "Clear search", href: "/faq" }}
          />
        )}

        {/* CTA */}
        <div className="mt-10 sm:mt-16 rounded-2xl border border-blue-200/40 dark:border-white/10 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-5 sm:p-8 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("cta.title")}</h3>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-400">
            {t("cta.description")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guides"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-indigo-600 shadow-md shadow-blue-500/25"
            >
              {t("cta.browseGuides")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t("cta.contactUs")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
