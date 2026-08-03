"use client";

// ============================================
// Atlas Munich – the trip panel
//
// Shows the stops a reader has picked, already ordered, with a running total
// and a hand-off to real navigation. Deliberately a summary and not a second
// map: the route is drawn on the map that is already on screen.
// ============================================

import { useTranslations, useLocale } from "next-intl";
import { Loader2, Route, X, ExternalLink } from "lucide-react";

import type { Itinerary } from "@/lib/itinerary";
import { formatDistanceKm } from "@/lib/geo";
import { MAX_STOPS } from "@/lib/itinerary";
import { placeAccents, fallbackAccent } from "./place-accents";
import { cn } from "@/lib/utils";

interface TripPlannerProps {
  /** Computed once in PlacesExplorer and shared with the map's popup, so
      the two never show a different order or a different distance for the
      same stop. */
  itinerary: Itinerary;
  onRemove: (slug: string) => void;
  onClear: () => void;
  /** Real road distance per stop (slug of the leg's destination -> km), from
      the same source the map's popup reads. Null while routing hasn't
      resolved yet or is unavailable, in which case every number here falls
      back to the straight-line itinerary distance instead. */
  tripLegDistanceKm: Record<string, number> | null;
  /** Real road total, paired with `tripLegDistanceKm` — always both or
      neither, so the per-stop numbers and the total never mix sources. */
  totalRoadKm: number | null;
  tripMapsUrl: string | null;
  tripRouteStatus?: "idle" | "loading" | "error";
}

export function TripPlanner({
  itinerary,
  onRemove,
  onClear,
  tripLegDistanceKm,
  totalRoadKm,
  tripMapsUrl,
  tripRouteStatus = "idle",
}: TripPlannerProps) {
  const t = useTranslations("places.trip");
  const locale = useLocale();

  if (itinerary.stops.length === 0) return null;

  const usingRoadDistances = tripLegDistanceKm !== null && totalRoadKm !== null;
  const totalKm = usingRoadDistances ? totalRoadKm : itinerary.totalKm;

  return (
    <aside className="rounded-2xl bg-card p-4 shadow-[0_2px_20px_rgb(0_0_0/0.06)] dark:shadow-none dark:ring-1 dark:ring-border">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
          {tripRouteStatus === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin text-zellige" aria-hidden="true" />
          ) : (
            <Route className="h-4 w-4 text-zellige" aria-hidden="true" />
          )}
          {t("title")}
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {itinerary.stops.length === 1
              ? t("oneStop")
              : t("stops", { count: itinerary.stops.length })}
          </span>
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          {t("clear")}
        </button>
      </div>

      <ol className="mt-3 space-y-1">
        {itinerary.stops.map((stop, index) => {
          const accent = placeAccents[stop.category] ?? fallbackAccent;
          const leg = itinerary.legs.find((l) => l.to.slug === stop.slug);
          const legDistanceKm = tripLegDistanceKm?.[stop.slug] ?? leg?.distanceKm;
          return (
            <li key={stop.slug} className="flex items-center gap-3 rounded-xl px-2 py-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums",
                  accent.tint,
                  accent.text
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-zinc-800 dark:text-zinc-100">
                  {stop.name}
                </span>
                {leg && legDistanceKm !== undefined && (
                  <span className="block truncate text-[11.5px] text-zinc-400 dark:text-zinc-500">
                    {t("leg", { distance: formatDistanceKm(legDistanceKm, locale) })}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => onRemove(stop.slug)}
                aria-label={t("remove")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-muted hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>

      {itinerary.legs.length > 0 && (
        <p className="mt-2 px-2 text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">
          {t("total", { distance: formatDistanceKm(totalKm, locale) })}
        </p>
      )}

      {tripMapsUrl && (
        <a
          href={tripMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-zellige px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zellige/50"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {t("openInMaps")}
        </a>
      )}

      {/* Said plainly, either way: whether this is real road distance or a
          straight-line placeholder while routing loads or is unavailable. */}
      <p className="mt-2 text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        {usingRoadDistances ? t("liveRouting") : t("estimate")}
      </p>

      {itinerary.stops.length >= MAX_STOPS && (
        <p className="mt-1 text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          {t("hint", { max: MAX_STOPS })}
        </p>
      )}
    </aside>
  );
}
