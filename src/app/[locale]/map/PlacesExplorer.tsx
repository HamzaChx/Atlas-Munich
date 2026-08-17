"use client";

// ============================================
// Atlas Munich – places explorer
//
// The interactive half of /map: filters, the view toggle, the map and the
// browse grid. Places arrive already localized from the server component, so
// the ~46 KB `placesData` namespace never has to reach the browser.
// ============================================

import { Suspense, useCallback, useEffect, useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  PlacesBrowser,
  EmptyState,
  PlacesMap,
  LocationControl,
  TripPlanner,
} from "@/components/shared";
import { placeAccents } from "@/components/shared/place-accents";

import { Place, PlaceCategory, PriceLevel } from "@/types";
import { Search, ArrowRight, Map, Columns2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useRoadRoute } from "@/hooks/useRoadRoute";
import { haversineDistanceKm } from "@/lib/geo";
import { filterPlaces } from "@/data/places-search";
import { planItinerary, itineraryPath, MAX_STOPS } from "@/lib/itinerary";
import { multiStopDirectionsUrl } from "@/lib/maps";

const PRICE_LEVELS: PriceLevel[] = ["€", "€€", "€€€"];

// A stable reference for "no trip stops", so the map's clustering memo
// (keyed on this array's identity) does not recompute every render just
// because an empty trip produces a fresh `[]` literal each time.
const NO_TRIP_DESTINATIONS: Place[] = [];

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

/** A removable summary chip for one active filter. */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full bg-zellige-soft py-1 pl-3 pr-1.5 text-[12.5px] font-semibold text-zellige">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={label}
        className="flex h-4.5 w-4.5 items-center justify-center rounded-full text-zellige/70 transition-colors hover:bg-zellige/15 hover:text-zellige"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

/** Every category a `?category=` deep link is allowed to name. */
const PLACE_CATEGORIES: PlaceCategory[] = [
  "restaurant",
  "cafe",
  "grocery",
  "bakery",
  "butcher",
  "mosque",
  "study-spot",
  "sport",
  "leisure",
  "park",
];

/* There is no "all" any more. 100+ pins of every kind at once was a wall,
   not a view: nothing could be compared and the map was unreadable at city
   zoom. A category is always selected, and restaurants are the default
   because they are what most people arrive looking for. */
const DEFAULT_CATEGORY: PlaceCategory = "restaurant";

const readCategory = (raw: string | null): PlaceCategory =>
  raw && (PLACE_CATEGORIES as string[]).includes(raw) ? (raw as PlaceCategory) : DEFAULT_CATEGORY;

/* `?category=` lets the homepage intent chips and the search palette land here
   already filtered. Reading it in the client behind a boundary keeps this page
   statically prerendered, which reading it from the server page would not. */
export function PlacesExplorer(props: { places: Place[] }) {
  return (
    <Suspense fallback={null}>
      <PlacesExplorerInner {...props} />
    </Suspense>
  );
}

