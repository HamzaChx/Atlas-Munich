"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { GuideCard, PlaceCard, FAQAccordion, HeroBadge } from "@/components/shared";
import { searchGuides } from "@/data/guides";
import { places } from "@/data/places";
import { searchFaqs } from "@/data/faqs";
import { categories } from "@/data/categories";
import { Search, FileText, MapPin, HelpCircle, Tag, Sparkles, ArrowRight, Compass, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

type SearchTab = "all" | "guides" | "places" | "faqs";

function SearchContent() {
  const t = useTranslations("search");
  const tCat = useTranslations("categories");
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search with loading state
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        router.replace(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
        setIsSearching(false);
      }, 300); // Rule 35: Fast animations 150-300ms
      return () => clearTimeout(timer);
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
      label: t("tabs.all"),
      count: totalResults,
      icon: <Search className="h-4 w-4" />,
    },
    {
      key: "guides",
      label: t("tabs.guides"),
      count: searchResults.guides.length,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: "places",
      label: t("tabs.places"),
      count: searchResults.places.length,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      key: "faqs",
      label: t("tabs.faqs"),
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
      {/* Hero Section - Purple/Indigo Theme */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs - Matching other pages style */}
        <div className="absolute -left-32 top-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/50 to-indigo-200/50 dark:from-purple-600/20 dark:to-indigo-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-pink-200/40 to-rose-200/40 dark:from-pink-500/15 dark:to-rose-500/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <HeroBadge icon={Search} text={t("badge")} color="purple" />

            {/* Title */}
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
              {t("title")}{" "}
              <span className="mt-2 inline-block bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>
            {/* Subtitle */}
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("subtitle")}
            </p>

            {/* Search Input */}
            <div className="relative mx-auto mt-10 max-w-2xl">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              {isSearching && (
                <Loader2 className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-purple-500" />
              )}
              <Input
                type="search"
                placeholder={t("placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 pl-14 pr-14 text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20 shadow-sm dark:shadow-none transition-all duration-200"
                autoFocus
              />
            </div>

            {/* Results count */}
            {searchQuery.trim() && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-base">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalResults}</span>
                  <span className="text-zinc-500">{t("resultsFound")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {searchQuery.trim() ? (
          <div className="space-y-12">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200",
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                      : "border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={cn(
                      "ml-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Results */}
            {totalResults === 0 ? (
              <div className="mx-auto max-w-md py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-500/10">
                  <Search className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t("noResults")}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {t("noResultsDescription")} "{searchQuery}". {t("tryDifferent")}
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {/* Guides Section */}
                {(activeTab === "all" || activeTab === "guides") &&
                  searchResults.guides.length > 0 && (
                    <section>
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/10 p-2.5">
                            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("tabs.guides")}</h2>
                            <p className="text-sm text-zinc-500">{searchResults.guides.length} {t("sections.guidesFound")}</p>
                          </div>
                        </div>
                        {activeTab === "all" && searchResults.guides.length > 3 && (
                          <button
                            onClick={() => setActiveTab("guides")}
                            className="group flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors duration-200 hover:text-emerald-500"
                          >
                            {t("sections.viewAll")}
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
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

                {/* Places Section */}
                {(activeTab === "all" || activeTab === "places") &&
                  searchResults.places.length > 0 && (
                    <section>
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-orange-100 dark:bg-orange-500/10 p-2.5">
                            <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("tabs.places")}</h2>
                            <p className="text-sm text-zinc-500">{searchResults.places.length} {t("sections.placesFound")}</p>
                          </div>
                        </div>
                        {activeTab === "all" && searchResults.places.length > 3 && (
                          <button
                            onClick={() => setActiveTab("places")}
                            className="group flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 transition-colors duration-200 hover:text-orange-500"
                          >
                            {t("sections.viewAll")}
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
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

                {/* FAQs Section */}
                {(activeTab === "all" || activeTab === "faqs") &&
                  searchResults.faqs.length > 0 && (
                    <section>
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-100 dark:bg-blue-500/10 p-2.5">
                            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("tabs.faqs")}</h2>
                            <p className="text-sm text-zinc-500">{searchResults.faqs.length} {t("sections.faqsFound")}</p>
                          </div>
                        </div>
                        {activeTab === "all" && searchResults.faqs.length > 5 && (
                          <button
                            onClick={() => setActiveTab("faqs")}
                            className="group flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors duration-200 hover:text-blue-500"
                          >
                            {t("sections.viewAll")}
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </button>
                        )}
                      </div>
                      <div className="mx-auto max-w-3xl">
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
          </div>
        ) : (
          // Discovery Section
          <div className="py-8">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/10 dark:to-indigo-500/10 p-4">
                <Compass className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t("discover.title")}</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {t("discover.subtitle")}
              </p>
            </div>

            {/* Categories */}
            <div className="mx-auto mb-12 max-w-4xl">
              <h3 className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                <Tag className="h-4 w-4" />
                {t("discover.browseCategories")}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.key}
                    href={`/category/${category.key}`}
                    className="group flex items-center gap-2.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    <span className="text-base">{category.icon}</span>
                    {tCat(`${category.key}.title`)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                <Sparkles className="h-4 w-4" />
                {t("discover.popularSearches")}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 shadow-sm dark:shadow-none transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="mx-auto mt-16 max-w-4xl">
              <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/80 dark:to-zinc-900/50 p-8 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
                <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 p-3">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t("discover.lookingFor")}</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
                  {t("discover.lookingForDesc")}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/guides"
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:from-purple-500 hover:to-indigo-500"
                  >
                    {t("discover.browseGuides")}
                  </Link>
                  <Link
                    href="/places"
                    className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    {t("discover.explorePlaces")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading search...</span>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
