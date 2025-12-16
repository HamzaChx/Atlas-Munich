"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PlaceCard, EmptyState, PlacesMap } from "@/components/shared";
import { places } from "@/data/places";
import { PlaceCategory } from "@/types";
import { MapPin, Search, Utensils, Info, ArrowRight, Map, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryFilters: { key: PlaceCategory | null; label: string; icon: string }[] = [
  { key: null, label: "All", icon: "🗺️" },
  { key: "restaurant", label: "Restaurants", icon: "🍽️" },
  { key: "grocery", label: "Groceries", icon: "🛒" },
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
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="moroccan-places" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="30" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.8"/>
                <path d="M30 20L40 30L30 40L20 30Z" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#moroccan-places)"/>
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-orange-600/20 to-red-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-zinc-300">{places.length}+ Verified Places</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Places{" "}
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-rose-400 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Halal restaurants, Moroccan groceries, mosques, study spots, and more — all verified by our community.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-10 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search places by name, tag, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full border-white/10 bg-white/5 pl-12 text-base text-white placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-orange-500/20"
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
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
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

      {/* Mensa Info Banner */}
      <section className="border-b border-white/5 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Info className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">University Mensa Info</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Munich&apos;s university cafeterias (TUM, LMU, etc.) currently <span className="text-amber-400">do not offer certified halal options</span>. 
                However, they provide daily <span className="text-emerald-400">vegan meals</span> and at least one <span className="text-blue-400">fish dish per week</span>. 
                These meals are clearly labeled in the menus, making it easier for Muslim students to choose suitable options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results info & View Toggle */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            <span className="font-semibold text-white">{filteredPlaces.length}</span>{" "}
            {filteredPlaces.length === 1 ? "place" : "places"}
            {selectedCategory && (
              <> in <span className="text-orange-400">{categoryFilters.find((c) => c.key === selectedCategory)?.label}</span></>
            )}
            {searchQuery && <> matching &ldquo;<span className="text-white">{searchQuery}</span>&rdquo;</>}
          </p>
          <div className="flex items-center gap-2">
            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="mr-2 text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Clear filters
              </button>
            )}
            {/* View Toggle */}
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  viewMode === "grid"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-zinc-400 hover:text-white"
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
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-zinc-400 hover:text-white"
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
          <div className="mb-8">
            <PlacesMap 
              places={filteredPlaces} 
              className="h-[500px]"
            />
            <p className="mt-3 text-center text-xs text-zinc-500">
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
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-900 p-8 text-center backdrop-blur-sm">
          <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 p-3">
            <Utensils className="h-6 w-6 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Know a great place?</h3>
          <p className="mt-2 text-zinc-400">
            Help us grow our directory by suggesting new halal restaurants, groceries, or community spots.
          </p>
          <div className="mt-6">
            <Link
              href="https://github.com/HamzaChx/Atlas-Munich/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
            >
              Suggest a place
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
