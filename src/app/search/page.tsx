"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GuideCard, PlaceCard, FAQAccordion, EmptyState } from "@/components/shared";
import { searchGuides } from "@/data/guides";
import { places } from "@/data/places";
import { searchFaqs } from "@/data/faqs";
import { categories } from "@/data/categories";
import { Search, FileText, MapPin, HelpCircle, Tag } from "lucide-react";
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
      label: "All",
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Search
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Find guides, places, and answers across our entire knowledge base.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for guides, places, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full border-2 pl-12 pr-4 text-lg"
                autoFocus
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {searchQuery.trim() ? (
          <>
            {/* Tabs */}
            <div className="mb-8 flex flex-wrap items-center gap-2 border-b pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-1",
                      activeTab === tab.key && "bg-primary-foreground/20 text-primary-foreground"
                    )}
                  >
                    {tab.count}
                  </Badge>
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
              <div className="space-y-12">
                {/* Guides */}
                {(activeTab === "all" || activeTab === "guides") &&
                  searchResults.guides.length > 0 && (
                    <section>
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                          <FileText className="h-5 w-5" />
                          Guides
                          <Badge variant="secondary">{searchResults.guides.length}</Badge>
                        </h2>
                        {activeTab === "all" && searchResults.guides.length > 3 && (
                          <button
                            onClick={() => setActiveTab("guides")}
                            className="text-sm text-primary hover:underline"
                          >
                            View all →
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
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                          <MapPin className="h-5 w-5" />
                          Places
                          <Badge variant="secondary">{searchResults.places.length}</Badge>
                        </h2>
                        {activeTab === "all" && searchResults.places.length > 3 && (
                          <button
                            onClick={() => setActiveTab("places")}
                            className="text-sm text-primary hover:underline"
                          >
                            View all →
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
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                          <HelpCircle className="h-5 w-5" />
                          FAQs
                          <Badge variant="secondary">{searchResults.faqs.length}</Badge>
                        </h2>
                        {activeTab === "all" && searchResults.faqs.length > 5 && (
                          <button
                            onClick={() => setActiveTab("faqs")}
                            className="text-sm text-primary hover:underline"
                          >
                            View all →
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
          /* Empty state - show quick links */
          <div className="py-12 text-center">
            <Search className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-semibold">Start searching</h2>
            <p className="mt-2 text-muted-foreground">
              Enter a keyword to search across all guides, places, and FAQs.
            </p>

            {/* Quick links */}
            <div className="mx-auto mt-8 max-w-2xl">
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Popular categories
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.key}
                    href={`/category/${category.key}`}
                    className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <Tag className="h-3 w-3" />
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular searches */}
            <div className="mx-auto mt-8 max-w-2xl">
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Popular searches
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "apartment",
                  "Anmeldung",
                  "visa",
                  "halal restaurant",
                  "semester ticket",
                  "werkstudent",
                  "mosque",
                  "grocery",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="rounded-full border px-4 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    {term}
                  </button>
                ))}
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading search...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
