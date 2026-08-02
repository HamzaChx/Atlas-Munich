"use client";

// ============================================
// Atlas Munich – the trip panel
//
// Shows the stops a reader has picked, already ordered, with a running total
// and a hand-off to real navigation. Deliberately a summary and not a second
// map: the route is drawn on the map that is already on screen.
// ============================================

import { useTranslations, useLocale } from "next-intl";
import { Route, X, ExternalLink } from "lucide-react";

import type { Place } from "@/types";
import type { Coordinates } from "@/lib/geo";
import { formatDistanceKm } from "@/lib/geo";
import { planItinerary, MAX_STOPS } from "@/lib/itinerary";
import { multiStopDirectionsUrl } from "@/lib/maps";
import { placeAccents, fallbackAccent } from "./place-accents";
import { cn } from "@/lib/utils";

interface TripPlannerProps {
  stops: Place[];
  origin: Coordinates | null;
  onRemove: (slug: string) => void;
  onClear: () => void;
}

export function TripPlanner({ stops, origin, onRemove, onClear }: TripPlannerProps) {
  const t = useTranslations("places.trip");
  const locale = useLocale();

  if (stops.length === 0) return null;

  const itinerary = planItinerary(stops, origin);
  const mapsUrl = multiStopDirectionsUrl(itinerary.stops, origin);

  return (
    <aside className="rounded-2xl bg-card p-4 shadow-[0_2px_20px_rgb(0_0_0/0.06)] dark:shadow-none dark:ring-1 dark:ring-border">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
          <Route className="h-4 w-4 text-zellige" aria-hidden="true" />
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
                {leg && (
                  <span className="block truncate text-[11.5px] text-zinc-400 dark:text-zinc-500">
                    {t("leg", {
                      distance: formatDistanceKm(leg.distanceKm, locale),
                      minutes: leg.minutes,
                    })}
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
          {t("total", {
            distance: formatDistanceKm(itinerary.totalKm, locale),
            minutes: itinerary.totalMinutes,
          })}
        </p>
      )}

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-zellige px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zellige/50"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {t("openInMaps")}
        </a>
      )}

      {/* Said plainly: these are straight-line estimates, not live routing. */}
      <p className="mt-2 text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        {t("estimate")}
      </p>

      {stops.length >= MAX_STOPS && (
        <p className="mt-1 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          {t("hint", { max: MAX_STOPS })}
        </p>
      )}
    </aside>
  );
}
