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
  Loader2,
  Maximize,
  Maximize2,
  Minimize2,
  MapPin,
  Minus,
  Plus,
  Star,
  LocateFixed,
} from "lucide-react";

import type { Place } from "@/types";
import { placeAccents } from "./place-accents";
import { cn } from "@/lib/utils";
import { formatDistanceKm, haversineDistanceKm, type Coordinates } from "@/lib/geo";
import type { RoadRoute, RouteErrorReason } from "@/lib/routing";
import type { GeolocationStatus } from "@/hooks/useGeolocation";
import type { Itinerary } from "@/lib/itinerary";
import { TripPlanner } from "./TripPlanner";

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

/* These either restate the category a filtered map view is already showing
   (every restaurant here is halal, every mosque is a mosque) or are too
   generic to tell one pin from the next. The badge looks past them for
   whichever tag actually is distinctive, falling back to the first tag only
   when a place has nothing else on record. */
const GENERIC_KEYWORD_TAGS = new Set([
  "halal",
  "halal-on-request",
  "100-percent-halal",
  "mosque",
  "study",
  "library",
  "cafe",
  "restaurant",
  "bakery",
  "butcher",
  "grocery",
  "park",
  "sport",
  "leisure",
  "outdoor",
]);

/** A one- or two-word keyword floating over a pin — the place's most
    distinctive tag, title-cased — so a glance at the map says "Turkish",
    "Vegan", "Hidden Gem" instead of the "Halal" every single pin already
    shares by virtue of being on this map at all. */
