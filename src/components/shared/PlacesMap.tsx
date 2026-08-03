"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { Place } from "@/types";
import { cn } from "@/lib/utils";
import type { Coordinates } from "@/lib/geo";
import type { GeolocationStatus } from "@/hooks/useGeolocation";
import type { RoadRoute, RouteErrorReason } from "@/lib/routing";

interface PlacesMapProps {
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
  /** Real road distance per stop (slug -> km), so a place already in the
      trip shows the same number here as it does in the Trip Planner and on
      the drawn route, instead of the straight-line "near me" distance. */
  tripLegDistanceKm?: Record<string, number> | null;
  /** Adds a place to the trip if it is not already there and there is room. */
  onAddToTrip?: (slug: string) => void;
  tripFull?: boolean;
  /** One-tap hand-off to real navigation for the trip as it stands. */
  tripMapsUrl?: string | null;
  /** Status of the visitor's opt-in geolocation, to explain a stalled route. */
  locationStatus?: GeolocationStatus;
  isLocationSupported?: boolean;
  /** Triggers the browser's location prompt. Only ever called from a click. */
  onRequestLocation?: () => void;
  className?: string;
}

function MapSkeleton({ className }: { className?: string }) {
  const t = useTranslations("places");
  return (
    <div className="overflow-hidden rounded-[2rem] bg-card shadow-[0_2px_24px_rgb(0_0_0/0.08)] dark:shadow-none dark:ring-1 dark:ring-border">
      <div className={cn("flex w-full items-center justify-center bg-muted", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zellige border-t-transparent" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{t("loadingMap")}</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">{t("mapNote")}</p>
      </div>
    </div>
  );
}

/* Leaflet touches `window` on import, so the canvas is browser only */
const PlacesMapCanvas = dynamic(() => import("./PlacesMapCanvas"), {
  ssr: false,
  loading: () => <MapSkeleton className="h-[60vh] min-h-[26rem] sm:h-[38rem]" />,
});

export function PlacesMap({
  places,
  categoryLabels,
  categoryNames,
  userLocation,
  routePath,
  tripRoute,
  tripRouteStatus,
  tripRouteError,
  onRetryTripRoute,
  tripSlugs,
  tripLegDistanceKm,
  onAddToTrip,
  tripFull,
  tripMapsUrl,
  locationStatus,
  isLocationSupported,
  onRequestLocation,
  className,
}: PlacesMapProps) {
  return (
    <PlacesMapCanvas
      places={places}
      categoryLabels={categoryLabels}
      categoryNames={categoryNames}
      userLocation={userLocation}
      routePath={routePath}
      tripRoute={tripRoute}
      tripRouteStatus={tripRouteStatus}
      tripRouteError={tripRouteError}
      onRetryTripRoute={onRetryTripRoute}
      tripSlugs={tripSlugs}
      tripLegDistanceKm={tripLegDistanceKm}
      onAddToTrip={onAddToTrip}
      tripFull={tripFull}
      tripMapsUrl={tripMapsUrl}
      locationStatus={locationStatus}
      isLocationSupported={isLocationSupported}
      onRequestLocation={onRequestLocation}
      className={cn("h-[60vh] min-h-[26rem] sm:h-[38rem]", className)}
    />
  );
}
