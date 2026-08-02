"use client";

/*
 * The Leaflet half of the places map. Loaded only in the browser through
 * `PlacesMap`, so Leaflet can be imported at module level here.
 *
 * Design notes:
 * - Basemap is deliberately quiet (CARTO positron / dark matter) so the only
 *   colour on screen belongs to the brand.
 * - Markers carry the same `--acc-*` hue as the category pills and cards, with
 *   a lucide glyph instead of an emoji.
 * - Overlapping places collapse into counted clusters, tinted with the family
 *   colour when the group is uniform and with ink when it is mixed.
 */

import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  AttributionControl,
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import {
  Check,
  ExternalLink,
  Maximize,
  Maximize2,
  Minimize2,
  MapPin,
  Minus,
  Plus,
  Route,
  Star,
  LocateFixed,
} from "lucide-react";

import type { Place } from "@/types";
import { placeAccents } from "./place-accents";
import { cn } from "@/lib/utils";
import { placeDirectionsUrl } from "@/lib/maps";
import { formatDistanceKm, haversineDistanceKm, travelEta, type Coordinates } from "@/lib/geo";

const MUNICH_CENTER: [number, number] = [48.1372, 11.5756];

/* Pixel radius used to decide when two places collapse into one cluster */
const CLUSTER_RADIUS = 66;

/* Below this, every pin wearing its name turns the city into soup: at zoom 12
   the whole of Munich is on screen and the labels overlap into a grey band.
   From 14 up you are looking at a district or a street, where the names are
   what make the map readable without clicking every pin. */
const LABEL_MIN_ZOOM = 14;

/* Category glyphs, lucide path data drawn in a 24x24 box */
const CATEGORY_GLYPHS: Record<string, string> = {
  restaurant:
    '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  cafe: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  grocery:
    '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
  bakery:
    '<path d="M10.2 18H4.774a1.5 1.5 0 0 1-1.352-.97 11 11 0 0 1 .132-6.487"/><path d="M18 10.2V4.774a1.5 1.5 0 0 0-.97-1.352 11 11 0 0 0-6.486.132"/><path d="M18 5a4 3 0 0 1 4 3 2 2 0 0 1-2 2 10 10 0 0 0-5.139 1.42"/><path d="M5 18a3 4 0 0 0 3 4 2 2 0 0 0 2-2 10 10 0 0 1 1.42-5.14"/><path d="M8.709 2.554a10 10 0 0 0-6.155 6.155 1.5 1.5 0 0 0 .676 1.626l9.807 5.42a2 2 0 0 0 2.718-2.718l-5.42-9.807a1.5 1.5 0 0 0-1.626-.676"/>',
  butcher:
    '<path d="M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"/><circle cx="12.5" cy="8.5" r="2.5"/>',
  mosque:
    '<path d="M18 5h4"/><path d="M20 3v4"/><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  "study-spot":
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  sport:
    '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
  leisure:
    '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  park:
    '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
};

const FALLBACK_GLYPH = '<circle cx="12" cy="12" r="3.5"/>';

/** The `--acc-*` token behind a category, so markers match the page pills. */
function accentColor(category: string) {
  const key = placeAccents[category]?.key;
  return key ? `var(--acc-${key})` : "var(--zellige)";
}

/** Escapes the handful of characters that matter inside a DivIcon's HTML
    string. Tag data is ours, not user input, but the icon is built by string
    concatenation so this keeps it inert regardless. */
function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] ?? ch
  );
}

/** A one- or two-word keyword floating over a pin — the place's first tag,
    title-cased — so a glance at the map says "halal", "vegan", "library"
    without opening a popup. The category itself would say the same thing on
    every pin at once, since the map only ever shows one category. */
