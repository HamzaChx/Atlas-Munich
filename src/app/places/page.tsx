"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlaceCard, EmptyState, PlacesMap, HeroBadge } from "@/components/shared";
import { places } from "@/data/places";
import { PlaceCategory } from "@/types";
import { MapPin, Search, Utensils, Info, ArrowRight, Map, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryFilters: { key: PlaceCategory | null; label: string; icon: string }[] = [
  { key: null, label: "All", icon: "🗺️" },
  { key: "restaurant", label: "Restaurants", icon: "🍽️" },
  { key: "butcher", label: "Butchers", icon: "🥩" },
  { key: "mosque", label: "Mosques", icon: "🕌" },
  { key: "study-spot", label: "Study Spots", icon: "📚" },
];

export default function PlacesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

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

  // Get featured places (halal restaurants)
  const featuredPlaces = places.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-orange-200/50 to-red-200/50 dark:from-orange-600/20 dark:to-red-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-200/40 dark:from-emerald-500/15 dark:to-teal-500/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <HeroBadge icon={MapPin} text={`${places.length}+ Verified Places`} color="orange" />

            {/* Title */}
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
              Places{" "}
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 dark:from-orange-400 dark:via-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Halal restaurants, Moroccan groceries, mosques, study spots, and more — all verified by our community.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-10 max-w-2xl">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search places by name, tag, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 pl-14 text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-orange-500/20 shadow-sm dark:shadow-none"
              />
            </div>

            {/* Category filters */}
            <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
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
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results info & View Toggle */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="text-base font-bold text-zinc-900 dark:text-white">{filteredPlaces.length}</span>{" "}
            {filteredPlaces.length === 1 ? "place" : "places"}
            {selectedCategory && (
              <> in <span className="font-medium text-orange-600 dark:text-orange-400">{categoryFilters.find((c) => c.key === selectedCategory)?.label}</span></>
            )}
            {searchQuery && <> matching &ldquo;<span className="font-medium text-zinc-900 dark:text-white">{searchQuery}</span>&rdquo;</>}
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
                Clear filters
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
                Grid
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
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="mb-10">
            <PlacesMap 
              places={filteredPlaces} 
              className="h-[500px]"
            />
            <p className="mt-4 text-center text-sm text-zinc-500">
              Click on markers to see details. Only places with coordinates are shown on the map.
            </p>
          </div>
        )}

        {/* Places grid */}
        {viewMode === "grid" && (
          filteredPlaces.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.slug} place={place} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="places"
              title="No places found"
              description="Try adjusting your search or filters."
            />
          )
        )}

        {/* Contribute CTA */}
        <div className="mt-20 rounded-3xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-10 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
          <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-500/20 dark:to-red-500/20 p-4">
            <Utensils className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Know a great place?</h3>
          <p className="mx-auto mt-3 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Help us grow our directory by suggesting new halal restaurants, groceries, or community spots.
          </p>
          <div className="mt-8">
            <Link
              href="https://github.com/HamzaChx/Atlas-Munich/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-8 py-4 text-base font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-orange-500 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400"
            >
              Suggest a place
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
