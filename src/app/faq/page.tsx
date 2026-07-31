"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { FAQAccordion, EmptyState } from "@/components/shared";

import { getAllFaqs } from "@/data/faqs";
import { categories } from "@/data/categories";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/* One hue per category, matching the landing page */
const categoryTints: Record<string, { panel: string; dot: string }> = {
  "rent-housing": { panel: "bg-tint-terra", dot: "bg-acc-terra" },
  "kvr-residence": { panel: "bg-tint-blue", dot: "bg-acc-blue" },
  "university-life": { panel: "bg-tint-green", dot: "bg-acc-green" },
  career: { panel: "bg-tint-plum", dot: "bg-acc-plum" },
  "useful-apps": { panel: "bg-tint-saffron", dot: "bg-acc-saffron" },
  general: { panel: "bg-card", dot: "bg-zellige" },
};

export default function FAQPage() {
  const t = useTranslations("faq");
  const tc = useTranslations("categories");
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

  const categoryEmojis: Record<string, string> = {
    "rent-housing": "🔑",
    "kvr-residence": "📋",
    "university-life": "🎓",
    career: "💼",
    "useful-apps": "📱",
  };

  const categoryFilters = [
    { key: null, label: t("filters.all"), icon: "💬" },
    ...categories.map((c) => ({
      key: c.key,
      label: tc(`${c.key}.title`),
      icon: categoryEmojis[c.key] || "📌",
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {t("subtitle")}
        </p>

        {/* Search */}
        <div className="rise rise-3 relative mt-8 w-full">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-13 rounded-full border-border bg-card pl-13 text-base text-zinc-900 shadow-[0_6px_24px_rgb(0_0_0/0.08)] placeholder:text-zinc-400 focus:border-zellige/50 focus:ring-zellige/20 dark:bg-white/5 dark:text-white dark:shadow-none dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Category filters */}
        <div className="rise rise-4 -mx-5 mt-6 w-full overflow-x-auto px-5 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex min-w-max items-center gap-2 sm:min-w-0 sm:flex-wrap sm:justify-center">
            {categoryFilters.map((filter) => (
              <button
                key={filter.key || "all"}
                onClick={() => setSelectedCategory(filter.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200",
                  selectedCategory === filter.key
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-card text-zinc-600 shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:text-zinc-300 dark:shadow-none dark:hover:bg-white/10"
                )}
              >
                <span>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== QUESTIONS ========== */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        {filteredFaqs.length > 0 ? (
          <>
            {/* Filtered/Searched view */}
            {selectedCategory || searchQuery ? (
              <div className="rounded-3xl bg-card p-6 shadow-[0_2px_20px_rgb(0_0_0/0.06)] sm:p-8 dark:shadow-none dark:ring-1 dark:ring-white/10">
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
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery("");
                    }}
                    className="text-sm font-medium text-zellige hover:underline hover:opacity-80"
                  >
                    {t("results.clearFilters")}
                  </button>
                </div>
                <FAQAccordion faqs={filteredFaqs} />
              </div>
            ) : (
              /* Grouped by category view, each group on its own tinted panel */
              <div className="space-y-8">
                {faqsByCategory &&
                  Object.entries(faqsByCategory).map(([categoryKey, categoryFaqs]) => {
                    const category = categories.find((c) => c.key === categoryKey);
                    const title = category ? tc(`${categoryKey}.title`) : "General Questions";
                    const tint = categoryTints[categoryKey] ?? categoryTints.general;

                    return (
                      <section key={categoryKey} className="reveal">
                        <h2 className="mb-4 flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                          <span
                            className={cn("h-2.5 w-2.5 rounded-full", tint.dot)}
                            aria-hidden="true"
                          />
                          {title}
                          <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                            {categoryFaqs.length}
                          </span>
                        </h2>
                        <div
                          className={cn(
                            "rounded-3xl p-5 sm:p-6 dark:ring-1 dark:ring-white/10",
                            tint.panel
                          )}
                        >
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
            title={t("noResults")}
            description={t("noResultsDescription")}
            action={{ label: t("results.clearFilters"), href: "/faq" }}
          />
        )}

        {/* CTA */}
        <div className="reveal mt-14 rounded-[2rem] bg-tint-green p-8 text-center sm:mt-20 sm:p-10 dark:ring-1 dark:ring-white/10">
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
            {t("cta.title")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-300">
            {t("cta.description")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guides"
              className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              {t("cta.browseGuides")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about#contact"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {t("cta.contactUs")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
