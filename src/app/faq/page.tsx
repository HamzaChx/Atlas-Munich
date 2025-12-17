"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FAQAccordion, EmptyState } from "@/components/shared";
import { getAllFaqs } from "@/data/faqs";
import { categories } from "@/data/categories";
import { HelpCircle, Search, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQPage() {
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
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
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
    "halal-food": "🍽️",
    "career": "💼",
    "useful-apps": "📱",
  };

  const categoryFilters = [
    { key: null, label: "All", icon: "❓" },
    ...categories.map((c) => ({ key: c.key, label: c.title, icon: categoryEmojis[c.key] || "📌" })),
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2">
              <HelpCircle className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">{allFaqs.length}+ Questions Answered</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Quick answers to common questions about living in Munich as a Moroccan student or professional.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-full border-white/10 bg-white/5 pl-12 text-base text-white placeholder:text-zinc-500 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>

            {/* Category filters */}
            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.key || "all"}
                  onClick={() => setSelectedCategory(filter.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                    selectedCategory === filter.key
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                      : "border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
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
      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {filteredFaqs.length > 0 ? (
          <>
            {/* Filtered/Searched view */}
            {(selectedCategory || searchQuery) ? (
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-zinc-400">
                    <span className="text-base font-bold text-white">{filteredFaqs.length}</span> {filteredFaqs.length === 1 ? "result" : "results"}
                    {searchQuery && <span className="text-zinc-500"> for &ldquo;{searchQuery}&rdquo;</span>}
                  </p>
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery("");
                      }}
                      className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                <FAQAccordion faqs={filteredFaqs} />
              </div>
            ) : (
              /* Grouped by category view */
              <div className="space-y-10">
                {faqsByCategory && Object.entries(faqsByCategory).map(([categoryKey, categoryFaqs]) => {
                  const category = categories.find((c) => c.key === categoryKey);
                  const title = category?.title || "General Questions";
                  const emoji = categoryEmojis[categoryKey] || "📌";

                  return (
                    <section key={categoryKey}>
                      <h2 className="mb-5 flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
                        <span>{emoji}</span>
                        {title}
                      </h2>
                      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
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
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-900 p-8 text-center backdrop-blur-sm">
          <div className="mb-5 inline-flex rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-3">
            <Sparkles className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Can&apos;t find what you&apos;re looking for?</h3>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-400">
            Check our detailed guides or reach out to the community.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guides"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              Browse Guides
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
