"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PlaceCard, EmptyState, PlacesMap, HeroBadge } from "@/components/shared";
import { places } from "@/data/places";
import { PlaceCategory } from "@/types";
import { MapPin, Search, Utensils, ArrowRight, Map, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function PlacesPage() {
  const t = useTranslations("places");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const categoryFilters: { key: PlaceCategory | null; label: string; icon: string }[] = [
    { key: null, label: t("filters.all"), icon: "🗺️" },
    { key: "restaurant", label: t("filters.restaurants"), icon: "🍽️" },
    { key: "cafe", label: t("filters.cafes"), icon: "☕" },
    { key: "butcher", label: t("filters.butchers"), icon: "🥩" },
    { key: "mosque", label: t("filters.mosques"), icon: "🕌" },
    { key: "study-spot", label: t("filters.studySpots"), icon: "📚" },
  ];

  const placesData = useTranslations("placesData");

  const filteredPlaces = useMemo(() => {
    let result = places;

    if (selectedCategory) {
      result = result.filter((place) => place.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.address.toLowerCase().includes(query) ||
          place.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          place.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  // Localize place names/descriptions using messages under the `placesData` namespace.
  const localizedPlaces = useMemo(() => {
    return filteredPlaces.map((p) => {
      const nameKey = `places.${p.slug}.name`;
      const descKey = `places.${p.slug}.description`;

      // useTranslations returns the key itself when missing, so fallback to original
      const translatedName = placesData(nameKey);
      const translatedDescription = p.description ? placesData(descKey) : undefined;

      return {
        ...p,
        name: translatedName === nameKey ? p.name : translatedName,
        description:
          translatedDescription && translatedDescription === descKey
            ? p.description
            : (translatedDescription ?? p.description),
      };
    });
  }, [filteredPlaces, placesData]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs - smaller on mobile */}
        <div className="absolute -left-16 sm:-left-32 top-0 z-[5] h-[200px] w-[200px] sm:h-[400px] sm:w-[400px] rounded-full bg-gradient-to-br from-orange-200/50 to-red-200/50 dark:from-orange-600/20 dark:to-red-600/20 blur-[60px] sm:blur-[100px]" />
        <div className="absolute -right-16 sm:-right-32 bottom-0 z-[5] h-[200px] w-[200px] sm:h-[400px] sm:w-[400px] rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-200/40 dark:from-emerald-500/15 dark:to-teal-500/15 blur-[60px] sm:blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <HeroBadge icon={MapPin} text={`${places.length}+ ${t("badge")}`} color="orange" />

            {/* Title */}
            <h1 className="mb-5 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {t("title")}{" "}
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 dark:from-orange-400 dark:via-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("subtitle")}
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-10 max-w-2xl">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 pl-14 text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-orange-500/20 shadow-sm dark:shadow-none"
              />
            </div>

            {/* Category filters - horizontal scroll on mobile */}
            <div className="mt-8 sm:mt-10 max-w-4xl overflow-x-auto pb-2 -mx-4 px-4 sm:mx-auto sm:px-0 sm:overflow-visible">
              <div className="flex items-center gap-2 sm:gap-3 sm:flex-wrap sm:justify-center min-w-max sm:min-w-0">
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.key || "all"}
                    onClick={() => setSelectedCategory(filter.key)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-all",
                      selectedCategory === filter.key
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
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
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results info & View Toggle */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="text-base font-bold text-zinc-900 dark:text-white">
              {filteredPlaces.length}
            </span>{" "}
            {filteredPlaces.length === 1 ? t("results.place") : t("results.places")}
            {selectedCategory && (
              <>
                {" "}
                {t("results.in")}{" "}
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {categoryFilters.find((c) => c.key === selectedCategory)?.label}
                </span>
              </>
            )}
            {searchQuery && (
              <>
                {" "}
                {t("results.matching")} &ldquo;
                <span className="font-medium text-zinc-900 dark:text-white">{searchQuery}</span>
                &rdquo;
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="mr-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 hover:underline"
              >
                {t("results.clearFilters")}
              </button>
            )}
            {/* View Toggle */}
            <div className="flex rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-1 shadow-sm dark:shadow-none">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  viewMode === "grid"
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                {t("viewMode.grid")}
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  viewMode === "map"
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <Map className="h-4 w-4" />
                {t("viewMode.map")}
              </button>
            </div>
          </div>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="mb-10">
            <PlacesMap places={filteredPlaces} className="h-[500px]" />
            <p className="mt-4 text-center text-sm text-zinc-500">{t("mapNote")}</p>
          </div>
        )}

        {/* Places grid */}
        {viewMode === "grid" &&
          (filteredPlaces.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {localizedPlaces.map((place) => (
                <PlaceCard key={place.slug} place={place} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="places"
              title={t("noResults")}
              description={t("noResultsDescription")}
            />
          ))}

        {/* Contribute CTA */}
        <div className="mt-12 sm:mt-20 rounded-3xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-6 sm:p-10 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
          <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-500/20 dark:to-red-500/20 p-4">
            <Utensils className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{t("cta.title")}</h3>
          <p className="mx-auto mt-3 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            {t("cta.description")}
          </p>
          <div className="mt-8">
            <Link
              href="https://github.com/HamzaChx/Atlas-Munich/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-8 py-4 text-base font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-orange-500 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400"
            >
              {t("cta.button")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