function PlacesExplorerInner({ places }: { places: Place[] }) {
  const t = useTranslations("places");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const queryParam = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory>(() =>
    readCategory(categoryParam)
  );

  /* Follow the params when they change under us — arriving from a chip or
     the mobile search overlay while already on /map is a navigation,
     not a remount. */
  useEffect(() => {
    setSelectedCategory(readCategory(categoryParam));
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery((current) => (queryParam !== current ? queryParam : current));
  }, [queryParam]);
  const [priceFilter, setPriceFilter] = useState<PriceLevel | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string | null>(null);
  const [cuisineFilter, setCuisineFilter] = useState<CuisineTag | null>(null);
  /* The map is the page's front door: pins answer "what is near me?" faster
     than any list can. The browse view is one tap away. */
  const [viewMode, setViewMode] = useState<"browse" | "map">("map");

  const geolocation = useGeolocation();
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number | null>(null);

  const handleLocationRequest = () => {
    track("places_location_request");
    geolocation.request();
  };

  const handleLocationClear = () => {
    track("places_location_cleared");
    geolocation.clear();
    setRadiusKm(null);
  };

  // Track only the outcome, never the coordinates themselves.
  useEffect(() => {
    if (geolocation.status === "granted") track("places_location_granted");
    else if (["denied", "timeout", "unavailable", "error"].includes(geolocation.status)) {
      track("places_location_failed", { reason: geolocation.status });
    }
  }, [geolocation.status]);

  // Distance is computed fresh from the visitor's in-memory coordinates
  // against each place's already-public lat/lng — nothing here is persisted
  // or sent anywhere.
  const placesWithDistance = useMemo(() => {
    if (!geolocation.coords) return places;
    const origin = geolocation.coords;
    return places.map((place) =>
      typeof place.lat === "number" && typeof place.lng === "number"
        ? { ...place, distanceKm: haversineDistanceKm(origin, { lat: place.lat, lng: place.lng }) }
        : place
    );
  }, [places, geolocation.coords]);

  /* Trip stops are held as slugs, not Place objects, so toggling one does not
     depend on which filtered list it came from. */
  const [tripSlugs, setTripSlugs] = useState<string[]>([]);

  const toggleTripStop = useCallback((slug: string) => {
    setTripSlugs((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : current.length >= MAX_STOPS
          ? current
          : [...current, slug]
    );
  }, []);

  /* Tapping "Directions" is now what builds the trip: it should never remove
     a stop that is already there, only ever add one, and do nothing (rather
     than silently drop the oldest stop) once the trip is full. */
  const addTripStop = useCallback((slug: string) => {
    setTripSlugs((current) =>
      current.includes(slug) || current.length >= MAX_STOPS ? current : [...current, slug]
    );
  }, []);

  const tripStops = useMemo(
    () =>
      tripSlugs
        .map((slug) => places.find((place) => place.slug === slug))
        .filter((place): place is Place => Boolean(place)),
    [tripSlugs, places]
  );

  /* Stops carry their distance from the reader so the planner can order from
     where they actually are, not from the first thing they tapped. */
  const tripStopsWithDistance = useMemo(
    () => tripStops.map((stop) => placesWithDistance.find((p) => p.slug === stop.slug) ?? stop),
    [tripStops, placesWithDistance]
  );

  /* Ordering comes from a straight-line nearest-neighbour walk, computed once
     here and reused for the map's fallback path, the real-route request, and
     the Google Maps hand-off, so all three always agree on stop order. */
  const tripItinerary = useMemo(() => {
    if (tripStopsWithDistance.length === 0) return null;
    return planItinerary(tripStopsWithDistance, geolocation.coords);
  }, [tripStopsWithDistance, geolocation.coords]);

  const routePath = useMemo(
    () => (tripItinerary ? itineraryPath(tripItinerary, geolocation.coords) : undefined),
    [tripItinerary, geolocation.coords]
  );

  /* The same stops as real street geometry. What gets drawn follows actual
     roads; `routePath` above is only the fallback the map falls back to
     while this is loading or if routing is unavailable. */
  const tripWaypoints = useMemo(
    () =>
      routePath && routePath.length > 1 ? routePath.map(([lat, lng]) => ({ lat, lng })) : null,
    [routePath]
  );
  const {
    route: tripRoute,
    status: tripRouteStatus,
    error: tripRouteError,
    retry: retryTripRoute,
  } = useRoadRoute(tripWaypoints);

  /* One source of truth for "real road distance to this stop", read by both
     the Trip Planner panel and the map's popup. `tripRoute.legs` carries no
     place identifiers of its own, but it was fetched from the exact ordered
     waypoints `tripItinerary` produces, so leg `i` here is leg `i` there —
     the length check is what guards against pairing a stale route with a
     itinerary that has since gained or lost a stop. Computing this once and
     handing both consumers the same map, rather than each zipping legs to
     stops on its own, is what keeps the pin popup and the trip panel from
     ever quoting two different distances for the same place again. */
  const tripLegDistanceKm = useMemo(() => {
    if (!tripItinerary || !tripRoute || tripRoute.legs.length !== tripItinerary.legs.length) {
      return null;
    }
    const bySlug: Record<string, number> = {};
    tripItinerary.legs.forEach((leg, index) => {
      bySlug[leg.to.slug] = tripRoute.legs[index].distanceKm;
    });
    return bySlug;
  }, [tripItinerary, tripRoute]);

  // `tripLegDistanceKm` is only ever non-null when it was built from this
  // exact `tripRoute`, so its presence alone is enough to trust the total.
  const totalRoadKm = tripLegDistanceKm && tripRoute ? tripRoute.distanceKm : null;

  /* A single-tap hand-off to real turn-by-turn navigation for the trip as it
     stands right now, reachable straight from a place's popup. */
  const tripMapsUrl = useMemo(
    () => (tripItinerary ? multiStopDirectionsUrl(tripItinerary.stops, geolocation.coords) : null),
    [tripItinerary, geolocation.coords]
  );

  const filterMeta: { key: PlaceCategory; label: string }[] = [
    { key: "restaurant", label: t("filters.restaurants") },
    { key: "cafe", label: t("filters.cafes") },
    { key: "grocery", label: t("filters.groceries") },
    { key: "bakery", label: t("filters.bakeries") },
    { key: "butcher", label: t("filters.butchers") },
    { key: "mosque", label: t("filters.mosques") },
    { key: "study-spot", label: t("filters.studySpots") },
    { key: "sport", label: t("filters.sport") },
    { key: "leisure", label: t("filters.leisure") },
    { key: "park", label: t("filters.parks") },
  ];

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    places.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, [places]);

  // Only offer filters for categories that actually have places
  const categoryFilters = filterMeta.filter((f) => (countByCategory[f.key] ?? 0) > 0);

  // Every district that appears in the data, alphabetized for the dropdown
  const districts = useMemo(() => {
    const unique = new Set(places.map((p) => p.district).filter((d): d is string => Boolean(d)));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [places]);

  // Localized category names for the map legend and marker popups
  const categoryLabelMap = useMemo(
    () => Object.fromEntries(filterMeta.map((f) => [f.key, f.label])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

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
  }, [places]);

  /* Filters shown inline are scoped to the selected type instead of hidden
     behind one generic "Filters" button: price only means something where
     places actually carry one (restaurants, butchers), and cuisine only
     ever applies to restaurants. Checked against the full, unfiltered
     dataset so the control doesn't flicker away the moment another filter
     narrows the results to zero. */
  const showPriceFilter = useMemo(
    () => places.some((p) => p.category === selectedCategory && p.price),
    [places, selectedCategory]
  );
  const showCuisineFilter = selectedCategory === "restaurant" && cuisines.length > 0;

  // A filter that no longer applies to the selected type shouldn't linger
  // invisibly in state — the moment its control disappears, its value clears.
  useEffect(() => {
    if (!showPriceFilter) setPriceFilter(null);
  }, [showPriceFilter]);
  useEffect(() => {
    if (!showCuisineFilter) setCuisineFilter(null);
  }, [showCuisineFilter]);

  const filteredPlaces = useMemo(
    () =>
      filterPlaces(places, {
        category: selectedCategory,
        price: priceFilter ?? undefined,
        district: districtFilter ?? undefined,
        cuisineTag: cuisineFilter ?? undefined,
        query: searchQuery,
        near: geolocation.coords
          ? { ...geolocation.coords, radiusKm: radiusKm ?? undefined }
          : undefined,
      }),
    [
      places,
      selectedCategory,
      priceFilter,
      districtFilter,
      cuisineFilter,
      searchQuery,
      geolocation.coords,
      radiusKm,
    ]
  );

  const activeFilterCount = [priceFilter, districtFilter, cuisineFilter].filter(Boolean).length;
  /* A category is always selected now, so it no longer counts as "filtering";
     only the things a reader added on top of the default do. */
  const isFiltering = Boolean(
    selectedCategory !== DEFAULT_CATEGORY || searchQuery.trim() || activeFilterCount > 0
  );

  return (
    <>
      {/* ========== STICKY FILTER TOOLBAR ==========
          Sits directly on the page background (no shadow, no border) so it
          reads as part of the same canvas as the hero above and the
          map/browse section below, not a separate panel. */}
      <div className="rise rise-3 sticky top-(--header-h) z-30 bg-background pb-4 pt-3">
        <div className="mx-auto flex max-w-7xl 2xl:max-w-[96rem] flex-col gap-3 px-4 sm:px-6 lg:px-8 2xl:px-12">
          {/* Row 1: search, advanced filters, view toggle */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative sm:w-64 lg:w-72">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-full bg-card pl-11 pr-10 text-base text-zinc-900 shadow-sm outline-none transition-shadow placeholder:text-zinc-400 focus:ring-2 focus:ring-zellige/40 sm:text-sm dark:bg-foreground/[0.075] dark:text-zinc-50 dark:shadow-none dark:placeholder:text-zinc-500 dark:ring-1 dark:ring-border dark:focus:ring-zellige/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label={t("results.clearFilters")}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Opt-in location, right of search: sorting by distance is
                  the point of the page. Nothing about the visitor's position
                  is requested, computed, or shown until they explicitly allow
                  it here, see LocationControl and useGeolocation. */}
              <LocationControl
                prominent
                status={geolocation.status}
                isSupported={geolocation.isSupported}
                onRequest={handleLocationRequest}
                onClear={handleLocationClear}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
                open={locationPopoverOpen}
                onOpenChange={setLocationPopoverOpen}
              />

              {geolocation.coords && radiusKm && (
                <FilterChip
                  label={t("location.radiusUpTo", { km: radiusKm })}
                  onRemove={() => setRadiusKm(null)}
                />
              )}

              {isFiltering && (
                <button
                  onClick={() => {
                    setSelectedCategory(DEFAULT_CATEGORY);
                    setSearchQuery("");
                    setPriceFilter(null);
                    setDistrictFilter(null);
                    setCuisineFilter(null);
                  }}
                  className="min-h-11 shrink-0 px-1 text-[13px] font-semibold text-zellige hover:underline sm:min-h-0 sm:px-0"
                >
                  {t("results.clearFilters")}
                </button>
              )}
            </div>

            {/* Map leads, since it is what the page opens on */}
            <div className="flex shrink-0 self-start rounded-full bg-card p-1 shadow-sm dark:bg-foreground/[0.075] dark:shadow-none sm:self-auto">
              <button
                onClick={() => setViewMode("map")}
                aria-pressed={viewMode === "map"}
                className={cn(
                  "flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-all sm:min-h-0 sm:px-3 sm:py-1.5",
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
                  "flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-all sm:min-h-0 sm:px-3 sm:py-1.5",
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

          {/* Row 2: category pills with live counts */}
          <div className="-mx-4 overflow-x-auto px-4 hide-scrollbar-mobile sm:mx-0 sm:px-0">
            <div className="flex min-w-max items-center gap-1.5 sm:flex-wrap">
              {categoryFilters.map((filter) => {
                const active = selectedCategory === filter.key;
                const accent = placeAccents[filter.key];
                return (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedCategory(filter.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-all duration-200 sm:min-h-0 sm:py-2",
                      active
                        ? cn(accent?.tint, accent?.text)
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
                        "text-xs tabular-nums opacity-70",
                        active ? accent?.text : "text-zinc-400 dark:text-zinc-500"
                      )}
                    >
                      {countByCategory[filter.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: filters scoped to the selected type — district always
              applies, price and cuisine only surface where they mean
              something (see showPriceFilter / showCuisineFilter above). */}
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={districtFilter ?? "all"}
              onValueChange={(value) => setDistrictFilter(value === "all" ? null : value)}
            >
              <SelectTrigger
                size="sm"
                className="h-9 w-auto min-w-[8.5rem] rounded-full border-0 bg-card px-3.5 text-[13px] font-semibold text-zinc-600 shadow-sm dark:bg-foreground/[0.075] dark:text-zinc-300 dark:shadow-none"
              >
                <SelectValue placeholder={t("advancedFilters.allDistricts")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("advancedFilters.allDistricts")}</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showPriceFilter && (
              <div className="flex items-center gap-1 rounded-full bg-card p-1 shadow-sm dark:bg-foreground/[0.075] dark:shadow-none">
                {PRICE_LEVELS.map((level) => {
                  const active = priceFilter === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriceFilter(active ? null : level)}
                      aria-pressed={active}
                      className={cn(
                        "min-h-9 rounded-full px-3 text-[13px] font-semibold transition-colors sm:min-h-0 sm:py-1",
                        active
                          ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-foreground/[0.09]"
                      )}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            )}

            {showCuisineFilter && (
              <Select
                value={cuisineFilter ?? "all"}
                onValueChange={(value) =>
                  setCuisineFilter(value === "all" ? null : (value as CuisineTag))
                }
              >
                <SelectTrigger
                  size="sm"
                  className="h-9 w-auto min-w-[8.5rem] rounded-full border-0 bg-card px-3.5 text-[13px] font-semibold text-zinc-600 shadow-sm dark:bg-foreground/[0.075] dark:text-zinc-300 dark:shadow-none"
                >
                  <SelectValue placeholder={t("advancedFilters.allCuisines")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("advancedFilters.allCuisines")}</SelectItem>
                  {cuisines.map((c) => (
                    <SelectItem key={c} value={c}>
                      {t(`cuisines.${c}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* ========== DIRECTORY ========== */}
      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 pt-6 sm:px-6 sm:pb-24 lg:px-8 2xl:px-12">
        {/* In map view the planned trip is shown inside the map itself (see
            PlacesMapCanvas), right under the legend, so seeing the route
            never means leaving the map. In browse view there is no map on
            screen to hold it, so it surfaces here instead. */}
        {tripItinerary && viewMode === "browse" && (
          <div className="mb-5 sm:max-w-md">
            <TripPlanner
              itinerary={tripItinerary}
              onRemove={toggleTripStop}
              onClear={() => setTripSlugs([])}
              tripLegDistanceKm={tripLegDistanceKm}
              totalRoadKm={totalRoadKm}
              tripMapsUrl={tripMapsUrl}
              tripRouteStatus={tripRouteStatus}
            />
          </div>
        )}

        {/* Map view */}
        {viewMode === "map" && (
          <PlacesMap
            places={filteredPlaces}
            categoryLabels={categoryLabelMap}
            userLocation={geolocation.coords}
            routePath={routePath}
            tripRoute={tripRoute}
            tripRouteStatus={tripRouteStatus}
            tripRouteError={tripRouteError}
            onRetryTripRoute={retryTripRoute}
            tripSlugs={tripSlugs}
            tripDestinations={tripItinerary?.stops ?? NO_TRIP_DESTINATIONS}
            tripLegDistanceKm={tripLegDistanceKm}
            onAddToTrip={addTripStop}
            tripFull={tripSlugs.length >= MAX_STOPS}
            tripMapsUrl={tripMapsUrl}
            locationStatus={geolocation.status}
            isLocationSupported={geolocation.isSupported}
            onRequestLocation={handleLocationRequest}
            tripItinerary={tripItinerary}
            onRemoveTripStop={toggleTripStop}
            onClearTrip={() => setTripSlugs([])}
            totalRoadKm={totalRoadKm}
          />
        )}

        {/* Browse view: index on the left, the selected place shown large */}
        {viewMode === "browse" &&
          (filteredPlaces.length > 0 ? (
            <>
              {isFiltering && (
                <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {filteredPlaces.length}
                  </span>{" "}
                  {filteredPlaces.length === 1 ? t("results.place") : t("results.places")}{" "}
                  {t("results.in")}{" "}
                  <span className="font-medium text-zellige">
                    {categoryFilters.find((c) => c.key === selectedCategory)?.label}
                  </span>
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
              <PlacesBrowser
                places={filteredPlaces}
                categories={categoryFilters}
                tripSlugs={tripSlugs}
                onToggleTrip={toggleTripStop}
                tripFull={tripSlugs.length >= MAX_STOPS}
              />
            </>
          ) : (
            <EmptyState
              type="places"
              title={t("noResults")}
              description={t("noResultsDescription")}
            />
          ))}

        <p className="mt-10 text-center text-xs text-zinc-400 dark:text-zinc-500">
          {t.rich("attribution", {
            osm: (chunks) => (
              <Link
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-zellige"
              >
                {chunks}
              </Link>
            ),
            odbl: (chunks) => (
              <Link
                href="https://opendatacommons.org/licenses/odbl/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-zellige"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>

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
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 sm:min-h-0 sm:py-3 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              {t("cta.button")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlacesExplorer;
