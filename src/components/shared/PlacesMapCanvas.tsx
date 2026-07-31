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
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { ExternalLink, Maximize, MapPin, Minus, Plus, Star } from "lucide-react";

import type { Place } from "@/types";
import { placeAccents } from "./PlaceCard";
import { cn } from "@/lib/utils";

const MUNICH_CENTER: [number, number] = [48.1372, 11.5756];

/* Pixel radius used to decide when two places collapse into one cluster */
const CLUSTER_RADIUS = 66;

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
  cowork:
    '<path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"/><path d="M20.054 15.987H3.946"/>',
  barber:
    '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
};

const FALLBACK_GLYPH = '<circle cx="12" cy="12" r="3.5"/>';

/** The `--acc-*` token behind a category, so markers match the page pills. */
function accentColor(category: string) {
  const key = placeAccents[category]?.key;
  return key ? `var(--acc-${key})` : "var(--zellige)";
}

/* ---------------------------------------------------------------- markers */

const iconCache = new Map<string, L.DivIcon>();

function pinIcon(category: string, active: boolean) {
  const cacheKey = `${category}:${active ? "on" : "off"}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const glyph = CATEGORY_GLYPHS[category] ?? FALLBACK_GLYPH;
  const icon = L.divIcon({
    className: "atlas-marker",
    html: `<div class="atlas-pin${active ? " atlas-pin--active" : ""}" style="--pin:${accentColor(category)}">
      <svg viewBox="0 0 32 40" width="32" height="40" aria-hidden="true">
        <path class="atlas-pin__body" d="M16 38.5C16 38.5 28.5 24.6 28.5 15A12.5 12.5 0 1 0 3.5 15C3.5 24.6 16 38.5 16 38.5Z"/>
        <g class="atlas-pin__glyph" transform="translate(8.5 7.5) scale(0.625)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
      </svg>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });

  iconCache.set(cacheKey, icon);
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
          return (
            <Marker
              key={place.slug}
              position={[place.lat!, place.lng!]}
              icon={pinIcon(place.category, selected?.slug === place.slug)}
              title={place.name}
              zIndexOffset={selected?.slug === place.slug ? 1000 : 0}
              eventHandlers={{ click: () => onSelect(place) }}
            />
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

function PlacePopupCard({ place, label }: { place: Place; label: string }) {
  const t = useTranslations("places");
  const color = accentColor(place.category);
  const directions = place.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`
    : `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;

  return (
    <div className="p-4">
      <span
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
        style={{ color }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} aria-hidden />
        {label}
      </span>

      <h3 className="font-display mt-1.5 pr-7 text-[15px] font-bold leading-snug tracking-tight text-zinc-900 dark:text-white">
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
        <span>{place.address}</span>
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
    <div className="w-[13rem] rounded-2xl bg-card p-4 shadow-[0_8px_30px_rgb(0_0_0/0.10)] dark:shadow-none dark:ring-1 dark:ring-white/10">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
        {t("map.legend")}
      </p>
      <p className="font-display mt-1 text-2xl font-bold leading-none tracking-tight text-zinc-900 dark:text-white">
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
  className?: string;
}

export default function PlacesMapCanvas({
  places,
  categoryLabels,
  categoryNames,
  className,
}: PlacesMapCanvasProps) {
  const t = useTranslations("places");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [map, setMap] = useState<L.Map | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);

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

  return (
    <div className="atlas-map overflow-hidden rounded-[2rem] bg-card shadow-[0_2px_24px_rgb(0_0_0/0.08)] dark:shadow-none dark:ring-1 dark:ring-white/10">
      <div className={cn("relative w-full", className)}>
        <MapContainer
          ref={setMap}
          center={MUNICH_CENTER}
          zoom={12}
          minZoom={10}
          maxZoom={18}
          zoomControl={false}
          scrollWheelZoom={false}
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

          <MarkerLayer places={mapped} selected={selected} onSelect={setSelected} />

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
              />
            </Popup>
          )}
        </MapContainer>

        {/* Legend, desktop only: the bar under the map covers small screens */}
        {legendRows.length > 0 && (
          <div className="pointer-events-none absolute left-4 top-4 z-10 hidden md:block">
            <div className="pointer-events-auto">
              <Legend rows={legendRows} total={mapped.length} variant="card" />
            </div>
          </div>
        )}

        {/* Zoom and framing controls, kept clear of the legend and the attribution */}
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-1 rounded-2xl bg-card p-1 shadow-[0_8px_30px_rgb(0_0_0/0.10)] dark:shadow-none dark:ring-1 dark:ring-white/10">
          <button
            type="button"
            onClick={() => map?.zoomIn()}
            aria-label={t("map.zoomIn")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => map?.zoomOut()}
            aria-label={t("map.zoomOut")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => fitToPlaces(true)}
            aria-label={t("map.fit")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>

        {mapped.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
            <div className="rounded-2xl bg-card px-6 py-5 text-center shadow-[0_8px_30px_rgb(0_0_0/0.10)] dark:shadow-none dark:ring-1 dark:ring-white/10">
              <p className="font-display text-base font-bold text-zinc-900 dark:text-white">
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
      <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="md:hidden">
          <Legend rows={legendRows} total={mapped.length} variant="bar" />
        </div>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 md:ml-auto">{t("mapNote")}</p>
      </div>
    </div>
  );
}