function keywordFor(place: Place): string | null {
  if (place.tags.length === 0) return null;
  const distinctive = place.tags.find((tag) => !GENERIC_KEYWORD_TAGS.has(tag)) ?? place.tags[0];
  return distinctive
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** The full pin badge: keyword, price tier (as €/€€/€€€, never a bare
    number), and distance in kilometres — never a travel-time estimate,
    which belongs to the itinerary panel, not a pin floating over a place. */
function pinBadgeText(place: Place, locale: string): string {
  const parts: string[] = [];
  const keyword = keywordFor(place);
  if (keyword) parts.push(keyword);
  if (place.price) parts.push(place.price);
  if (typeof place.distanceKm === "number") parts.push(formatDistanceKm(place.distanceKm, locale));
  return parts.join(" · ");
}

/* ---------------------------------------------------------------- markers */

const iconCache = new Map<string, L.DivIcon>();

function pinIcon(category: string, active: boolean, badgeText: string) {
  const cacheKey = `${category}:${active ? "on" : "off"}:${badgeText}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const glyph = CATEGORY_GLYPHS[category] ?? FALLBACK_GLYPH;
  const color = accentColor(category);
  const badge = badgeText
    ? `<span class="atlas-pin__keyword" style="--pin:${color}">${escapeHtml(badgeText)}</span>`
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

/** A small pill dropped at a leg's midpoint on the itinerary line, showing
    only the straight-line distance in kilometres — no time estimate, which
    the trip panel already gives per leg. Anchored at [0,0] with a zero-size
    box so the label centers itself exactly on the point via CSS transform,
    the same trick a Leaflet divIcon label always needs. */
const legLabelCache = new Map<string, L.DivIcon>();
function legDistanceIcon(text: string) {
  const cached = legLabelCache.get(text);
  if (cached) return cached;
  const icon = L.divIcon({
    className: "atlas-marker",
    html: `<span class="atlas-leg-label">${escapeHtml(text)}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
  legLabelCache.set(text, icon);
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

/** The pin for a place in the current trip: rendered outside the clustering
    system entirely (see `clusterablePlaces` below), so it never collapses
    into a numbered cluster bubble the way an ordinary pin would — the whole
    point is staying a legible, individual point at any zoom, including
    fully zoomed out. Bigger than a category pin, zellige rather than a
    category hue so it visually ties back to the route line it sits at the
    end of, and numbered to match its stop order in the Trip Planner list. */
const destinationIconCache = new Map<string, L.DivIcon>();
function destinationIcon(order: number, active: boolean) {
  const cacheKey = `${order}:${active ? "on" : "off"}`;
  const cached = destinationIconCache.get(cacheKey);
  if (cached) return cached;

  const icon = L.divIcon({
    className: "atlas-marker",
    html: `<div class="atlas-destination-wrap">
      <div class="atlas-destination-pulse"></div>
      <div class="atlas-destination-pin${active ? " atlas-destination-pin--active" : ""}">
        <svg viewBox="0 0 36 46" width="36" height="46" aria-hidden="true">
          <path class="atlas-destination-pin__body" d="M18 44.5C18 44.5 32 28.9 32 18A14 14 0 1 0 4 18C4 28.9 18 44.5 18 44.5Z"/>
        </svg>
        <span class="atlas-destination-pin__number">${order}</span>
      </div>
    </div>`,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
  });

  destinationIconCache.set(cacheKey, icon);
  return icon;
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
  const locale = useLocale();
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
              icon={pinIcon(place.category, isSelected, pinBadgeText(place, locale))}
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
  roadDistanceKm,
  tripFull = false,
  tripMapsUrl = null,
  pendingSlug,
  onDirections,
  directionsStatus,
  directionsError,
  onRetryDirections,
  awaitingLocation,
  locationStatus,
  isLocationSupported,
  onEnableLocation,
}: {
  place: Place;
  label: string;
  inTrip?: boolean;
  /** Real road distance to this stop, when it is part of the trip and
      routing has resolved. Takes over from `place.distanceKm` (straight
      line) so this card never quotes a different number than the drawn
      route or the Trip Planner do for the exact same place. */
  roadDistanceKm?: number;
  tripFull?: boolean;
  /** One-tap hand-off to real navigation for the trip as it stands, not
      just this one place — shown whenever any trip exists. */
  tripMapsUrl?: string | null;
  /** The slug "Directions" was last tapped for, so a loading/error state
      never bleeds onto a pin that never asked for one. */
  pendingSlug: string | null;
  onDirections: (place: Place) => void;
  directionsStatus: "idle" | "loading" | "error";
  directionsError: RouteErrorReason | null;
  onRetryDirections: () => void;
  awaitingLocation: boolean;
  locationStatus: GeolocationStatus;
  isLocationSupported: boolean;
  onEnableLocation: () => void;
}) {
  const t = useTranslations("places");
  const tTrip = useTranslations("places.trip");
  const locale = useLocale();
  const color = accentColor(place.category);
  const isPending = pendingSlug === place.slug;

  const locationErrorKey = !isLocationSupported
    ? "location.errorUnavailable"
    : locationStatus === "denied"
      ? "location.errorDenied"
      : locationStatus === "timeout"
        ? "location.errorTimeout"
        : locationStatus === "unavailable"
          ? "location.errorUnavailable"
          : locationStatus === "error"
            ? "location.errorGeneric"
            : null;

  /* Exactly one status row under the button at a time, in the order a
     visitor needs to resolve them: a stalled prompt outranks a stale error,
     which outranks quietly celebrating that the trip grew. */
  const notice = awaitingLocation
    ? "location"
    : isPending && tripFull && !inTrip
      ? "tripFull"
      : isPending && directionsStatus === "error"
        ? "error"
        : inTrip || tripMapsUrl
          ? "success"
          : null;

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
          {(() => {
            const distanceKm = roadDistanceKm ?? place.distanceKm;
            return (
              distanceKm !== undefined &&
              ` · ${t("location.away", { distance: formatDistanceKm(distanceKm, locale) })}`
            );
          })()}
        </span>
      </p>

      {place.description && (
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          {place.description}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {/* The one button this popup offers. Adding the place to the trip
            and drawing its real route both happen as a side effect of this
            single tap — never a separate "add to trip" step. */}
        <button
          type="button"
          onClick={() => onDirections(place)}
          disabled={isPending && directionsStatus === "loading"}
          className="atlas-popup__cta disabled:cursor-wait disabled:opacity-70"
        >
          {isPending && directionsStatus === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t("card.directions")}
        </button>

        {notice === "location" &&
          (locationErrorKey ? (
            <p className="text-[12px] leading-relaxed text-acc-terra">{t(locationErrorKey)}</p>
          ) : locationStatus === "locating" ? (
            <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t("location.locating")}
            </p>
          ) : (
            <p className="flex items-center justify-between gap-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              <span>{t("directions.locationNeeded")}</span>
              <button
                type="button"
                onClick={onEnableLocation}
                className="shrink-0 font-semibold text-zellige hover:underline"
              >
                {t("directions.enableLocation")}
              </button>
            </p>
          ))}

        {notice === "tripFull" && (
          <p className="text-[12px] leading-relaxed text-acc-terra">{t("directions.tripFull")}</p>
        )}

        {notice === "error" && (
          <p className="text-[12px] leading-relaxed text-acc-terra">
            {directionsError === "out_of_area"
              ? t("directions.outOfArea")
              : directionsError === "no_route"
                ? t("directions.noRoute")
                : t("directions.error")}{" "}
            {/* Retrying an out-of-area or no-route answer just repeats it;
                only a service failure is worth asking about again. */}
            {directionsError === "unavailable" && (
              <button
                type="button"
                onClick={onRetryDirections}
                className="font-semibold underline underline-offset-2"
              >
                {t("directions.retry")}
              </button>
            )}
          </p>
        )}

        {notice === "success" && (
          <p className="flex items-center justify-between gap-2 text-[12px] leading-relaxed">
            {inTrip ? (
              <span className="flex items-center gap-1 font-semibold text-zellige">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                {tTrip("inTrip")}
              </span>
            ) : (
              <span />
            )}
            {tripMapsUrl && (
              <a
                href={tripMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-zellige hover:underline"
              >
                {tTrip("openInMaps")}
              </a>
            )}
          </p>
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
  /** Ordered stop coordinates for a planned trip. Straight-line fallback,
      used only when the road route could not be fetched. */
  routePath?: [number, number][];
  /** The planned trip as real street geometry, when routing succeeded. */
  tripRoute?: RoadRoute | null;
  tripRouteStatus?: "idle" | "loading" | "error";
  tripRouteError?: RouteErrorReason | null;
  /** Re-runs the trip route fetch after a failure. */
  onRetryTripRoute?: () => void;
  /** Slugs already in the trip. */
  tripSlugs?: string[];
  /** The trip's stops, in the same order the Trip Planner numbers them,
      independent of whatever category filter the browse view currently
      has applied — a stop added while browsing "cafes" must not vanish
      from the map the moment the filter switches to "restaurants". Each
      one gets its own dedicated destination pin, see `destinationIcon`. */
  tripDestinations?: Place[];
  /** Real road distance per stop (slug -> km), so the popup for a place
      already in the trip shows the same number as the Trip Planner and the
      drawn route, instead of the straight-line "near me" distance. */
  tripLegDistanceKm?: Record<string, number> | null;
  /** Adds a place to the trip if it is not already there and there is room.
      Never removes: "Directions" only ever grows the trip, it does not
      toggle a place back out. Removing a stop is a Trip Planner action. */
  onAddToTrip?: (slug: string) => void;
  tripFull?: boolean;
  /** One-tap hand-off to real navigation for the trip as it stands, shown
      from any pin's popup once the trip has at least one stop. */
  tripMapsUrl?: string | null;
  /** Status of the visitor's opt-in geolocation, to explain a stalled route. */
  locationStatus?: GeolocationStatus;
  isLocationSupported?: boolean;
  /** Triggers the browser's location prompt. Only ever called from a click. */
  onRequestLocation?: () => void;
  /** The planned trip, shown as a compact panel inside the map itself
      (under the legend) so seeing the route never means leaving the map. */
  tripItinerary?: Itinerary | null;
  onRemoveTripStop?: (slug: string) => void;
  onClearTrip?: () => void;
  /** Real road total distance, paired with `tripLegDistanceKm`. */
  totalRoadKm?: number | null;
  className?: string;
}

/** A tap anywhere on the base map that isn't a pin, popup, or overlay control
    clears the planned route — Leaflet markers, popups, and vector layers all
    disable click bubbling by default, so this only ever fires for genuine
    empty-map clicks. */
function ClearRouteOnMapClick({ onClear }: { onClear: () => void }) {
  useMapEvents({
    click: () => onClear(),
  });
  return null;
}

export default function PlacesMapCanvas({
  places,
  categoryLabels,
  categoryNames,
  userLocation,
  routePath,
  tripRoute,
  tripRouteStatus = "idle",
  tripRouteError = null,
  onRetryTripRoute,
  tripSlugs = [],
  tripDestinations = [],
  tripLegDistanceKm = null,
  onAddToTrip,
  tripFull = false,
  tripMapsUrl = null,
  locationStatus = "idle",
  isLocationSupported = true,
  onRequestLocation,
  tripItinerary = null,
  onRemoveTripStop,
  onClearTrip,
  totalRoadKm = null,
  className,
}: PlacesMapCanvasProps) {
  const t = useTranslations("places");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [map, setMap] = useState<L.Map | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);

  /* Which place "Directions" was last tapped for, so the popup's loading and
     error states (driven by the shared trip route below) only ever apply to
     the pin that actually asked for one. */
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [awaitingLocation, setAwaitingLocation] = useState(false);

  const handleDirections = useCallback(
    (place: Place) => {
      setPendingSlug(place.slug);
      if (!userLocation) {
        setAwaitingLocation(true);
        return;
      }
      setAwaitingLocation(false);
      if (!tripSlugs.includes(place.slug) && !tripFull) {
        onAddToTrip?.(place.slug);
      }
    },
    [userLocation, tripSlugs, tripFull, onAddToTrip]
  );

  // A newly opened pin starts clean: no stale pending request or location
  // prompt carried over from whatever popup was open before it.
  useEffect(() => {
    setPendingSlug(null);
    setAwaitingLocation(false);
  }, [selected?.slug]);

  // Once location is granted after a prompt from the popup, pick the pending
  // directions request back up automatically instead of making them tap twice.
  useEffect(() => {
    if (!awaitingLocation || !userLocation || !pendingSlug) return;
    setAwaitingLocation(false);
    if (!tripSlugs.includes(pendingSlug) && !tripFull) {
      onAddToTrip?.(pendingSlug);
    }
  }, [awaitingLocation, userLocation, pendingSlug, tripSlugs, tripFull, onAddToTrip]);

  // Frame the whole trip whenever its geometry changes, so a newly added
  // stop — or the first one — is never left just outside the viewport.
  useEffect(() => {
    const path = tripRoute?.path ?? routePath;
    if (!map || !path || path.length < 2) return;
    map.fitBounds(L.latLngBounds(path), { padding: [64, 64], maxZoom: 16, animate: true });
  }, [map, tripRoute, routePath]);
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

  const tripDestinationSlugs = useMemo(
    () => new Set(tripDestinations.map((place) => place.slug)),
    [tripDestinations]
  );

  /* Trip stops get their own dedicated destination pin (below) and must
     never also fold into a proximity cluster with their neighbours — that
     would occasionally hide the very pin this feature exists to keep
     visible. Everything else still clusters as normal. */
  const clusterablePlaces = useMemo(
    () => mapped.filter((place) => !tripDestinationSlugs.has(place.slug)),
    [mapped, tripDestinationSlugs]
  );

  /* Real street geometry when routing answered, the straight line between
     stops when it did not. */
  const tripPolyline = tripRoute?.path ?? routePath;

  /* One distance pill per leg, placed at the midpoint of the geometry it
     describes — the middle of the drawn road for a real route, the middle of
     the straight hop for the fallback. */
  const tripLegLabels = useMemo(() => {
    if (tripRoute?.legs?.length) {
      return tripRoute.legs
        .filter((leg) => leg.path.length > 0)
        .map((leg, index) => ({
          key: `leg-${index}`,
          position: leg.path[Math.floor(leg.path.length / 2)],
          distanceKm: leg.distanceKm,
        }));
    }
    if (!routePath || routePath.length < 2) return [];
    return routePath.slice(1).map((to, index) => {
      const from = routePath[index];
      return {
        key: `leg-${index}`,
        position: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2] as [number, number],
        distanceKm: haversineDistanceKm(
          { lat: from[0], lng: from[1] },
          { lat: to[0], lng: to[1] }
        ),
      };
    });
  }, [tripRoute, routePath]);

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

          {/* The planned route, under the pins so it never hides one. Real
              street geometry whenever the routing service answered; the
              straight line between stops only as a fallback, which is the
              honest shape to show when we could not compute the real one. A
              solid core over a soft, wider casing reads as a highlighted
              road, the way a real navigation app draws one — no dashing, so
              it never breaks up into a trail of dots at low zoom or on a
              long trip. Each leg still carries its own distance pill. */}
          {tripPolyline && tripPolyline.length > 1 && (
            <>
              <Polyline
                positions={tripPolyline}
                pathOptions={{
                  color: "var(--zellige)",
                  weight: 9,
                  opacity: 0.16,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
              <Polyline
                positions={tripPolyline}
                pathOptions={{
                  color: "var(--zellige)",
                  weight: 4,
                  opacity: 1,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
              {tripLegLabels.map((leg) => (
                <Marker
                  key={leg.key}
                  position={leg.position}
                  icon={legDistanceIcon(formatDistanceKm(leg.distanceKm, locale))}
                  interactive={false}
                  zIndexOffset={900}
                />
              ))}
            </>
          )}

          {/* Clicking empty map is how a planned route gets cleared without
              leaving the map — only wired up while a trip actually exists. */}
          {tripDestinations.length > 0 && onClearTrip && (
            <ClearRouteOnMapClick onClear={onClearTrip} />
          )}

          <MarkerLayer places={clusterablePlaces} selected={selected} onSelect={setSelected} />

          {/* Destination pins: one per trip stop, numbered to match the Trip
              Planner list. Rendered on their own rather than through
              MarkerLayer, so they never collapse into a cluster bubble and
              their name label never waits for a zoom threshold — the whole
              point is staying a legible, individually identifiable point at
              any zoom, including fully zoomed out. */}
          {tripDestinations.map((place, index) => {
            if (typeof place.lat !== "number" || typeof place.lng !== "number") return null;
            const isSelected = selected?.slug === place.slug;
            return (
              <Marker
                key={`destination-${place.slug}`}
                position={[place.lat, place.lng]}
                icon={destinationIcon(index + 1, isSelected)}
                title={place.name}
                zIndexOffset={2000 + (isSelected ? 1000 : 0)}
                eventHandlers={{ click: () => setSelected(place) }}
              >
                <Tooltip
                  permanent
                  direction="right"
                  offset={[16, -30]}
                  className={cn("atlas-label", isSelected && "atlas-label--active")}
                >
                  {place.name}
                </Tooltip>
              </Marker>
            );
          })}

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
                roadDistanceKm={tripLegDistanceKm?.[selected.slug]}
                tripFull={tripFull}
                tripMapsUrl={tripMapsUrl}
                pendingSlug={pendingSlug}
                onDirections={handleDirections}
                directionsStatus={pendingSlug === selected.slug ? tripRouteStatus : "idle"}
                directionsError={pendingSlug === selected.slug ? tripRouteError : null}
                onRetryDirections={() => onRetryTripRoute?.()}
                awaitingLocation={awaitingLocation}
                locationStatus={locationStatus}
                isLocationSupported={isLocationSupported}
                onEnableLocation={() => onRequestLocation?.()}
              />
            </Popup>
          )}
        </MapContainer>

        {/* Legend (desktop only, the bar under the map covers small screens)
            and, right under it, the planned trip — so seeing the route
            never means leaving the map. */}
        {(legendRows.length > 0 || (tripItinerary && tripItinerary.stops.length > 0)) && (
          <div
            className={cn(
              "pointer-events-none absolute left-4 z-10 flex max-h-[calc(100%-2rem)] flex-col items-start gap-3",
              isFullscreen ? "top-[max(1rem,env(safe-area-inset-top))]" : "top-4"
            )}
          >
            {legendRows.length > 0 && (
              <div className="pointer-events-auto hidden shrink-0 md:block">
                <Legend rows={legendRows} total={mapped.length} variant="card" />
              </div>
            )}
            {tripItinerary && tripItinerary.stops.length > 0 && (
              <div className="pointer-events-auto min-h-0 w-[13rem] min-w-0 overflow-y-auto sm:w-72">
                <TripPlanner
                  itinerary={tripItinerary}
                  onRemove={(slug) => onRemoveTripStop?.(slug)}
                  onClear={() => onClearTrip?.()}
                  tripLegDistanceKm={tripLegDistanceKm}
                  totalRoadKm={totalRoadKm}
                  tripMapsUrl={tripMapsUrl}
                  tripRouteStatus={tripRouteStatus}
                />
              </div>
            )}
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