function keywordFor(place: Place): string | null {
  const tag = place.tags?.[0];
  if (!tag) return null;
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/* ---------------------------------------------------------------- markers */

const iconCache = new Map<string, L.DivIcon>();

function pinIcon(category: string, active: boolean, keyword: string | null) {
  const cacheKey = `${category}:${active ? "on" : "off"}:${keyword ?? ""}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const glyph = CATEGORY_GLYPHS[category] ?? FALLBACK_GLYPH;
  const color = accentColor(category);
  const badge = keyword
    ? `<span class="atlas-pin__keyword" style="--pin:${color}">${escapeHtml(keyword)}</span>`
    : "";
  const icon = L.divIcon({
    className: "atlas-marker",
    html: `<div class="atlas-pin-wrap">
      ${badge}
      <div class="atlas-pin${active ? " atlas-pin--active" : ""}" style="--pin:${color}">
        <svg viewBox="0 0 32 40" width="32" height="40" aria-hidden="true">
          <path class="atlas-pin__body" d="M16 38.5C16 38.5 28.5 24.6 28.5 15A12.5 12.5 0 1 0 3.5 15C3.5 24.6 16 38.5 16 38.5Z"/>
          <g class="atlas-pin__glyph" transform="translate(8.5 7.5) scale(0.625)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
        </svg>
      </div>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}

let userLocationIcon: L.DivIcon | null = null;
function getUserLocationIcon() {
  if (!userLocationIcon) {
    userLocationIcon = L.divIcon({
      className: "atlas-marker",
      html: `<div class="atlas-user-dot"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }
  return userLocationIcon;
}

function clusterIcon(count: number, color: string | null) {
  const size = count < 10 ? 34 : count < 50 ? 40 : 46;
  const style = color ? `--pin:${color}` : "";
  return L.divIcon({
    className: "atlas-marker",
    html: `<div class="atlas-cluster${color ? "" : " atlas-cluster--mixed"}" style="${style};width:${size}px;height:${size}px">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/* --------------------------------------------------------------- clusters */

interface Cluster {
  id: string;
  lat: number;
  lng: number;
  items: Place[];
}

/**
 * Greedy proximity clustering in screen space: a place joins the first cluster
 * whose centre sits within `CLUSTER_RADIUS` pixels of it, otherwise it starts
 * one. Cheap for a few hundred places and, unlike grid bucketing, it does not
 * split neighbours that happen to straddle a cell edge.
 */
function buildClusters(map: L.Map, places: Place[], zoom: number): Cluster[] {
  const working: { center: L.Point; sum: L.Point; items: Place[] }[] = [];

  for (const place of places) {
    const point = map.project([place.lat!, place.lng!], zoom);
    const host = working.find((cluster) => cluster.center.distanceTo(point) <= CLUSTER_RADIUS);

    if (host) {
      host.items.push(place);
      host.sum = host.sum.add(point);
      host.center = new L.Point(host.sum.x / host.items.length, host.sum.y / host.items.length);
    } else {
      working.push({ center: point.clone(), sum: point.clone(), items: [place] });
    }
  }

  return working.map((cluster, index) => {
    const center = map.unproject(cluster.center, zoom);
    return {
      id: cluster.items.length === 1 ? cluster.items[0].slug : `cluster-${zoom}-${index}`,
      lat: center.lat,
      lng: center.lng,
      items: cluster.items,
    };
  });
}

/** A cluster keeps its family colour while every member shares one. */
function clusterColor(items: Place[]) {
  const first = placeAccents[items[0].category]?.key;
  if (!first) return null;
  return items.every((item) => placeAccents[item.category]?.key === first)
    ? `var(--acc-${first})`
    : null;
}

interface MarkerLayerProps {
  places: Place[];
  selected: Place | null;
  onSelect: (place: Place | null) => void;
}

function MarkerLayer({ places, selected, onSelect }: MarkerLayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const clusters = useMemo(() => buildClusters(map, places, zoom), [map, places, zoom]);

  const openCluster = (cluster: Cluster) => {
    const bounds = L.latLngBounds(
      cluster.items.map((item) => [item.lat!, item.lng!] as [number, number])
    );
    // Places sharing an address never separate, so hand over to the popup
    // instead of zooming forever.
    const spread = Math.max(
      bounds.getNorth() - bounds.getSouth(),
      bounds.getEast() - bounds.getWest()
    );
    if (spread < 0.0004 || map.getZoom() >= map.getMaxZoom() - 1) {
      onSelect(cluster.items[0]);
      return;
    }
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 17, animate: true });
  };

  return (
    <>
      {clusters.map((cluster) => {
        if (cluster.items.length === 1) {
          const place = cluster.items[0];
          const isSelected = selected?.slug === place.slug;
          return (
            <Marker
              key={place.slug}
              position={[place.lat!, place.lng!]}
              icon={pinIcon(place.category, isSelected, keywordFor(place))}
              title={place.name}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{ click: () => onSelect(place) }}
            >
              {/* The name, on the map, once there is room for it. The selected
                  pin keeps its label at any zoom so it stays identifiable
                  after a search or a jump from the list. */}
              {(zoom >= LABEL_MIN_ZOOM || isSelected) && (
                <Tooltip
                  permanent
                  direction="right"
                  offset={[12, -12]}
                  className={cn("atlas-label", isSelected && "atlas-label--active")}
                >
                  {place.name}
                </Tooltip>
              )}
            </Marker>
          );
        }

        return (
          <Marker
            key={cluster.id}
            position={[cluster.lat, cluster.lng]}
            icon={clusterIcon(cluster.items.length, clusterColor(cluster.items))}
            title={cluster.items
              .slice(0, 5)
              .map((item) => item.name)
              .join(", ")}
            eventHandlers={{ click: () => openCluster(cluster) }}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ popup */

/**
 * Bounds that hold the bulk of the set. A handful of places sit far out in the
 * suburbs; framing on them would leave the city itself as one unreadable
 * cluster, so large sets are framed on their 10th to 90th percentile and the
 * outliers stay one pan away.
 */
function coreBounds(places: Place[]) {
  const lats = places.map((place) => place.lat!).sort((a, b) => a - b);
  const lngs = places.map((place) => place.lng!).sort((a, b) => a - b);
  const at = (values: number[], ratio: number) =>
    values[Math.min(values.length - 1, Math.max(0, Math.round((values.length - 1) * ratio)))];

  const trim = places.length >= 20 ? 0.1 : 0;
  return L.latLngBounds(
    [at(lats, trim), at(lngs, trim)],
    [at(lats, 1 - trim), at(lngs, 1 - trim)]
  );
}

function PlacePopupCard({
  place,
  label,
  inTrip = false,
  onToggleTrip,
  tripFull = false,
}: {
  place: Place;
  label: string;
  inTrip?: boolean;
  onToggleTrip?: (slug: string) => void;
  tripFull?: boolean;
}) {
  const t = useTranslations("places");
  const tTrip = useTranslations("places.trip");
  const locale = useLocale();
  const color = accentColor(place.category);
  const directions = placeDirectionsUrl(place);

  return (
    <div className="p-4">
      <span
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
        style={{ color }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} aria-hidden />
        {label}
      </span>

      <h3 className="font-display mt-1.5 pr-7 text-[15px] font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
        {place.name}
      </h3>

      {(place.rating || place.price) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
          {place.rating && (
            <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-200">
              <Star className="h-3.5 w-3.5 fill-acc-saffron text-acc-saffron" />
              {place.rating}
              {place.reviewCount && (
                <span className="font-normal text-zinc-400 dark:text-zinc-500">
                  ({place.reviewCount})
                </span>
              )}
            </span>
          )}
          {place.price && <span className="font-semibold text-zellige">{place.price}</span>}
        </div>
      )}

      <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        <MapPin className="mt-[3px] h-3.5 w-3.5 shrink-0" />
        <span>
          {place.address}
          {place.distanceKm !== undefined &&
            ` · ${t("location.away", { distance: formatDistanceKm(place.distanceKm, locale) })} · ${t(
              `location.eta.${travelEta(place.distanceKm).mode}`,
              { minutes: travelEta(place.distanceKm).minutes }
            )}`}
        </span>
      </p>

      {place.description && (
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          {place.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="atlas-popup__cta"
        >
          <MapPin className="h-3.5 w-3.5" />
          {t("card.directions")}
        </a>
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="atlas-popup__ghost"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("card.website")}
          </a>
        )}
        {/* Building a route without leaving the map: the browse view is not
            where most people are when they spot a second place they want. */}
        {onToggleTrip && (
          <button
            type="button"
            onClick={() => onToggleTrip(place.slug)}
            disabled={!inTrip && tripFull}
            aria-pressed={inTrip}
            title={inTrip ? tTrip("remove") : tTrip("add")}
            aria-label={inTrip ? tTrip("remove") : tTrip("add")}
            className="atlas-popup__ghost disabled:cursor-not-allowed disabled:opacity-40"
          >
            {inTrip ? <Check className="h-3.5 w-3.5" /> : <Route className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- legend */

interface LegendRow {
  key: string;
  label: string;
  count: number;
  color: string;
}

function Legend({ rows, total, variant }: { rows: LegendRow[]; total: number; variant: "card" | "bar" }) {
  const t = useTranslations("places");

  if (variant === "bar") {
    return (
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center gap-1.5 text-[13px]">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: row.color }}
              aria-hidden
            />
            <span className="text-zinc-600 dark:text-zinc-300">{row.label}</span>
            <span className="tabular-nums text-zinc-400 dark:text-zinc-500">{row.count}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="w-[13rem] rounded-2xl bg-card p-4 shadow-[0_8px_30px_rgb(0_0_0/0.10)] dark:shadow-none dark:ring-1 dark:ring-border">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
        {t("map.legend")}
      </p>
      <p className="font-display mt-1 text-2xl font-bold leading-none tracking-tight text-zinc-900 dark:text-zinc-50">
        {total}{" "}
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {total === 1 ? t("results.place") : t("results.places")}
        </span>
      </p>
      <ul className="mt-3 space-y-1.5">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center gap-2 text-[13px]">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: row.color }}
              aria-hidden
            />
            <span className="truncate text-zinc-600 dark:text-zinc-300">{row.label}</span>
            <span className="ml-auto tabular-nums text-zinc-400 dark:text-zinc-500">
              {row.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------- map */

export interface PlacesMapCanvasProps {
  places: Place[];
  /** Plural category names, for the counted legend */
  categoryLabels?: Record<string, string>;
  /** Singular category names, for a single marker's popup */
  categoryNames?: Record<string, string>;
  /** The visitor's opted-in position, shown as a marker. Never sent anywhere. */
  userLocation?: Coordinates | null;
  /** Ordered stop coordinates for a planned trip, drawn as a route line. */
  routePath?: [number, number][];
  /** Slugs already in the trip, so the popup can offer add or remove. */
  tripSlugs?: string[];
  onToggleTrip?: (slug: string) => void;
  tripFull?: boolean;
  className?: string;
}

export default function PlacesMapCanvas({
  places,
  categoryLabels,
  categoryNames,
  userLocation,
  routePath,
  tripSlugs = [],
  onToggleTrip,
  tripFull = false,
  className,
}: PlacesMapCanvasProps) {
  const t = useTranslations("places");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [map, setMap] = useState<L.Map | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);
  // Scroll-to-zoom is opt-in (activated by a click on the map) so a mouse
  // wheel scrolling the page doesn't get trapped the moment it passes over
  // the map. Touch devices zoom by pinch regardless, via Leaflet's default
  // touchZoom, so this only affects desktop cursor behaviour.
  const [scrollZoomActive, setScrollZoomActive] = useState(false);

  /* Fullscreen is a CSS-driven overlay rather than the Fullscreen API: iOS
     Safari doesn't support requestFullscreen on arbitrary elements, so a
     fixed, full-viewport wrapper is what actually works everywhere,
     including mobile. */
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  // Leaflet caches its container size at construction; toggling fullscreen
  // resizes that container without firing a window resize event, so the tile
  // grid has to be told explicitly once the new layout has painted.
  useEffect(() => {
    if (!map) return;
    const id = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(id);
  }, [map, isFullscreen]);

  const mapped = useMemo(
    () => places.filter((place) => typeof place.lat === "number" && typeof place.lng === "number"),
    [places]
  );

  const legendRows = useMemo<LegendRow[]>(() => {
    const counts = new Map<string, number>();
    mapped.forEach((place) => counts.set(place.category, (counts.get(place.category) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        key,
        label: categoryLabels?.[key] ?? key.replace(/-/g, " "),
        count,
        color: accentColor(key),
      }));
  }, [mapped, categoryLabels]);

  const fitToPlaces = useCallback(
    (animate: boolean) => {
      if (!map || mapped.length === 0) return;
      if (mapped.length === 1) {
        map.setView([mapped[0].lat!, mapped[0].lng!], 15, { animate });
        return;
      }
      map.fitBounds(coreBounds(mapped), { padding: [56, 56], maxZoom: 15, animate });
    },
    [map, mapped]
  );

  // Re-frame whenever the result set changes, so filtering also zooms the map
  const signature = useMemo(() => mapped.map((place) => place.slug).join("|"), [mapped]);
  const framed = useRef(false);
  useEffect(() => {
    setSelected(null);
    fitToPlaces(framed.current);
    framed.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, map]);

  // react-leaflet only reads scrollWheelZoom once, at map construction, so
  // toggling the prop after mount has no effect on the live map instance.
  // Enable/disable the handler imperatively instead.
  useEffect(() => {
    if (!map) return;
    if (scrollZoomActive) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [map, scrollZoomActive]);

  return (
    <div
      className={cn(
        "atlas-map flex flex-col overflow-hidden bg-card shadow-[0_2px_24px_rgb(0_0_0/0.08)] dark:shadow-none dark:ring-1 dark:ring-border",
        isFullscreen ? "fixed inset-0 z-[100] rounded-none" : "rounded-[2rem]"
      )}
    >
      <div
        className={cn("relative w-full", isFullscreen ? "min-h-0 flex-1" : className)}
        onClick={() => setScrollZoomActive(true)}
        onMouseLeave={() => setScrollZoomActive(false)}
      >
        <MapContainer
          ref={setMap}
          center={MUNICH_CENTER}
          zoom={12}
          minZoom={10}
          maxZoom={18}
          zoomControl={false}
          scrollWheelZoom={scrollZoomActive}
          attributionControl={false}
          className="z-0 h-full w-full"
        >
          <AttributionControl position="bottomright" prefix={false} />
          <TileLayer
            key={isDark ? "dark" : "light"}
            url={
              isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* The planned route, under the pins so it never hides one. A
              straight line between stops, matching how the time is estimated:
              drawing turn-by-turn geometry we did not compute would claim a
              precision this does not have. */}
          {routePath && routePath.length > 1 && (
            <Polyline
              positions={routePath}
              pathOptions={{
                color: "var(--zellige)",
                weight: 3,
                opacity: 0.75,
                dashArray: "1 7",
                lineCap: "round",
              }}
            />
          )}

          {/* A live line from "you" to whatever pin is open, so tapping a
              place answers "how far, and how do I get a feel for that" in
              one glance, without waiting on the popup's text. */}
          {userLocation &&
            selected &&
            typeof selected.lat === "number" &&
            typeof selected.lng === "number" &&
            (() => {
              const distanceKm =
                selected.distanceKm ??
                haversineDistanceKm(userLocation, { lat: selected.lat, lng: selected.lng });
              const eta = travelEta(distanceKm);
              return (
                <Polyline
                  key={`live-route-${selected.slug}`}
                  positions={[
                    [userLocation.lat, userLocation.lng],
                    [selected.lat, selected.lng],
                  ]}
                  pathOptions={{
                    color: "var(--acc-blue)",
                    weight: 3.5,
                    opacity: 0.85,
                    dashArray: "1 10",
                    lineCap: "round",
                    className: "atlas-route-live",
                  }}
                >
                  <Tooltip
                    permanent
                    direction="center"
                    className="atlas-route-label"
                    interactive={false}
                  >
                    {formatDistanceKm(distanceKm, locale)} ·{" "}
                    {t(`location.eta.${eta.mode}`, { minutes: eta.minutes })}
                  </Tooltip>
                </Polyline>
              );
            })()}

          <MarkerLayer places={mapped} selected={selected} onSelect={setSelected} />

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={getUserLocationIcon()}
              title={t("location.button")}
              interactive={false}
              zIndexOffset={-1000}
            />
          )}

          {selected && (
            <Popup
              key={selected.slug}
              position={[selected.lat!, selected.lng!]}
              offset={[0, -36]}
              minWidth={264}
              maxWidth={264}
              autoPanPadding={[28, 28]}
              eventHandlers={{ remove: () => setSelected(null) }}
            >
              <PlacePopupCard
                place={selected}
                label={categoryNames?.[selected.category] ?? selected.category.replace(/-/g, " ")}
                inTrip={tripSlugs.includes(selected.slug)}
                onToggleTrip={onToggleTrip}
                tripFull={tripFull}
              />
            </Popup>
          )}
        </MapContainer>

        {/* Legend, desktop only: the bar under the map covers small screens */}
        {legendRows.length > 0 && (
          <div
            className={cn(
              "pointer-events-none absolute left-4 z-10 hidden md:block",
              isFullscreen ? "top-[max(1rem,env(safe-area-inset-top))]" : "top-4"
            )}
          >
            <div className="pointer-events-auto">
              <Legend rows={legendRows} total={mapped.length} variant="card" />
            </div>
          </div>
        )}

        {/* Zoom, framing and fullscreen controls, kept clear of the legend and the attribution */}
        <div
          className={cn(
            "absolute right-4 z-10 flex flex-col gap-1 rounded-2xl bg-card p-1 shadow-[0_8px_30px_rgb(0_0_0/0.10)] dark:shadow-none dark:ring-1 dark:ring-border",
            isFullscreen ? "top-[max(1rem,env(safe-area-inset-top))]" : "top-4"
          )}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen((current) => !current)}
            aria-label={isFullscreen ? t("map.fullscreenExit") : t("map.fullscreenEnter")}
            aria-pressed={isFullscreen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-foreground/10 dark:hover:text-zinc-50 sm:h-9 sm:w-9"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => map?.zoomIn()}
            aria-label={t("map.zoomIn")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-foreground/10 dark:hover:text-zinc-50 sm:h-9 sm:w-9"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => map?.zoomOut()}
            aria-label={t("map.zoomOut")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-foreground/10 dark:hover:text-zinc-50 sm:h-9 sm:w-9"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => fitToPlaces(true)}
            aria-label={t("map.fit")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-foreground/10 dark:hover:text-zinc-50 sm:h-9 sm:w-9"
          >
            <Maximize className="h-4 w-4" />
          </button>
          {userLocation && (
            <button
              type="button"
              onClick={() => map?.setView([userLocation.lat, userLocation.lng], 15, { animate: true })}
              aria-label={t("location.button")}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-foreground/10 dark:hover:text-zinc-50 sm:h-9 sm:w-9"
            >
              <LocateFixed className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Cursor hint for scroll-zoom, desktop mouse only: touch devices
            already zoom by pinch and have no wheel to explain. */}
        {!scrollZoomActive && (
          <div className="atlas-map__scroll-hint pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-card/95 px-3 py-1.5 text-[12px] font-medium text-zinc-500 shadow-[0_8px_30px_rgb(0_0_0/0.10)] backdrop-blur dark:text-zinc-400 dark:shadow-none dark:ring-1 dark:ring-border">
            {t("map.scrollHint")}
          </div>
        )}

        {mapped.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
            <div className="rounded-2xl bg-card px-6 py-5 text-center shadow-[0_8px_30px_rgb(0_0_0/0.10)] dark:shadow-none dark:ring-1 dark:ring-border">
              <p className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                {t("noResults")}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t("noResultsDescription")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar: legend on small screens, usage note on all */}
      <div
        className={cn(
          "flex shrink-0 flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
          isFullscreen && "pb-[max(1rem,env(safe-area-inset-bottom))]"
        )}
      >
        <div className="md:hidden">
          <Legend rows={legendRows} total={mapped.length} variant="bar" />
        </div>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 md:ml-auto">{t("mapNote")}</p>
      </div>
    </div>
  );
}
