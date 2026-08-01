"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { PlacesBrowser, EmptyState, PlacesMap } from "@/components/shared";
import { placeAccents } from "@/components/shared/place-accents";

import { places } from "@/data/places";
import { PlaceCategory, PriceLevel } from "@/types";
import {
  Search,
  ArrowRight,
  Map,
  Columns2,
  X,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const PRICE_LEVELS: PriceLevel[] = ["€", "€€", "€€€"];

// Cuisine tags found on restaurant entries, used to power the cuisine filter
const CUISINE_TAGS = [
  "turkish",
  "arabic",
  "lebanese",
  "persian",
  "moroccan",
  "indian",
  "italian",
  "afghan",
  "uyghur",
  "pakistani",
  "kurdish",
  "iraqi",
  "balkan",
  "mediterranean",
  "asian",
  "american",
  "uzbek",
] as const;
type CuisineTag = (typeof CUISINE_TAGS)[number];

interface FiltersPopoverProps {
  price: PriceLevel | null;
  onPriceChange: (value: PriceLevel | null) => void;
  district: string | null;
  onDistrictChange: (value: string | null) => void;
  districts: string[];
  cuisine: CuisineTag | null;
  onCuisineChange: (value: CuisineTag | null) => void;
  cuisines: CuisineTag[];
  activeCount: number;
}

/** Price, district, and cuisine filters, tucked behind one button so
    the sticky toolbar doesn't turn into a wall of pills. */
function FiltersPopover({
  price,
  onPriceChange,
  district,
  onDistrictChange,
  districts,
  cuisine,
  onCuisineChange,
  cuisines,
  activeCount,
}: FiltersPopoverProps) {
  const t = useTranslations("places");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-sm transition-all",
          activeCount > 0
            ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
            : "bg-card text-zinc-500 hover:text-zinc-900 dark:bg-foreground/[0.075] dark:text-zinc-400 dark:shadow-none dark:hover:text-zinc-50"
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {t("advancedFilters.button")}
        {activeCount > 0 && (
          <span
            className={cn(
              "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] tabular-nums",
              "bg-white/20 dark:bg-zinc-900/15"
            )}
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-40 w-72 rounded-2xl bg-card p-4 shadow-[0_12px_40px_rgb(0_0_0/0.14)] ring-1 ring-zinc-900/[0.05] dark:ring-border">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              {t("advancedFilters.price")}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {PRICE_LEVELS.map((level) => {
                const active = price === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onPriceChange(active ? null : level)}
                    className={cn(
                      "flex-1 rounded-lg py-1.5 text-[13px] font-semibold transition-colors",
                      active
                        ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-foreground/[0.09] dark:text-zinc-400 dark:hover:bg-foreground/[0.14]"
                    )}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              {t("advancedFilters.district")}
            </p>
            <div className="relative mt-2">
              <select
                value={district ?? ""}
                onChange={(e) => onDistrictChange(e.target.value || null)}
                className="h-9 w-full appearance-none rounded-lg bg-zinc-100 pl-3 pr-8 text-[13px] font-semibold text-zinc-700 outline-none transition-colors hover:bg-zinc-200 dark:bg-foreground/[0.09] dark:text-zinc-200 dark:hover:bg-foreground/[0.14]"
              >
                <option value="">{t("advancedFilters.allDistricts")}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              {t("advancedFilters.cuisine")}
            </p>
            <div className="relative mt-2">
              <select
                value={cuisine ?? ""}
                onChange={(e) => onCuisineChange((e.target.value || null) as CuisineTag | null)}
                className="h-9 w-full appearance-none rounded-lg bg-zinc-100 pl-3 pr-8 text-[13px] font-semibold text-zinc-700 outline-none transition-colors hover:bg-zinc-200 dark:bg-foreground/[0.09] dark:text-zinc-200 dark:hover:bg-foreground/[0.14]"
              >
                <option value="">{t("advancedFilters.allCuisines")}</option>
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {t(`cuisines.${c}`)}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                onPriceChange(null);
                onDistrictChange(null);
                onCuisineChange(null);
              }}
              className="mt-4 w-full text-center text-[13px] font-semibold text-zellige hover:underline"
            >
              {t("advancedFilters.clear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlacesPage() {
  const t = useTranslations("places");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceLevel | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string | null>(null);
  const [cuisineFilter, setCuisineFilter] = useState<CuisineTag | null>(null);
  /* The map is the page's front door: pins answer "what is near me?" faster
     than any list can. The browse view is one tap away. */
  const [viewMode, setViewMode] = useState<"browse" | "map">("map");

  const filterMeta: { key: PlaceCategory; label: string }[] = [
    { key: "restaurant", label: t("filters.restaurants") },
    { key: "cafe", label: t("filters.cafes") },
    { key: "grocery", label: t("filters.groceries") },
    { key: "bakery", label: t("filters.bakeries") },
    { key: "butcher", label: t("filters.butchers") },
    { key: "mosque", label: t("filters.mosques") },
    { key: "study-spot", label: t("filters.studySpots") },
    { key: "cowork", label: t("filters.coworking") },
    { key: "barber", label: t("filters.barbers") },
  ];

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    places.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  // Only offer filters for categories that actually have places
  const categoryFilters = filterMeta.filter((f) => (countByCategory[f.key] ?? 0) > 0);

  // Every district that appears in the data, alphabetized for the dropdown
  const districts = useMemo(() => {
    const unique = new Set(places.map((p) => p.district).filter((d): d is string => Boolean(d)));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  // Localized category names for the map legend and marker popups
  const categoryLabelMap = useMemo(
    () => Object.fromEntries(filterMeta.map((f) => [f.key, f.label])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const placesData = useTranslations("placesData");

  // Only offer cuisines that actually appear on a restaurant in the data
  const cuisines = useMemo(() => {
    const present = new Set<CuisineTag>();
    places.forEach((p) => {
      if (p.category !== "restaurant") return;
      p.tags.forEach((tag) => {
        if ((CUISINE_TAGS as readonly string[]).includes(tag)) present.add(tag as CuisineTag);
      });
    });
    return CUISINE_TAGS.filter((c) => present.has(c));
  }, []);

  const filteredPlaces = useMemo(() => {
    let result = places;

    if (selectedCategory) {
      result = result.filter((place) => place.category === selectedCategory);
    }

    if (priceFilter) {
      result = result.filter((place) => place.price === priceFilter);
    }

    if (districtFilter) {
      result = result.filter((place) => place.district === districtFilter);
    }

    if (cuisineFilter) {
      result = result.filter(
        (place) => place.category === "restaurant" && place.tags.includes(cuisineFilter)
      );
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
  }, [selectedCategory, priceFilter, districtFilter, cuisineFilter, searchQuery]);

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

  const activeFilterCount = [priceFilter, districtFilter, cuisineFilter].filter(Boolean).length;
  const isFiltering = Boolean(selectedCategory || searchQuery.trim() || activeFilterCount > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-10 sm:pt-20 2xl:max-w-3xl">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>
        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}
        </p>
      </section>

      {/* ========== STICKY FILTER TOOLBAR ========== */}
      <div className="rise rise-3 sticky top-14 z-30 bg-background pb-3 pt-3 shadow-[0_12px_16px_-12px_rgb(0_0_0/0.06)] sm:top-16">
        <div className="mx-auto flex max-w-7xl 2xl:max-w-[96rem] flex-col gap-3 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8 2xl:px-12">
          {/* Search */}
          <div className="relative lg:w-72 lg:shrink-0">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-full bg-card pl-11 pr-10 text-sm text-zinc-900 shadow-sm outline-none transition-shadow placeholder:text-zinc-400 focus:ring-2 focus:ring-zellige/40 dark:bg-foreground/[0.075] dark:text-zinc-50 dark:shadow-none dark:placeholder:text-zinc-500 dark:ring-1 dark:ring-border dark:focus:ring-zellige/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label={t("results.clearFilters")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Advanced filters */}
          <div className="flex shrink-0 items-center gap-2">
            <FiltersPopover
              price={priceFilter}
              onPriceChange={setPriceFilter}
              district={districtFilter}
              onDistrictChange={setDistrictFilter}
              districts={districts}
              cuisine={cuisineFilter}
              onCuisineChange={setCuisineFilter}
              cuisines={cuisines}
              activeCount={activeFilterCount}
            />
          </div>

          {/* Category pills with live counts */}
          <div className="-mx-4 flex-1 overflow-x-auto px-4 hide-scrollbar-mobile sm:mx-0 sm:px-0 lg:min-w-0 lg:overflow-visible">
            <div className="flex min-w-max items-center gap-1.5 lg:min-w-0 lg:flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200",
                  selectedCategory === null
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "text-zinc-500 hover:bg-card hover:text-zinc-900 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-foreground/[0.075] dark:hover:text-zinc-50"
                )}
              >
                {t("filters.all")}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    selectedCategory === null
                      ? "text-white/60 dark:text-zinc-900/60"
                      : "text-zinc-400 dark:text-zinc-500"
                  )}
                >
                  {places.length}
                </span>
              </button>

              {categoryFilters.map((filter) => {
                const active = selectedCategory === filter.key;
                const accent = placeAccents[filter.key];
                return (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedCategory(active ? null : filter.key)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200",
                      active
                        ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                        : "text-zinc-500 hover:bg-card hover:text-zinc-900 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-foreground/[0.075] dark:hover:text-zinc-50"
                    )}
                  >
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", accent?.dot)}
                      aria-hidden="true"
                    />
                    {filter.label}
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        active
                          ? "text-white/60 dark:text-zinc-900/60"
                          : "text-zinc-400 dark:text-zinc-500"
                      )}
                    >
                      {countByCategory[filter.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex shrink-0 items-center justify-between gap-2 lg:justify-end">
            {isFiltering && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                  setPriceFilter(null);
                  setDistrictFilter(null);
                  setCuisineFilter(null);
                }}
                className="text-[13px] font-semibold text-zellige hover:underline"
              >
                {t("results.clearFilters")}
              </button>
            )}
            {/* Map leads, since it is what the page opens on */}
            <div className="flex rounded-full bg-card p-1 shadow-sm dark:bg-foreground/[0.075] dark:shadow-none">
              <button
                onClick={() => setViewMode("map")}
                aria-pressed={viewMode === "map"}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-all",
                  viewMode === "map"
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                )}
              >
                <Map className="h-3.5 w-3.5" />
                {t("viewMode.map")}
              </button>
              <button
                onClick={() => setViewMode("browse")}
                aria-pressed={viewMode === "browse"}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-all",
                  viewMode === "browse"
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                )}
              >
                <Columns2 className="h-3.5 w-3.5" />
                {t("viewMode.browse")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== DIRECTORY ========== */}
      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 pt-8 sm:px-6 sm:pb-24 lg:px-8 2xl:px-12">
        {/* Map view */}
        {viewMode === "map" && (
          <PlacesMap places={localizedPlaces} categoryLabels={categoryLabelMap} />
        )}

        {/* Browse view: index on the left, the selected place shown large */}
        {viewMode === "browse" &&
          (localizedPlaces.length > 0 ? (
            <>
              {isFiltering && (
                <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {filteredPlaces.length}
                  </span>{" "}
                  {filteredPlaces.length === 1 ? t("results.place") : t("results.places")}
                  {selectedCategory && (
                    <>
                      {" "}
                      {t("results.in")}{" "}
                      <span className="font-medium text-zellige">
                        {categoryFilters.find((c) => c.key === selectedCategory)?.label}
                      </span>
                    </>
                  )}
                  {searchQuery && (
                    <>
                      {" "}
                      {t("results.matching")} &ldquo;
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {searchQuery}
                      </span>
                      &rdquo;
                    </>
                  )}
                </p>
              )}
              <PlacesBrowser places={localizedPlaces} categories={categoryFilters} />
            </>
          ) : (
            <EmptyState
              type="places"
              title={t("noResults")}
              description={t("noResultsDescription")}
            />
          ))}

        {/* Contribute CTA */}
        <div className="reveal mt-16 rounded-[2rem] bg-tint-terra p-8 text-center sm:mt-24 sm:p-12 dark:ring-1 dark:ring-border">
          <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t("cta.title")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-300">
            {t("cta.description")}
          </p>
          <div className="mt-7">
            <Link
              href="https://github.com/HamzaChx/Atlas-Munich/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              {t("cta.button")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
