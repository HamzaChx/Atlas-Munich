"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GuideCard, PlaceCard, FAQAccordion, EmptyState, HeroBadge } from "@/components/shared";
import { searchGuides } from "@/data/guides";
import { places } from "@/data/places";
import { searchFaqs } from "@/data/faqs";
import { categories } from "@/data/categories";
import { Search, FileText, MapPin, HelpCircle, Tag, Sparkles, ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SearchTab = "all" | "guides" | "places" | "faqs";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      router.replace(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
    }
  }, [searchQuery, router]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { guides: [], places: [], faqs: [] };
    }

    const query = searchQuery.toLowerCase();

    return {
      guides: searchGuides(query),
      places: places.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.address.toLowerCase().includes(query) ||
          place.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          place.description?.toLowerCase().includes(query)
      ),
      faqs: searchFaqs(query),
    };
  }, [searchQuery]);

  const totalResults =
    searchResults.guides.length +
    searchResults.places.length +
    searchResults.faqs.length;

  const tabs: { key: SearchTab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      key: "all",
      label: "All Results",
      count: totalResults,
      icon: <Search className="h-4 w-4" />,
    },
    {
      key: "guides",
      label: "Guides",
      count: searchResults.guides.length,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: "places",
      label: "Places",
      count: searchResults.places.length,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      key: "faqs",
      label: "FAQs",
      count: searchResults.faqs.length,
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ];

  // Popular search terms
  const popularSearches = [
    "apartment",
    "Anmeldung",
    "visa",
    "halal restaurant",
    "semester ticket",
    "werkstudent",
    "mosque",
    "grocery",
  ];

  // Category icons
  const categoryIcons: Record<string, string> = {
    "rent-housing": "🏠",
    "kvr-residence": "📋",
    "university-life": "🎓",
    "halal-food": "🍽️",
    "career": "💼",
    "useful-apps": "📱",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/50 to-pink-200/50 dark:from-purple-600/20 dark:to-pink-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/40 dark:from-cyan-500/15 dark:to-blue-600/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <HeroBadge icon={Search} text="Search Everything" color="purple" />

            {/* Title */}
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
              Find What You{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                Need
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Search across guides, places, and FAQs — your complete Munich knowledge base at your fingertips.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-10 max-w-2xl">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search for guides, places, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 pl-14 text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20 shadow-sm dark:shadow-none"
                autoFocus
              />
            </div>

            {/* Quick Stats */}
            {searchQuery.trim() && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-base">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalResults}</span>
                  <span className="text-zinc-500">Results found</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {searchQuery.trim() ? (
          <>
            {/* Tabs */}
            <div className="mb-10 flex flex-wrap items-center gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-all",
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                      : "border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={cn(
                      "ml-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-zinc-400"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Results */}
            {totalResults === 0 ? (
              <EmptyState
                type="search"
                title="No results found"
                description={`We couldn't find anything matching "${searchQuery}". Try different keywords.`}
              />
            ) : (
              <div className="space-y-16">
                {/* Guides */}
                {(activeTab === "all" || activeTab === "guides") &&
                  searchResults.guides.length > 0 && (
                    <section>
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/10 p-2.5">
                            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Guides</h2>
                            <p className="text-sm text-zinc-500">{searchResults.guides.length} results found</p>
                          </div>
                        </div>
                        {activeTab === "all" && searchResults.guides.length > 3 && (
                          <button
                            onClick={() => setActiveTab("guides")}
                            className="group flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-500 dark:hover:text-emerald-300"
                          >
                            View all
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {(activeTab === "all"
                          ? searchResults.guides.slice(0, 3)
                          : searchResults.guides
                        ).map((guide) => (
                          <GuideCard key={guide.slug} guide={guide} />
                        ))}
                      </div>
                    </section>
                  )}

                {/* Places */}
                {(activeTab === "all" || activeTab === "places") &&
                  searchResults.places.length > 0 && (
                    <section>
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-orange-100 dark:bg-orange-500/10 p-2.5">
                            <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Places</h2>
                            <p className="text-sm text-zinc-500">{searchResults.places.length} results found</p>
                          </div>
                        </div>
                        {activeTab === "all" && searchResults.places.length > 3 && (
                          <button
                            onClick={() => setActiveTab("places")}
                            className="group flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 transition-colors hover:text-orange-500 dark:hover:text-orange-300"
                          >
                            View all
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {(activeTab === "all"
                          ? searchResults.places.slice(0, 3)
                          : searchResults.places
                        ).map((place) => (
                          <PlaceCard key={place.slug} place={place} />
                        ))}
                      </div>
                    </section>
                  )}

                {/* FAQs */}
                {(activeTab === "all" || activeTab === "faqs") &&
                  searchResults.faqs.length > 0 && (
                    <section>
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-100 dark:bg-blue-500/10 p-2.5">
                            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">FAQs</h2>
                            <p className="text-sm text-zinc-500">{searchResults.faqs.length} results found</p>
                          </div>
                        </div>
                        {activeTab === "all" && searchResults.faqs.length > 5 && (
                          <button
                            onClick={() => setActiveTab("faqs")}
                            className="group flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-500 dark:hover:text-blue-300"
                          >
                            View all
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        )}
                      </div>
                      <div className="max-w-3xl">
                        <FAQAccordion
                          faqs={
                            activeTab === "all"
                              ? searchResults.faqs.slice(0, 5)
                              : searchResults.faqs
                          }
                        />
                      </div>
                    </section>
                  )}
              </div>
            )}
          </>
        ) : (
          /* Empty state - show discovery */
          <div className="py-8">
            {/* Empty state header */}
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/10 dark:to-pink-500/10 p-4">
                <Compass className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Discover Content</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Start typing above or explore our popular categories and searches below.
              </p>
            </div>

            {/* Popular Categories */}
            <div className="mx-auto mb-12 max-w-4xl">
              <h3 className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                <Tag className="h-4 w-4" />
                Browse Categories
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.key}
                    href={`/category/${category.key}`}
                    className="group flex items-center gap-2.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-2.5 text-base font-medium text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none transition-all hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <span>{categoryIcons[category.key] || "📌"}</span>
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular searches */}
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                <Sparkles className="h-4 w-4" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-2.5 text-base font-medium text-zinc-600 dark:text-zinc-400 shadow-sm dark:shadow-none transition-all hover:border-pink-300 dark:hover:border-pink-500/50 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="mx-auto mt-16 max-w-4xl">
              <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/80 dark:to-zinc-900/50 p-8 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
                <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 p-3">
                  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Looking for something specific?</h3>
                <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-400">
                  Browse our curated guides or check out the community-verified places directory.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/guides"
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600"
                  >
                    Browse Guides
                  </Link>
                  <Link
                    href="/places"
                    className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none transition-all hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Explore Places
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-zinc-500 dark:text-zinc-400">Loading search...</span>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
